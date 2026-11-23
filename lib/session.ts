import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'admin_session';
const MAX_AGE_SEC = 60 * 60 * 24 * 7;

function secret(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
}

function sign(expiry: string): string {
  return createHmac('sha256', secret()).update(expiry).digest('hex');
}

export function buildSessionValue(): string {
  const expiry = String(Date.now() + MAX_AGE_SEC * 1000);
  return `${expiry}.${sign(expiry)}`;
}

export function verifySessionValue(value: string | undefined): boolean {
  if (!value || !secret()) return false;
  const [expiry, sig] = value.split('.');
  if (!expiry || !sig || Number(expiry) < Date.now()) return false;
  const expected = Buffer.from(sign(expiry));
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionValue(store.get(SESSION_COOKIE)?.value);
}
