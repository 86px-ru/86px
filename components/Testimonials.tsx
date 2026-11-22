import type { CSSProperties } from 'react';

const testimonials = [
  {
    text: 'Команда 86px сделала нам сайт, которым мы гордимся. Конверсия выросла в полтора раза уже в первый месяц после запуска.',
    initials: 'АК',
    name: 'Анна Ковалёва',
    role: 'CMO, Aurora',
    gradient: { '--a': '#d7ff3f', '--b': '#8b7bff' } as CSSProperties,
  },
  {
    text: 'Редкое сочетание: отличный вкус и железная дисциплина. Все сроки соблюдены, результат превзошёл ожидания.',
    initials: 'ДМ',
    name: 'Дмитрий Морозов',
    role: 'Основатель, Tektum',
    gradient: { '--a': '#8b7bff', '--b': '#4dd6ff' } as CSSProperties,
  },
  {
    text: 'Поняли нашу задачу с полуслова и предложили решения, до которых мы сами бы не додумались. Работаем уже третий год.',
    initials: 'ЕС',
    name: 'Елена Соколова',
    role: 'Руководитель, Kofein',
    gradient: { '--a': '#ff7ad9', '--b': '#d7ff3f' } as CSSProperties,
  },
];

export default function Testimonials() {
  return (
    <section className="section testimonials">
      <div className="container">
        <div className="section__head" data-reveal>
          <span className="section__label">/ 04 — Отзывы</span>
          <h2 className="section__title">Нам <em>доверяют</em></h2>
        </div>

        <div className="testimonials__grid">
          {testimonials.map((t, index) => (
            <figure className="t-card" data-reveal data-delay={index * 120} key={t.name}>
              <svg className="t-card__quote" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M10 8c-3.3 0-6 2.7-6 6v2h4v-4H6.5C6.8 10.6 8.3 9.5 10 9.5V8zm10 0c-3.3 0-6 2.7-6 6v2h4v-4h-1.5c.3-1.4 1.8-2.5 3.5-2.5V8z" />
              </svg>
              <blockquote>{t.text}</blockquote>
              <figcaption>
                <span className="t-card__avatar" style={t.gradient}>{t.initials}</span>
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
