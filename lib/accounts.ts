import { DatabaseSync } from 'node:sqlite';
import { randomBytes, scrypt as scryptCallback, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
const scrypt = promisify(scryptCallback);
let database: DatabaseSync | undefined;
export function accounts() {
  if (database) return database;
  const dir = process.env.ACCOUNT_DATA_DIR || path.join(process.cwd(), '.data');
  mkdirSync(dir, {recursive: true});
  database = new DatabaseSync(path.join(dir, 'accounts.sqlite'));
  database.exec(`PRAGMA journal_mode=WAL;
    CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, salt TEXT NOT NULL, password_hash TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL, expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS attempts (email TEXT PRIMARY KEY, count INTEGER NOT NULL, reset_at INTEGER NOT NULL);`);
  return database;
}
export const cookieName = 'jan_seva_session';
export const digest = (token: string) => createHash('sha256').update(token).digest('hex');
export async function passwordHash(password: string, salt: string) { return (await scrypt(password, salt, 64) as Buffer).toString('hex'); }
export async function checkPassword(password: string, salt: string, hash: string) { return timingSafeEqual(Buffer.from(await passwordHash(password, salt), 'hex'), Buffer.from(hash, 'hex')); }
export function newSession(userId: string) {
  const token = randomBytes(32).toString('hex');
  accounts().prepare('DELETE FROM sessions WHERE expires < ?').run(Date.now());
  accounts().prepare('INSERT INTO sessions VALUES (?, ?, ?)').run(digest(token), userId, Date.now() + 7 * 86400000);
  return token;
}
