import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAdmin } from '@/lib/session';
import { getServiceClient } from '@/lib/supabase';

const VARIANTS = ['v1', 'v2', 'v3', 'v4', 'v5', 'v6'];

function sanitize(body: Record<string, unknown>) {
  const title = typeof body.title === 'string' ? body.title.trim().slice(0, 120) : '';
  const description = typeof body.description === 'string' ? body.description.trim().slice(0, 300) : '';
  const tags = typeof body.tags === 'string' ? body.tags.trim().slice(0, 120) : '';
  const variant = VARIANTS.includes(body.variant as string) ? (body.variant as string) : 'v1';
  const image_url =
    typeof body.image_url === 'string' && body.image_url.startsWith('http')
      ? body.image_url.slice(0, 500)
      : null;
  const is_published = body.is_published !== false;
  return { title, description, tags, variant, image_url, is_published };
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Требуется вход' }, { status: 401 });
  }
  const { data, error } = await getServiceClient()
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Требуется вход' }, { status: 401 });
  }
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 });
  }
  const project = sanitize(body);
  if (!project.title) {
    return NextResponse.json({ error: 'Название обязательно' }, { status: 400 });
  }
  const { data, error } = await getServiceClient().from('projects').insert(project).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath('/');
  return NextResponse.json(data, { status: 201 });
}
