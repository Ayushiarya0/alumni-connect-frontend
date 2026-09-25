import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Users, MessageSquare, ArrowUpRight, Zap, CheckCircle2, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ActivityItem {
  id: string;
  type: 'connection' | 'mentorship' | 'referral' | 'event' | 'verification';
  message: string;
  timeAgo: string;
  badge: string;
  badgeColor: string;
  icon: React.ElementType;
}

const LIVE_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'connection',
    message: 'Rahul Sharma (Microsoft) accepted guidance request from Ayush (B.Tech CSE)',
    timeAgo: 'Just now',
    badge: 'Guidance Pair',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    icon: CheckCircle2,
  },
  {
    id: 'act-2',
    type: 'mentorship',
    message: 'Priya Patel (Staff Eng, Microsoft) completed 1-on-1 Resume Critique with Sneha',
    timeAgo: '3m ago',
    badge: '1-on-1 Review',
    badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    icon: Sparkles,
  },
  {
    id: 'act-3',
    type: 'referral',
    message: 'Aditya Negi (Zomato) posted priority SDE Referral for 2026 Batch',
    timeAgo: '7m ago',
    badge: 'Tech Referral',
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    icon: Zap,
  },
  {
    id: 'act-4',
    type: 'verification',
    message: 'Graphic Era University synchronized 120 verified alumni records',
    timeAgo: '12m ago',
    badge: 'Campus Mesh',
    badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    icon: Shield,
  },
  {
    id: 'act-5',
    type: 'event',
    message: 'Pan-India SDE & Cloud Masterclass webinar scheduled · 380 registered',
    timeAgo: '18m ago',
    badge: 'Live Masterclass',
    badgeColor: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
    icon: Users,
  }
];

export const LiveActivityTicker: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { navigate } = useApp();

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % LIVE_ACTIVITIES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const current = LIVE_ACTIVITIES[currentIndex];
  const Icon = current.icon;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="w-full relative z-20 overflow-hidden bg-white/75 dark:bg-slate-900/75 backdrop-blur-md border-y border-slate-200/80 dark:border-slate-800/80 py-2.5 px-4 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Live Indicator Beacon */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <span className="hidden sm:inline">LIVE ECOSYSTEM</span>
            <span className="sm:hidden">LIVE</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300">
              142 Online
            </span>
          </span>
        </div>

        {/* Animated Activity Message */}
        <div className="flex-1 overflow-hidden relative h-6 flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2 sm:gap-3 text-xs text-slate-700 dark:text-slate-300 truncate"
            >
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${current.badgeColor}`}>
                <Icon className="w-3 h-3" />
                <span className="hidden sm:inline">{current.badge}</span>
              </span>
              <span className="font-medium truncate">{current.message}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap hidden md:inline">
                • {current.timeAgo}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action button */}
        <button
          onClick={() => navigate('mentors')}
          className="flex-shrink-0 inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer group"
        >
          <span>Connect Now</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
