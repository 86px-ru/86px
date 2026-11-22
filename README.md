# 86px® — студия веб-дизайна

Сайт студии веб-дизайна на **Next.js 15** (App Router, TypeScript) с анимациями,
кастомным курсором и адаптивной вёрсткой.

## Стек

- Next.js 15 (App Router)
- React 19
- TypeScript
- Чистый CSS (без UI-фреймворков)
- Шрифты Unbounded и Manrope через `next/font` (самостоятельный хостинг, кириллица)

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

## Структура

```
app/            # App Router: layout, страница, глобальные стили, иконка
components/     # React-компоненты секций и интерактива
Dockerfile      # Многоступенчатая сборка для Coolify/Docker
next.config.mjs # Конфиг Next.js (output: standalone)
```
