import { cookies } from 'next/headers';
const COOKIE='codexcrm_session';
export async function isAuthed(){ return (await cookies()).get(COOKIE)?.value === process.env.DEMO_SESSION_SECRET; }
export async function requireAuth(){ if(!(await isAuthed())) throw new Error('Unauthorized'); }
export async function setSession(){ (await cookies()).set(COOKIE, process.env.DEMO_SESSION_SECRET || 'dev-secret', { httpOnly:true, sameSite:'lax', secure:process.env.NODE_ENV==='production', path:'/' }); }
export async function clearSession(){ (await cookies()).delete(COOKIE); }
