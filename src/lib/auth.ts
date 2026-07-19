import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const COOKIE = 'codexcrm_session';
const PLACEHOLDER_SECRETS = new Set(['', 'dev-secret', 'change-me', 'changeme', 'placeholder']);

function sessionSecret() {
  const secret = process.env.DEMO_SESSION_SECRET?.trim() || '';

  if (process.env.NODE_ENV === 'production' && PLACEHOLDER_SECRETS.has(secret)) {
    throw new Error('DEMO_SESSION_SECRET must be set to a strong, non-placeholder value in production.');
  }

  return secret || 'dev-secret';
}

export async function isAuthed() {
  return (await cookies()).get(COOKIE)?.value === sessionSecret();
}

export async function requireAuth() {
  if (!(await isAuthed())) {
    redirect('/');
  }
}

export async function setSession() {
  (await cookies()).set(COOKIE, sessionSecret(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.COOKIE_SECURE === 'true' || process.env.APP_BASE_URL?.startsWith('https://') === true,
    path: '/',
  });
}

export async function clearSession() {
  (await cookies()).delete(COOKIE);
}
