import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Building2,
  Users,
  Sparkles,
  ArrowRight,
  Code2,
  Brain,
  TrendingUp,
  Laptop,
  Briefcase
} from 'lucide-react';
import { AlumniConnectLogo } from '../common/AlumniConnectLogo';
import { AnimatePresence, motion } from 'framer-motion';

export const IntroSequence: React.FC = () => {
  const { showIntro, setShowIntro, theme, currentView } = useApp();
  const [stage, setStage] = useState<1 | 2 | 3>(1);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Only run on landing page when showIntro is true
    if (!showIntro || currentView !== 'landing') return;

    setStage(1);
    setIsFadingOut(false);

    // Stage 1 (0 - 550ms): Centered Logo & Tagline
    // Stage 2 (550ms - 1250ms): Continuous Educational Visual Flow (University -> Student -> Tech -> Alumni -> Mentor -> Career)
    const t1 = setTimeout(() => {
      setStage(2);
    }, 550);

    // Stage 3 (1250ms - 1850ms): Large Statement "Unlock the Future of Education and Technology"
    const t2 = setTimeout(() => {
      setStage(3);
    }, 1250);

    // Fade-out starts at 1850ms
    const t3 = setTimeout(() => {
      setIsFadingOut(true);
    }, 1850);

    // Transition completely completes at 2200ms -> reveal homepage
    const t4 = setTimeout(() => {
      setShowIntro(false);
    }, 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [showIntro, currentView, setShowIntro]);

  if (!showIntro || currentView !== 'landing') return null;

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => setShowIntro(false), 200);
  };

  const isDark = theme === 'dark';

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-300 cursor-pointer overflow-hidden ${
        isFadingOut
          ? 'opacity-0 pointer-events-none'
          : 'opacity-100'
      } ${
        isDark
          ? 'bg-[#090D16] text-[#F8FAFC]'
          : 'bg-[#F8F9FA] text-[#0F172A]'
      }`}
      aria-label="Alumni Connect Welcome Sequence - Click anywhere to skip"
      role="banner"
    >
      {/* Subtle ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute -top-32 -left-32 w-80 h-80 rounded-full blur-3xl opacity-25 transition-all duration-700 ${
            stage >= 2 ? 'scale-125' : 'scale-100'
          } ${isDark ? 'bg-blue-600' : 'bg-blue-200'}`}
        />
        <div
          className={`absolute -bottom-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-25 transition-all duration-700 ${
            stage >= 3 ? 'scale-125' : 'scale-100'
          } ${isDark ? 'bg-indigo-600' : 'bg-indigo-200'}`}
        />
      </div>

      {/* Skip Button */}
      <button
        onClick={e => {
          e.stopPropagation();
          handleSkip();
        }}
        className={`absolute top-6 right-6 z-20 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border flex items-center gap-1.5 cursor-pointer ${
          isDark
            ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-300'
            : 'bg-white/80 hover:bg-white border-slate-200 text-slate-600 shadow-2xs'
        }`}
      >
        <span>Skip</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-2xl w-full px-6 text-center select-none">
        <AnimatePresence mode="wait">
          {/* STAGE 1: Minimal, Premium Logo Presentation */}
          {stage === 1 && (
            <motion.div
              key="intro-stage-1"
              initial={{ opacity: 0, scale: 0.88, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center space-y-4"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1.1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="p-4 sm:p-5 rounded-3xl bg-white/10 dark:bg-white/5 backdrop-blur-md border border-slate-200/60 dark:border-white/10 shadow-2xl"
              >
                <AlumniConnectLogo size="xl" />
              </motion.div>
              <div className="space-y-1">
                <p className="text-xs font-black tracking-[0.25em] uppercase text-blue-600 dark:text-blue-400">
                  VERIFIED UNIVERSITY NETWORK
                </p>
              </div>
            </motion.div>
          )}

          {/* STAGE 2: Seamless Continuous Educational Visual Sequence */}
          {stage === 2 && (
            <motion.div
              key="intro-stage-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                <span>Higher Education & Career Bridge</span>
              </div>

              {/* University -> Student -> Technology -> Alumni -> Mentor -> Career */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 py-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs"
                >
                  <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-bold">University</span>
                </motion.div>

                <span className="text-slate-400 text-xs font-mono">→</span>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs"
                >
                  <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold">Student</span>
                </motion.div>

                <span className="text-slate-400 text-xs font-mono">→</span>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs"
                >
                  <Brain className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span className="text-xs font-bold">Technology</span>
                </motion.div>

                <span className="text-slate-400 text-xs font-mono">→</span>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs"
                >
                  <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-bold">Alumni</span>
                </motion.div>

                <span className="text-slate-400 text-xs font-mono">→</span>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold">Mentor</span>
                </motion.div>

                <span className="text-slate-400 text-xs font-mono">→</span>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-xs"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-bold">Career</span>
                </motion.div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                Connecting colleges across India with leading product companies and research laboratories.
              </p>
            </motion.div>
          )}

          {/* STAGE 3: Large Premium Statement */}
          {stage === 3 && (
            <motion.div
              key="intro-stage-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3 sm:space-y-4"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                <span className="text-slate-900 dark:text-white block">Unlock the Future</span>
                <span className="text-blue-600 dark:text-blue-400 text-2xl sm:text-4xl md:text-5xl font-bold block mt-1">
                  of Education and Technology
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto pt-1">
                Building authentic alumni mentorship networks for the next generation of engineers and leaders.
              </p>

              <div className="pt-3 flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                  <span>Entering Platform</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span>
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
