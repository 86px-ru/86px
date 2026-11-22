'use client';

import { useEffect, useRef, useState } from 'react';

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reduceMotion ? 150 : 1500;
    let raf = 0;
    let timeout = 0;
    let start: number | null = null;

    const finish = () => {
      document.body.classList.add('loaded');
      window.dispatchEvent(new Event('app:loaded'));
      setDone(true);
      timeout = window.setTimeout(() => setHidden(true), 950);
    };

    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = Math.round(eased * 100);
      setProgress(value);
      if (barRef.current) {
        barRef.current.style.transform = 'scaleX(' + eased + ')';
      }
      if (p < 1) {
        raf = requestAnimationFrame(step);
      } else {
        finish();
      }
    };

    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timeout);
    };
  }, []);

  if (hidden) return null;

  return (
    <div className={`preloader${done ? ' done' : ''}`} aria-hidden="true">
      <div className="preloader__inner">
        <div className="preloader__logo">
          86<span>px</span><sup>®</sup>
        </div>
        <div className="preloader__count">{progress}%</div>
      </div>
      <div className="preloader__bar">
        <span ref={barRef} />
      </div>
    </div>
  );
}
