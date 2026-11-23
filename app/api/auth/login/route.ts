import { createHash, timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';
import { SESSION_COOKIE, buildSessionValue } from '@/lib/session';

function safeEqual(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
}

export async function POST(req: Request) {
  if (!process.env.ADMIN_PASSWORD || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: 'Админка не настроена: задайте ADMIN_PASSWORD и SUPABASE_SERVICE_ROLE_KEY.' },
      { status: 503 }
    );
  }

  let body: { password?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    /* пустое тело */
  }

  if (typeof body.password !== 'string' || !safeEqual(body.password, process.env.ADMIN_PASSWORD)) {
    return NextResponse.json({ error: 'Неверный пароль' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, buildSessionValue(), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === 'production',
  });
  return res;
}
