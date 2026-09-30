'use client';
import {useEffect, useRef, useState, type FormEvent} from 'react';
import {X} from 'lucide-react';
type User = {id: string; name: string; email: string};
export function initials(name: string) {
  const parts = name.trim().split(/\s+/u).filter(Boolean);
  return (Array.from(parts[0] || '')[0] || '') .concat(parts.length > 1 ? Array.from(parts[parts.length - 1])[0] || '' : '').toLocaleUpperCase();
}
export default function Account() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('signup');
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    fetch('/api/account').then(async r => {if (!r.ok) throw Error('Account service is unavailable.');setUser((await r.json()).user);}).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    if (!open) return;
    dialog.current?.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {document.body.style.overflow = old;};
  }, [open]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    await request('POST', {...values, action: mode});
  }
  async function request(method: string, body?: object) {
    setPending(true);setError('');
    try {
      const response = await fetch('/api/account', {method, headers: {'Content-Type': 'application/json'}, body: body ? JSON.stringify(body) : undefined});
      const data = await response.json();
      if (!response.ok) throw Error(data.error || 'Please try again.');
      setUser(data.user);setOpen(false);
    } catch(e) {setError(e instanceof Error ? e.message : 'Please try again.');}
    finally {setPending(false);}
  }
  return <><button className={user ? 'avatar account-avatar' : 'secondary'} disabled={loading} onClick={() => setOpen(true)} aria-label={user ? `Account: ${user.name}` : 'Sign up or sign in'} title={user?.name}>{user ? initials(user.name) : loading ? 'Loading…' : 'Sign up / Sign in'}</button>
  {open && <dialog ref={dialog} aria-labelledby="account-title" onCancel={() => setOpen(false)} onClick={e => {if (e.target === e.currentTarget) setOpen(false);}}><div className="modal-head"><h2 id="account-title">{user ? 'Your account' : mode === 'signup' ? 'Create your account' : 'Welcome back'}</h2><button className="round" aria-label="Close account dialog" onClick={() => setOpen(false)}><X size={20}/></button></div><div className="modal-body">{user ? <><h3>{user.name}</h3><p>{user.email}</p><button className="secondary full" disabled={pending} onClick={() => request('DELETE')}>{pending ? 'Signing out…' : 'Sign out'}</button></> : <form onSubmit={submit} key={mode}>{mode === 'signup' && <label>Full name<input name="name" autoComplete="name" required maxLength={80} placeholder="Your name"/></label>}<label>Email<input name="email" type="email" autoComplete="email" required maxLength={254}/></label><label>Password<input name="password" type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} required minLength={12} maxLength={128}/><small>Use 12–128 characters.</small></label><p className="fine">Citizen accounts do not grant government authority access. Your email is not shown on public reports.</p><button className="primary full" disabled={pending}>{pending ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}</button><button type="button" className="text-button" disabled={pending} onClick={() => {setMode(mode === 'signup' ? 'signin' : 'signup');setError('');}}>{mode === 'signup' ? 'Already have an account? Sign in' : 'New here? Create an account'}</button></form>}{error && <p className="error" role="alert">{error}</p>}</div></dialog>}</>;
}
