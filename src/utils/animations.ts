import { useEffect, useRef } from 'react';

/**
 * useScrollReveal — Applies intersection-observer based scroll-reveal animation.
 * Pass a container ref; all children with `.reveal-hidden`, `.reveal-hidden-left`,
 * or `.reveal-hidden-right` will animate in when they enter the viewport.
 *
 * Usage:
 *   const containerRef = useScrollReveal();
 *   <div ref={containerRef}>
 *     <div className="reveal-hidden reveal-delay-1"> ... </div>
 *   </div>
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.12) {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const selectors = '.reveal-hidden, .reveal-hidden-left, .reveal-hidden-right';
    const targets = container.querySelectorAll<HTMLElement>(selectors);

    if (!targets.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // once
          }
        });
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [threshold]);

  return containerRef;
}

/**
 * useAnimatedCounter — Animates a numeric value from 0 to `end` over `duration` ms.
 *
 * Usage:
 *   const { value, ref } = useAnimatedCounter(1234, 1200);
 *   <span ref={ref}>{value}</span>
 */
export function useAnimatedCounter(end: number, duration = 1000) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let start: number | null = null;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      el.textContent = Math.round(eased * end).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration]);

  return { ref };
}
