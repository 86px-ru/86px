import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAdmin } from '@/lib/session';
import { getServiceClient } from '@/lib/supabase';
import { CONTENT_KEYS, type ContentMap } from '@/lib/content';

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Требуется вход' }, { status: 401 });
  }
  const { data, error } = await getServiceClient().from('site_content').select('key, value');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Требуется вход' }, { status: 401 });
  }
  let body: { key?: unknown; value?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 });
  }
  const key = body.key as keyof ContentMap;
  if (!CONTENT_KEYS.includes(key) || typeof body.value !== 'object' || body.value === null) {
    return NextResponse.json({ error: 'Неизвестный ключ или некорректное значение' }, { status: 400 });
  }
  const { error } = await getServiceClient()
    .from('site_content')
    .upsert({ key, value: body.value, updated_at: new Date().toISOString() });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath('/');
  return NextResponse.json({ ok: true });
}
