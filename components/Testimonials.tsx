import type { CSSProperties } from 'react';
import { getContent } from '@/lib/content';

export default async function Testimonials() {
  const content = await getContent('testimonials');
  const items = content.items.slice(0, 3);

  return (
    <section className="section testimonials">
      <div className="container">
        <div className="section__head" data-reveal>
          <span className="section__label">/ 04 — Отзывы</span>
          <h2 className="section__title">Нам <em>доверяют</em></h2>
        </div>

        <div className="testimonials__grid">
          {items.map((t, index) => (
            <figure className="t-card" data-reveal data-delay={index * 120} key={index}>
              <svg className="t-card__quote" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M10 8c-3.3 0-6 2.7-6 6v2h4v-4H6.5C6.8 10.6 8.3 9.5 10 9.5V8zm10 0c-3.3 0-6 2.7-6 6v2h4v-4h-1.5c.3-1.4 1.8-2.5 3.5-2.5V8z" />
              </svg>
              <blockquote>{t.text}</blockquote>
              <figcaption>
                <span
                  className="t-card__avatar"
                  style={{ '--a': t.colorA, '--b': t.colorB } as CSSProperties}
                >
                  {t.initials}
                </span>
                <div>
                  <b>{t.name}</b>
                  <span>{t.role}</span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
