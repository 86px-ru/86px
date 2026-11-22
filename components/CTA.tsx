'use client';

import Magnetic from '@/components/Magnetic';

export default function CTA() {
  return (
    <section className="cta" id="contacts">
      <div className="container cta__inner">
        <span className="section__label" data-reveal>/ 05 — Контакты</span>
        <h2 className="cta__title" data-reveal data-delay="100">
          Есть идея?
          <br />
          <em>Давайте обсудим</em>
        </h2>
        <a href="mailto:hello@86px.studio" className="cta__mail" data-reveal data-delay="200">
          hello@86px.studio
        </a>
        <div className="cta__actions" data-reveal data-delay="300">
          <Magnetic>
            <a href="mailto:hello@86px.studio" className="btn">
              Написать нам
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </Magnetic>
          <Magnetic>
            <a href="#" className="btn btn--ghost">Telegram</a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
