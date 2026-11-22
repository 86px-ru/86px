'use client';

import { useEffect } from 'react';

export default function RevealInit() {
  useEffect(() => {
    let io: IntersectionObserver | null = null;

    const init = () => {
      const items = document.querySelectorAll<HTMLElement>('[data-reveal]');
      if (!('IntersectionObserver' in window)) {
        items.forEach((el) => el.classList.add('in'));
        return;
      }
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in');
              io?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
      items.forEach((el) => {
        const delay = el.getAttribute('data-delay');
        if (delay) el.style.transitionDelay = delay + 'ms';
        io?.observe(el);
      });
    };

    if (document.body.classList.contains('loaded')) {
      init();
    } else {
      window.addEventListener('app:loaded', init, { once: true });
    }

    return () => {
      window.removeEventListener('app:loaded', init);
      io?.disconnect();
    };
  }, []);

  return null;
}
