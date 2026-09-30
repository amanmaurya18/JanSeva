import {env} from 'cloudflare:workers';
export function db(){const d=(env as any).DB;if(!d)throw new Error('Storage unavailable');return d;}
export function failure(e:unknown){console.error(e);return Response.json({error:'Could not save or load data. Please retry; your input has been kept.'},{status:503});}
export function sameOrigin(r:Request){const origin=r.headers.get('origin');return !origin||origin===new URL(r.url).origin;}
