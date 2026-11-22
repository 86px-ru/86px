'use client';

import { useEffect, useRef } from 'react';
import Magnetic from '@/components/Magnetic';
import Counter from '@/components/Counter';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const blob1Ref = useRef<HTMLSpanElement>(null);
  const blob2Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const section = sectionRef.current;
    const blobs = [blob1Ref.current, blob2Ref.current];
    if (!section || !blobs[0] || !blobs[1]) return;

    let hx = 0;
    let hy = 0;
    let hrx = 0;
    let hry = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      hx = (e.clientX - r.left) / r.width - 0.5;
      hy = (e.clientY - r.top) / r.height - 0.5;
    };

    const loop = () => {
      hrx += (hx - hrx) * 0.05;
      hry += (hy - hry) * 0.05;
      blobs.forEach((b, i) => {
        if (!b) return;
        const depth = i === 0 ? 40 : -32;
        b.style.translate = `${hrx * depth}px ${hry * depth}px`;
      });
      raf = requestAnimationFrame(loop);
    };

    section.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(loop);

    return () => {
      section.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="hero" ref={sectionRef}>
      <div className="hero__bg" aria-hidden="true">
        <span className="blob blob--1" ref={blob1Ref}></span>
        <span className="blob blob--2" ref={blob2Ref}></span>
        <div className="hero__grid"></div>
      </div>

      <div className="container hero__inner">
        <div className="hero__meta" data-reveal>
          <span className="status"><i></i>Открыты для новых проектов</span>
          <span className="hero__meta-sep"></span>
          <span>Студия веб-дизайна · работаем по всему миру</span>
        </div>

        <h1 className="hero__title">
          <span className="hero__title-line">
            <span data-reveal>Создаём сайты,</span>
          </span>
          <span className="hero__title-line">
            <span data-reveal data-delay="130">
              которые{' '}
              <em className="hero__accent">
                запоминаются
                <svg className="hero__spark" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z" fill="currentColor" />
                </svg>
              </em>
            </span>
          </span>
        </h1>

        <div className="hero__bottom">
          <p className="hero__text" data-reveal data-delay="260">
            Помогаем брендам выделяться через дизайн, технологии и смелые идеи — от первой концепции до запуска.
          </p>
          <div className="hero__actions" data-reveal data-delay="380">
            <Magnetic>
              <a href="#contacts" className="btn">
                Обсудить проект
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#works" className="btn btn--ghost">Смотреть работы</a>
            </Magnetic>
          </div>
        </div>

        <div className="hero__stats" data-reveal data-delay="500">
          <div className="stat">
            <span className="stat__value"><Counter value={120} />+</span>
            <span className="stat__label">реализованных проектов</span>
          </div>
          <div className="stat">
            <span className="stat__value"><Counter value={8} /> лет</span>
            <span className="stat__label">создаём digital-продукты</span>
          </div>
          <div className="stat">
            <span className="stat__value"><Counter value={14} /></span>
            <span className="stat__label">наград за дизайн</span>
          </div>
        </div>
      </div>

      <a href="#services" className="hero__badge" aria-label="Листайте вниз">
        <svg className="hero__badge-svg" viewBox="0 0 100 100" aria-hidden="true">
          <defs>
            <path id="circlePath" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
          </defs>
          <text>
            <textPath href="#circlePath">дизайн — разработка — брендинг — 86px — </textPath>
          </text>
        </svg>
        <svg className="hero__badge-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 5v14M12 19l-6-6M12 19l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  );
}
