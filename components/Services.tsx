'use client';

import { useEffect, useRef } from 'react';

const services = [
  {
    num: '01',
    title: 'Веб-дизайн',
    text: 'Лендинги, корпоративные сайты и интернет-магазины, которые превращают посетителей в клиентов.',
    tags: 'UI/UX · Прототипы · Дизайн-системы',
  },
  {
    num: '02',
    title: 'Разработка',
    text: 'Быстрые и надёжные сайты на современном стеке: от статики до сложных веб-приложений.',
    tags: 'Frontend · CMS · Анимации',
  },
  {
    num: '03',
    title: 'Брендинг',
    text: 'Айдентика, которая работает: логотипы, фирменный стиль и гайдлайны для всех каналов.',
    tags: 'Логотипы · Айдентика · Гайдлайны',
  },
  {
    num: '04',
    title: 'Моушн и 3D',
    text: 'Интерактивные сценарии, WebGL и микроанимации, которые делают интерфейс живым.',
    tags: 'WebGL · 3D · Интерактив',
  },
];

export default function Services() {
  const listRef = useRef<HTMLUListElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const list = listRef.current;
    const preview = previewRef.current;
    if (!list || !preview) return;

    const pItems = preview.querySelectorAll('.service-preview__item');
    const items = list.querySelectorAll('.service-item');

    let tx = 0;
    let ty = 0;
    let px = 0;
    let py = 0;
    let previewOn = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const onItemEnter = (index: number) => () => {
      pItems.forEach((pi, j) => {
        pi.classList.toggle('active', j === index);
      });
      preview.classList.add('is-visible');
      previewOn = true;
    };

    const onListLeave = () => {
      preview.classList.remove('is-visible');
      previewOn = false;
    };

    const loop = () => {
      px += (tx - px) * 0.12;
      py += (ty - py) * 0.12;
      const rotate = Math.max(-8, Math.min(8, (tx - px) * 0.04));
      const scale = previewOn ? 1 : 0.92;
      preview.style.transform = `translate(${px}px, ${py}px) translate(-50%,-58%) rotate(${rotate}deg) scale(${scale})`;
      raf = requestAnimationFrame(loop);
    };

    list.addEventListener('mousemove', onMove);
    list.addEventListener('mouseleave', onListLeave);
    items.forEach((item, index) => {
      item.addEventListener('mouseenter', onItemEnter(index));
    });
    raf = requestAnimationFrame(loop);

    return () => {
      list.removeEventListener('mousemove', onMove);
      list.removeEventListener('mouseleave', onListLeave);
      items.forEach((item, index) => {
        item.removeEventListener('mouseenter', onItemEnter(index));
      });
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="section services" id="services">
      <div className="container">
        <div className="section__head" data-reveal>
          <span className="section__label">/ 01 — Услуги</span>
          <h2 className="section__title">Что мы <em>делаем</em></h2>
        </div>

        <ul className="services__list" ref={listRef}>
          {services.map((service, index) => (
            <li
              className="service-item"
              data-index={index}
              data-reveal
              data-delay={index * 80}
              key={service.num}
            >
              <span className="service-item__num">{service.num}</span>
              <div className="service-item__body">
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </div>
              <span className="service-item__tags">{service.tags}</span>
              <span className="service-item__arrow">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="service-preview" ref={previewRef} aria-hidden="true">
        <div className="service-preview__item sp-1"><span></span></div>
        <div className="service-preview__item sp-2"><span></span></div>
        <div className="service-preview__item sp-3"><span></span></div>
        <div className="service-preview__item sp-4"><span></span></div>
      </div>
    </section>
  );
}
