import WorksGrid, { type WorkItem } from '@/components/WorksGrid';
import { getPublicClient, isSupabaseConfigured } from '@/lib/supabase';

const FALLBACK: WorkItem[] = [
  { id: 'fb1', index: '01', title: 'Aurora', description: 'Финтех-приложение', chips: ['Mobile', 'Product'], variant: 'v1', image_url: null },
  { id: 'fb2', index: '02', title: 'Tektum', description: 'Бюро архитектуры', chips: ['Сайт', '3D'], variant: 'v2', image_url: null },
  { id: 'fb3', index: '03', title: 'Pulse', description: 'Музыкальный стриминг', chips: ['Веб-приложение', 'UI/UX'], variant: 'v3', image_url: null },
  { id: 'fb4', index: '04', title: 'Sever', description: 'Fashion e-commerce', chips: ['Магазин', 'Брендинг'], variant: 'v4', image_url: null },
  { id: 'fb5', index: '05', title: 'Orbita', description: 'SaaS-платформа', chips: ['Dashboard', 'Product'], variant: 'v5', image_url: null },
  { id: 'fb6', index: '06', title: 'Kofein', description: 'Сеть кофеен', chips: ['Сайт', 'Айдентика'], variant: 'v6', image_url: null },
];

async function fetchProjects(): Promise<WorkItem[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await getPublicClient()
      .from('projects')
      .select('id, title, description, tags, variant, image_url')
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return null;
    return data.map((p, i) => ({
      id: String(p.id),
      index: String(i + 1).padStart(2, '0'),
      title: String(p.title ?? ''),
      description: String(p.description ?? ''),
      chips: String(p.tags ?? '')
        .split(',')
        .map((t: string) => t.trim())
        .filter(Boolean),
      variant: String(p.variant ?? 'v1'),
      image_url: p.image_url ? String(p.image_url) : null,
    }));
  } catch {
    return null;
  }
}

export default async function Works() {
  const projects = (await fetchProjects()) ?? FALLBACK;

  return (
    <section className="section works" id="works">
      <div className="container">
        <div className="section__head" data-reveal>
          <span className="section__label">/ 02 — Работы</span>
          <h2 className="section__title">Избранные <em>проекты</em></h2>
        </div>
        <WorksGrid projects={projects} />
      </div>
    </section>
  );
}
