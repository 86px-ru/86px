# 86px® — студия веб-дизайна

Сайт студии веб-дизайна на **Next.js 15** (App Router, TypeScript) с анимациями,
кастомным курсором и адаптивной вёрсткой.

## Стек

- Next.js 15 (App Router)
- React 19
- TypeScript
- Чистый CSS (без UI-фреймворков)
- Шрифты Unbounded и Manrope — self-hosted в `public/fonts` (woff2, кириллица + латиница, сборка без обращений к Google Fonts)

## Локальная разработка

```bash
npm install
npm run dev
```

Сайт будет доступен на http://localhost:3000.

Production-сборка локально:

```bash
npm run build
npm start
```

## Публикация на GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<ваш-логин>/86px.git
git push -u origin main
```

## Деплой на Coolify

Проект собирается через многоступенчатый `Dockerfile`
(standalone-сборка Next.js, порт `3000`).

1. В Coolify: **Projects → Add → Resource → Public Repository**
   (или Private Repository с доступом к вашему GitHub).
2. Укажите URL репозитория: `https://github.com/<ваш-логин>/86px`, ветка `main`.
3. **Build Pack: Dockerfile** — Coolify подхватит `Dockerfile` из корня
   (Nixpacks тоже подойдёт: команды сборки `npm run build`, запуск `npm run start`).
4. Порт контейнера: `3000`.
5. Нажмите **Deploy**.

После каждого `git push` в ветку `main` Coolify при включённом авто-деплое
будет пересобирать и публиковать сайт автоматически.

## Админка портфолио

Сайт умеет показывать проекты из Supabase и редактировать их через `/admin`
(вход по паролю, добавление/редактирование/удаление, загрузка обложек в Supabase Storage).
Секция «Работы» обновляется без пересборки (кэш 60 с). Если Supabase недоступен —
показываются встроенные проекты из кода.

### Настройка (один раз)

1. **Таблица в Supabase.** Откройте SQL Editor вашего проекта (bd.86px.ru) и выполните:

```sql
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  tags text not null default '',
  variant text not null default 'v1',
  image_url text,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;

create policy "public read published" on public.projects
  for select using (is_published = true);
```

2. **Переменные окружения** (в Coolify: приложение → Environment Variables):

| Переменная | Где взять |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | уже есть (shared) — `https://bd.86px.ru` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | уже есть (shared) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → `service_role` key (**секрет**, только сервер) |
| `ADMIN_PASSWORD` | придумайте пароль для входа в `/admin` |

Бакет для обложек (`portfolio-covers`) создаётся автоматически при первой загрузке файла.

3. **Redeploy**. Админка: `https://86px.ru/admin`.

## Структура

```
app/            # App Router: layout, страница, глобальные стили, иконка
components/     # React-компоненты секций и интерактива
Dockerfile      # Многоступенчатая сборка для Coolify/Docker
next.config.mjs # Конфиг Next.js (output: standalone)
```
