'use client';

import { useEffect, useRef, type ReactNode } from 'react';

type Project = {
  v: string;
  index: string;
  title: string;
  desc: string;
  chips: string[];
  label: string;
  arts: ReactNode;
};

const projects: Project[] = [
  {
    v: 'v1',
    index: '01',
    title: 'Aurora',
    desc: 'Финтех-приложение',
    chips: ['Mobile', 'Product'],
    label: 'Проект Aurora — финтех-приложение',
    arts: (
      <>
        <span className="art art--circle"></span>
        <span className="art art--ring"></span>
      </>
    ),
  },
  {
    v: 'v2',
    index: '02',
    title: 'Tektum',
    desc: 'Бюро архитектуры',
    chips: ['Сайт', '3D'],
    label: 'Проект Tektum — бюро архитектуры',
    arts: <span className="art art--bars"></span>,
  },
  {
    v: 'v3',
    index: '03',
    title: 'Pulse',
    desc: 'Музыкальный стриминг',
    chips: ['Веб-приложение', 'UI/UX'],
    label: 'Проект Pulse — музыкальный сервис',
    arts: (
      <>
        <span className="art art--rings"></span>
        <span className="art art--dot"></span>
      </>
    ),
  },
  {
    v: 'v4',
    index: '04',
    title: 'Sever',
    desc: 'Fashion e-commerce',
    chips: ['Магазин', 'Брендинг'],
    label: 'Проект Sever — fashion e-commerce',
    arts: <span className="art art--wave"></span>,
  },
  {
    v: 'v5',
    index: '05',
    title: 'Orbita',
    desc: 'SaaS-платформа',
    chips: ['Dashboard', 'Product'],
    label: 'Проект Orbita — SaaS-платформа',
    arts: (
      <>
        <span className="art art--grid"></span>
        <span className="art art--orb"></span>
      </>
    ),
  },
  {
    v: 'v6',
    index: '06',
    title: 'Kofein',
    desc: 'Сеть кофеен',
    chips: ['Сайт', 'Айдентика'],
    label: 'Проект Kofein — сеть кофеен',
    arts: <span className="art art--bean"></span>,
  },
];

export default function Works() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const grid = gridRef.current;
    if (!grid) return;

    const cards = grid.querySelectorAll<HTMLElement>('.work-card');

    const onMove = (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest('.work-card') as HTMLElement | null;
      if (!card || !grid.contains(card)) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transition = 'transform 0.08s ease-out';
      card.style.transform = `perspective(1000px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    };

    const onLeave = (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest('.work-card') as HTMLElement | null;
      if (!card) return;
      card.style.transition = 'transform 0.6s cubic-bezier(0.22,1,0.36,1)';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    };

    cards.forEach((card) => {
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
    });

    return () => {
      cards.forEach((card) => {
        card.removeEventListener('mousemove', onMove);
        card.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  return (
    <section className="section works" id="works">
      <div className="container">
        <div className="section__head" data-reveal>
          <span className="section__label">/ 02 — Работы</span>
          <h2 className="section__title">Избранные <em>проекты</em></h2>
        </div>

        <div className="works__grid" ref={gridRef}>
          {projects.map((project, i) => (
            <article className="work-card" data-reveal data-delay={i % 2 === 1 ? 100 : undefined} key={project.index}>
              <a href="#" className="work-card__link" aria-label={project.label}>
                <div className={`work-card__visual ${project.v}`}>
                  {project.arts}
                  <span className="work-card__index">{project.index}</span>
                </div>
                <div className="work-card__info">
                  <div>
                    <h3>{project.title}</h3>
                    <p>{project.desc}</p>
                  </div>
                  <div className="work-card__meta">
                    {project.chips.map((chip) => (
                      <span className="chip" key={chip}>{chip}</span>
                    ))}
                  </div>
                </div>
                <span className="work-card__go">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
