import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, GraduationCap, Building2, Users, Sparkles, TrendingUp } from 'lucide-react';
import { AlumniConnectLogo } from '../common/AlumniConnectLogo';
import { motion, AnimatePresence } from 'framer-motion';

// ── Tiny canvas that draws animated network nodes ────────────────────────────
const NetworkCanvas: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const NODE_COUNT = 28;
    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: 2 + Math.random() * 2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const nodeColor  = isDark ? 'rgba(96,165,250,0.55)'  : 'rgba(37,99,235,0.35)';
      const lineColor  = isDark ? 'rgba(99,102,241,0.18)'  : 'rgba(99,102,241,0.12)';
      const THRESHOLD  = 160;

      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < THRESHOLD) {
            ctx.beginPath();
            ctx.strokeStyle = lineColor;
            ctx.globalAlpha = 1 - dist / THRESHOLD;
            ctx.lineWidth = 1;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};

// ── Main Intro Sequence ───────────────────────────────────────────────────────
export const IntroSequence: React.FC = () => {
  const { showIntro, setShowIntro, theme, currentView } = useApp();
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showNetwork, setShowNetwork] = useState(false);

  useEffect(() => {
    if (!showIntro || currentView !== 'landing') return;

    setPhase(0);
    setShowNetwork(false);
    setIsFadingOut(false);

    // Phase 0→1 (0ms): blurred bg appears — handled by initial mount opacity
    // Phase 1 (200ms): network lines/nodes appear
    const t1 = setTimeout(() => { setPhase(1); setShowNetwork(true); }, 200);
    // Phase 2 (700ms): logo fades in and moves up
    const t2 = setTimeout(() => setPhase(2), 700);
    // Phase 3 (1300ms): hero content staggers in
    const t3 = setTimeout(() => setPhase(3), 1300);
    // Phase 4 (1900ms): "entering" badge
    const t4 = setTimeout(() => setPhase(4), 1900);
    // Fade out (2200ms)
    const t5 = setTimeout(() => setIsFadingOut(true), 2200);
    // Done (2500ms)
    const t6 = setTimeout(() => setShowIntro(false), 2500);

    return () => [t1,t2,t3,t4,t5,t6].forEach(clearTimeout);
  }, [showIntro, currentView, setShowIntro]);

  if (!showIntro || currentView !== 'landing') return null;

  const isDark = theme === 'dark';
  const handleSkip = () => { setIsFadingOut(true); setTimeout(() => setShowIntro(false), 200); };

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden cursor-pointer select-none
        transition-opacity duration-350 ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        ${isDark ? 'bg-[#080C15]' : 'bg-[#F7F8FA]'}`}
      aria-label="AlumniConnect intro – click to skip"
    >
      {/* ── Ambient blobs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isDark ? 0.18 : 0.28, scale: 1.2 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className={`absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full blur-3xl
            ${isDark ? 'bg-blue-600' : 'bg-blue-200'}`}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isDark ? 0.12 : 0.20, scale: 1.2 }}
          transition={{ duration: 1.4, delay: 0.2, ease: 'easeOut' }}
          className={`absolute -bottom-40 -right-40 w-[480px] h-[480px] rounded-full blur-3xl
            ${isDark ? 'bg-indigo-700' : 'bg-indigo-200'}`}
        />
      </div>

      {/* ── Network canvas ── */}
      <AnimatePresence>
        {showNetwork && (
          <motion.div
            key="network"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 pointer-events-none"
          >
            <NetworkCanvas isDark={isDark} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Skip button ── */}
      <button
        onClick={e => { e.stopPropagation(); handleSkip(); }}
        className={`absolute top-5 right-5 z-20 px-3.5 py-1.5 rounded-full text-xs font-semibold
          flex items-center gap-1.5 border backdrop-blur-sm cursor-pointer transition-all
          ${isDark
            ? 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-700'
            : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-white shadow-sm'}`}
        aria-label="Skip intro"
      >
        Skip <ArrowRight className="w-3.5 h-3.5" />
      </button>

      {/* ── Central content ── */}
      <div className="relative z-10 max-w-xl w-full px-6 text-center">

        {/* Logo — fades in and rises at phase 2 */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              key="logo"
              initial={{ opacity: 0, y: 24, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-3 mb-8"
            >
              <div className={`p-5 rounded-3xl border shadow-2xl backdrop-blur-sm
                ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-slate-200/80'}`}>
                <AlumniConnectLogo size="xl" />
              </div>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.4 }}
                className="text-[11px] font-black tracking-[0.28em] uppercase text-blue-600 dark:text-blue-400"
              >
                Verified University Network
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Staggered pathway chips — phase 3 */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              key="pathway"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center justify-center gap-2 mb-6"
            >
              {[
                { icon: Building2, label: 'University', color: 'text-indigo-600 dark:text-indigo-400' },
                { icon: GraduationCap, label: 'Student', color: 'text-blue-600 dark:text-blue-400' },
                { icon: Users, label: 'Alumni', color: 'text-teal-600 dark:text-teal-400' },
                { icon: Sparkles, label: 'Mentor', color: 'text-amber-500' },
                { icon: TrendingUp, label: 'Career', color: 'text-emerald-600 dark:text-emerald-400' },
              ].map((item, i) => (
                <React.Fragment key={item.label}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.75 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.07, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border shadow-sm
                      ${isDark
                        ? 'bg-slate-800 border-slate-700 text-slate-200'
                        : 'bg-white border-slate-200 text-slate-800'}`}
                  >
                    <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                    {item.label}
                  </motion.div>
                  {i < 4 && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.07 + 0.05 }}
                      className="text-slate-300 dark:text-slate-600 text-xs font-mono"
                    >→</motion.span>
                  )}
                </React.Fragment>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Headline — phase 3 */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              key="headline"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mb-3"
            >
              <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight
                ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Connect.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">
                  Discover.
                </span>
                <br />
                <span className={isDark ? 'text-slate-200' : 'text-slate-700'}>
                  Grow Together.
                </span>
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        {/* "Entering" badge — phase 4 */}
        <AnimatePresence>
          {phase >= 4 && (
            <motion.div
              key="entering"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center"
            >
              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border
                ${isDark
                  ? 'bg-blue-950/60 border-blue-900 text-blue-300'
                  : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                Entering Platform
              </span>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
