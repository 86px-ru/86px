import { getPublicClient, isSupabaseConfigured } from './supabase';

export type StatItem = { value: number; suffix: string; label: string };

export type HeroContent = {
  titleLine1: string;
  titlePrefix: string;
  titleAccent: string;
  text: string;
  status: string;
  meta: string;
  stats: StatItem[];
};

export type ServicesContent = {
  items: { title: string; text: string; tags: string }[];
};

export type ProcessContent = {
  steps: { title: string; text: string }[];
};

export type TestimonialsContent = {
  items: { text: string; name: string; role: string; initials: string; colorA: string; colorB: string }[];
};

export type CtaContent = {
  titleLine1: string;
  titleAccent: string;
  email: string;
};

export type ContentMap = {
  hero: HeroContent;
  services: ServicesContent;
  process: ProcessContent;
  testimonials: TestimonialsContent;
  cta: CtaContent;
};

export const CONTENT_KEYS: (keyof ContentMap)[] = ['hero', 'services', 'process', 'testimonials', 'cta'];

export const DEFAULT_CONTENT: ContentMap = {
  hero: {
    titleLine1: 'Создаём сайты,',
    titlePrefix: 'которые',
    titleAccent: 'запоминаются',
    text: 'Помогаем брендам выделяться через дизайн, технологии и смелые идеи — от первой концепции до запуска.',
    status: 'Открыты для новых проектов',
    meta: 'Студия веб-дизайна · работаем по всему миру',
    stats: [
      { value: 120, suffix: '+', label: 'реализованных проектов' },
      { value: 8, suffix: ' лет', label: 'создаём digital-продукты' },
      { value: 14, suffix: '', label: 'наград за дизайн' },
    ],
  },
  services: {
    items: [
      {
        title: 'Веб-дизайн',
        text: 'Лендинги, корпоративные сайты и интернет-магазины, которые превращают посетителей в клиентов.',
        tags: 'UI/UX · Прототипы · Дизайн-системы',
      },
      {
        title: 'Разработка',
        text: 'Быстрые и надёжные сайты на современном стеке: от статики до сложных веб-приложений.',
        tags: 'Frontend · CMS · Анимации',
      },
      {
        title: 'Брендинг',
        text: 'Айдентика, которая работает: логотипы, фирменный стиль и гайдлайны для всех каналов.',
        tags: 'Логотипы · Айдентика · Гайдлайны',
      },
      {
        title: 'Моушн и 3D',
        text: 'Интерактивные сценарии, WebGL и микроанимации, которые делают интерфейс живым.',
        tags: 'WebGL · 3D · Интерактив',
      },
    ],
  },
  process: {
    steps: [
      {
        title: 'Исследование',
        text: 'Изучаем рынок, конкурентов и аудиторию. Формулируем цели проекта и критерии успеха.',
      },
      {
        title: 'Концепция',
        text: 'Прорабатываем стратегию, структуру и визуальный образ будущего продукта.',
      },
      {
        title: 'Дизайн и разработка',
        text: 'Создаём интерфейсы, пишем код, добавляем анимации — всё в тесной связке друг с другом.',
      },
      {
        title: 'Запуск и рост',
        text: 'Тестируем, запускаем, анализируем метрики и помогаем продукту развиваться дальше.',
      },
    ],
  },
  testimonials: {
    items: [
      {
        text: 'Команда 86px сделала нам сайт, которым мы гордимся. Конверсия выросла в полтора раза уже в первый месяц после запуска.',
        name: 'Анна Ковалёва',
        role: 'CMO, Aurora',
        initials: 'АК',
        colorA: '#d7ff3f',
        colorB: '#8b7bff',
      },
      {
        text: 'Редкое сочетание: отличный вкус и железная дисциплина. Все сроки соблюдены, результат превзошёл ожидания.',
        name: 'Дмитрий Морозов',
        role: 'Основатель, Tektum',
        initials: 'ДМ',
        colorA: '#8b7bff',
        colorB: '#4dd6ff',
      },
      {
        text: 'Поняли нашу задачу с полуслова и предложили решения, до которых мы сами бы не додумались. Работаем уже третий год.',
        name: 'Елена Соколова',
        role: 'Руководитель, Kofein',
        initials: 'ЕС',
        colorA: '#ff7ad9',
        colorB: '#d7ff3f',
      },
    ],
  },
  cta: {
    titleLine1: 'Есть идея?',
    titleAccent: 'Давайте обсудим',
    email: 'hello@86px.studio',
  },
};

export async function getContent<K extends keyof ContentMap>(key: K): Promise<ContentMap[K]> {
  const fallback = DEFAULT_CONTENT[key];
  if (!isSupabaseConfigured) return fallback;
  try {
    const { data, error } = await getPublicClient()
      .from('site_content')
      .select('value')
      .eq('key', key)
      .maybeSingle();
    if (error || !data?.value) return fallback;
    return { ...fallback, ...(data.value as Partial<ContentMap[K]>) };
  } catch {
    return fallback;
  }
}
