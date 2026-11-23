'use client';

import { useEffect, useState } from 'react';
import Magnetic from '@/components/Magnetic';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [open]);

  return (
    <>
      <header className={`header${scrolled ? ' scrolled' : ''}`}>
        <div className="container header__inner">
          <a href="/" className="logo" aria-label="86px — на главную">
            86<span>px</span><sup>®</sup>
          </a>
          <nav className="nav" aria-label="Основная навигация">
            <a href="/#services" className="nav__link">Услуги</a>
            <a href="/#works" className="nav__link">Работы</a>
            <a href="/#process" className="nav__link">Процесс</a>
            <a href="/#contacts" className="nav__link">Контакты</a>
          </nav>
          <Magnetic>
            <a href="/#contacts" className="btn btn--small">Обсудить проект</a>
          </Magnetic>
          <button
            className="burger"
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <div className="mobile-menu">
        <nav className="mobile-menu__nav" aria-label="Мобильная навигация">
          <a href="/#services" onClick={() => setOpen(false)}>Услуги</a>
          <a href="/#works" onClick={() => setOpen(false)}>Работы</a>
          <a href="/#process" onClick={() => setOpen(false)}>Процесс</a>
          <a href="/#contacts" onClick={() => setOpen(false)}>Контакты</a>
        </nav>
        <div className="mobile-menu__footer">
          <a href="mailto:hello@86px.studio">hello@86px.studio</a>
        </div>
      </div>
    </>
  );
}
