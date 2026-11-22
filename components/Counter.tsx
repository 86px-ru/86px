'use client';

import { useEffect, useRef } from 'react';

export default function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const setFinal = () => {
      el.textContent = String(value);
    };

    if (!('IntersectionObserver' in window)) {
      setFinal();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.disconnect();

          const duration = 1600;
          let start: number | null = null;
          let raf = 0;
          const step = (ts: number) => {
            if (start === null) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = String(Math.round(eased * value));
            if (p < 1) raf = requestAnimationFrame(step);
          };
          raf = requestAnimationFrame(step);
        });
      },
      { threshold: 0.6 }
    );

    io.observe(el);
    return () => {
      io.disconnect();
    };
  }, [value]);

  return <span ref={ref}>0</span>;
}
