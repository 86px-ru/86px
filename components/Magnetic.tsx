'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export default function Magnetic({ children }: { children: ReactNode }) {
  const outerRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const onMove = (e: MouseEvent) => {
      const r = outer.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      outer.style.transition = 'transform 0.1s ease-out';
      inner.style.transition = 'transform 0.1s ease-out';
      outer.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
      inner.style.transform = `translate(${x * 0.32}px, ${y * 0.32}px)`;
    };

    const onLeave = () => {
      outer.style.transition = 'transform 0.45s cubic-bezier(0.22,1,0.36,1)';
      inner.style.transition = 'transform 0.45s cubic-bezier(0.22,1,0.36,1)';
      outer.style.transform = 'translate(0,0)';
      inner.style.transform = 'translate(0,0)';
    };

    outer.addEventListener('mousemove', onMove);
    outer.addEventListener('mouseleave', onLeave);

    return () => {
      outer.removeEventListener('mousemove', onMove);
      outer.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <span className="magnetic" ref={outerRef}>
      <span className="magnetic__inner" ref={innerRef}>
        {children}
      </span>
    </span>
  );
}
