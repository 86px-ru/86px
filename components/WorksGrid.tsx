'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export type WorkItem = {
  id: string;
  index: string;
  title: string;
  description: string;
  chips: string[];
  variant: string;
  image_url: string | null;
};

const ARTS: Record<string, ReactNode> = {
  v1: (
    <>
      <span className="art art--circle"></span>
      <span className="art art--ring"></span>
    </>
  ),
  v2: <span className="art art--bars"></span>,
  v3: (
    <>
      <span className="art art--rings"></span>
      <span className="art art--dot"></span>
    </>
  ),
  v4: <span className="art art--wave"></span>,
  v5: (
    <>
      <span className="art art--grid"></span>
      <span className="art art--orb"></span>
    </>
  ),
  v6: <span className="art art--bean"></span>,
};

export default function WorksGrid({ projects }: { projects: WorkItem[] }) {
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
    <div className="works__grid" ref={gridRef}>
      {projects.map((p, i) => (
        <article
          className="work-card"
          data-reveal
          data-delay={i % 2 === 1 ? 100 : undefined}
          key={p.id}
        >
          <a href="#" className="work-card__link" aria-label={`Проект ${p.title}`}>
            <div className={`work-card__visual ${p.variant}${p.image_url ? ' has-img' : ''}`}>
              {p.image_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img className="work-card__img" src={p.image_url} alt={p.title} loading="lazy" />
              ) : (
                ARTS[p.variant] ?? ARTS.v1
              )}
              <span className="work-card__index">{p.index}</span>
            </div>
            <div className="work-card__info">
              <div>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
              </div>
              <div className="work-card__meta">
                {p.chips.map((chip) => (
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
  );
}
