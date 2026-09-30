import { NextRequest, NextResponse } from 'next/server';
import { randomBytes, randomUUID } from 'node:crypto';
import {accounts, cookieName, digest, passwordHash, checkPassword, newSession} from '../../../lib/accounts';
export const runtime = 'nodejs';
const options = {httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/', maxAge: 7 * 86400};
function sameOrigin(req: NextRequest) { return req.headers.get('origin') === req.nextUrl.origin; }
function error(message: string, status = 400) { return NextResponse.json({error: message}, {status}); }
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(cookieName)?.value;
    const user = token ? accounts().prepare('SELECT users.id, users.name, users.email FROM sessions JOIN users ON users.id = sessions.user_id WHERE token_hash = ? AND expires > ?').get(digest(token), Date.now()) : null;
    return NextResponse.json({user: user || null}, {headers: {'Cache-Control': 'no-store'}});
  } catch { return error('Account storage is unavailable.', 503); }
}
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return error('Forbidden', 403);
  try {
    if (Number(req.headers.get('content-length') || 0) > 8192) return error('Request too large', 413);
    const raw = await req.text();
    if (raw.length > 8192) return error('Request too large', 413);
    const body = JSON.parse(raw);
    if (!body || !['signup', 'signin'].includes(body.action) || typeof body.email !== 'string' || typeof body.password !== 'string') return error('Enter your email and password.');
    const email = body.email.trim().toLowerCase();
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || body.password.length < 12 || body.password.length > 128) return error('Use a valid email and a password of 12–128 characters.');
    const name = typeof body.name === 'string' ? body.name.trim().replace(/\s+/g, ' ') : '';
    if (body.action === 'signup' && (!name || name.length > 80)) return error('Enter your name (1–80 characters).');
    const db = accounts();
    db.prepare('DELETE FROM attempts WHERE reset_at < ?').run(Date.now());
    db.prepare('INSERT INTO attempts VALUES (?, 1, ?) ON CONFLICT(email) DO UPDATE SET count = count + 1').run(email, Date.now() + 15 * 60000);
    const attempt = db.prepare('SELECT count FROM attempts WHERE email = ?').get(email) as {count: number};
    if (attempt.count > 10) return error('Too many attempts. Try again in 15 minutes.', 429);
    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as {id: string; name: string; email: string; salt: string; password_hash: string} | undefined;
    if (body.action === 'signup') {
      if (user) return error('Unable to create this account. Try signing in.', 409);
      const salt = randomBytes(16).toString('hex');
      user = {id: randomUUID(), name, email, salt, password_hash: await passwordHash(body.password, salt)};
      db.prepare('INSERT INTO users VALUES (?, ?, ?, ?, ?)').run(user.id, name, email, salt, user.password_hash);
    } else {
      const valid = await checkPassword(body.password, user?.salt || 'missing-account', user?.password_hash || '00'.repeat(64));
      if (!user || !valid) return error('Email or password is incorrect.', 401);
    }
    db.prepare('DELETE FROM attempts WHERE email = ?').run(email);
    const response = NextResponse.json({user: {id: user.id, name: user.name, email: user.email}});
    const old = req.cookies.get(cookieName)?.value;
    if (old) db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(digest(old));
    response.cookies.set(cookieName, newSession(user.id), options);
    return response;
  } catch (e) {
    if (e instanceof SyntaxError) return error('Invalid request.');
    return error('Account service unavailable. Please try again.', 503);
  }
}
export async function DELETE(req: NextRequest) {
  if (!sameOrigin(req)) return error('Forbidden', 403);
  try {
    const token = req.cookies.get(cookieName)?.value;
    if (token) accounts().prepare('DELETE FROM sessions WHERE token_hash = ?').run(digest(token));
    const response = NextResponse.json({user: null});
    response.cookies.set(cookieName, '', {...options, maxAge: 0});
    return response;
  } catch { return error('Could not sign out. Please retry.', 503); }
}
