import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/session';
import { getServiceClient } from '@/lib/supabase';

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Требуется вход' }, { status: 401 });
  }
  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 });
  }

  const patch: Record<string, unknown> = {};
  if (typeof body.title === 'string') patch.title = body.title.trim().slice(0, 120);
  if (typeof body.description === 'string') patch.description = body.description.trim().slice(0, 300);
  if (typeof body.tags === 'string') patch.tags = body.tags.trim().slice(0, 120);
  if (typeof body.variant === 'string') patch.variant = body.variant;
  if (body.image_url === null) patch.image_url = null;
  else if (typeof body.image_url === 'string' && body.image_url.startsWith('http'))
    patch.image_url = body.image_url.slice(0, 500);
  if (typeof body.is_published === 'boolean') patch.is_published = body.is_published;

  const { data, error } = await getServiceClient()
    .from('projects')
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: Request, { params }: Params) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Требуется вход' }, { status: 401 });
  }
  const { id } = await params;
  const { error } = await getServiceClient().from('projects').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
