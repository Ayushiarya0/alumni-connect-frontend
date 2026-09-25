import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Slide {
  url: string;
  caption: string;
  tag: string;
}

const SLIDES: Slide[] = [
  {
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&auto=format&fit=crop&q=80',
    caption: 'Students collaborating on projects',
    tag: 'Collaboration',
  },
  {
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&auto=format&fit=crop&q=80',
    caption: 'Alumni mentoring next-gen leaders',
    tag: 'Mentorship',
  },
  {
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&auto=format&fit=crop&q=80',
    caption: 'Pan-India campus networking events',
    tag: 'Networking',
  },
  {
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&auto=format&fit=crop&q=80',
    caption: 'Students working together',
    tag: 'Campus Life',
  },
  {
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=900&auto=format&fit=crop&q=80',
    caption: 'Alumni in professional leadership',
    tag: 'Career Growth',
  },
  {
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&auto=format&fit=crop&q=80',
    caption: 'Masterclass & webinar sessions',
    tag: 'Events',
  },
];

const AUTOPLAY_INTERVAL = 4500;

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export const HeroCarousel: React.FC = () => {
  const [current, setCurrent]   = useState(0);
  const [direction, setDir]     = useState(1);          // 1 = forward, -1 = back
  const [paused, setPaused]     = useState(false);
  const [loaded, setLoaded]     = useState<Record<number, boolean>>({});
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((idx: number, dir: 1 | -1) => {
    setDir(dir);
    setCurrent(idx);
  }, []);

  const next = useCallback(() => goTo(mod(current + 1, SLIDES.length), 1),  [current, goTo]);
  const prev = useCallback(() => goTo(mod(current - 1, SLIDES.length), -1), [current, goTo]);

  // Autoplay
  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(next, AUTOPLAY_INTERVAL);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current, paused, next]);

  // Preload adjacent images
  useEffect(() => {
    [current, mod(current + 1, SLIDES.length), mod(current - 1, SLIDES.length)].forEach(i => {
      if (loaded[i]) return;
      const img = new Image();
      img.onload = () => setLoaded(prev => ({ ...prev, [i]: true }));
      img.src = SLIDES[i].url;
    });
  }, [current, loaded]);

  const prevIdx = mod(current - 1, SLIDES.length);
  const nextIdx = mod(current + 1, SLIDES.length);

  // Framer variants
  const variants = {
    enter:   (dir: number) => ({ x: dir > 0 ? '60%'  : '-60%', opacity: 0, scale: 0.92 }),
    center:  { x: '0%',   opacity: 1, scale: 1 },
    exit:    (dir: number) => ({ x: dir > 0 ? '-60%' : '60%',  opacity: 0, scale: 0.92 }),
  };

  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="relative w-full select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Main stage ── */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl" style={{ aspectRatio: '4/3' }}>

        {/* Ghost images above and below (depth effect) */}
        <div className="absolute inset-x-6 -top-6 h-14 rounded-2xl overflow-hidden opacity-25 blur-[1px] pointer-events-none z-0 scale-95">
          <img src={SLIDES[nextIdx].url} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-x-6 -bottom-6 h-14 rounded-2xl overflow-hidden opacity-25 blur-[1px] pointer-events-none z-0 scale-95">
          <img src={SLIDES[prevIdx].url} alt="" className="w-full h-full object-cover" />
        </div>

        {/* Main image */}
        <div className="relative z-10 w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.55, ease: [0.32, 0, 0.67, 0] }}
              className="absolute inset-0"
            >
              <motion.img
                src={SLIDES[current].url}
                alt={SLIDES[current].caption}
                className="w-full h-full object-cover"
                initial={{ scale: 1.06 }}
                animate={{ scale: 1 }}
                transition={{ duration: 6, ease: 'linear' }}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10 pointer-events-none" />

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                >
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-sm text-white border border-white/20 mb-1.5">
                    {SLIDES[current].tag}
                  </span>
                  <p className="text-white text-xs sm:text-sm font-semibold drop-shadow-sm">
                    {SLIDES[current].caption}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Navigation arrows ── */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white border border-slate-200/80 shadow-lg flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white border border-slate-200/80 shadow-lg flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* ── Pagination dots ── */}
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? 1 : -1)}
            className={`rounded-full transition-all duration-300 cursor-pointer ${
              i === current
                ? 'w-5 h-2 bg-blue-600'
                : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* ── Autoplay progress bar ── */}
      {!paused && (
        <div className="absolute top-0 left-0 right-0 h-0.5 z-20 bg-white/10 rounded-t-3xl overflow-hidden">
          <motion.div
            key={current}
            className="h-full bg-white/60"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: AUTOPLAY_INTERVAL / 1000, ease: 'linear' }}
          />
        </div>
      )}
    </div>
  );
};
