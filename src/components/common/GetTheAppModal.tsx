import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Smartphone,
  CheckCircle2,
  Bell,
  MessageSquare,
  ShieldCheck,
  ExternalLink,
  QrCode,
  Download
} from 'lucide-react';
import { AlumniConnectLogo } from './AlumniConnectLogo';
import { AnimatePresence, motion } from 'framer-motion';

export const GetTheAppModal: React.FC = () => {
  const { getTheAppModalOpen, setGetTheAppModalOpen, GOOGLE_PLAY_STORE_APP_URL } = useApp();

  const handleDownloadClick = () => {
    window.open(GOOGLE_PLAY_STORE_APP_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {getTheAppModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur & smooth fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setGetTheAppModalOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 380 }}
            className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100 z-10"
            role="dialog"
            aria-modal="true"
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.15, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setGetTheAppModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors z-20 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </motion.button>

        {/* Header / Banner */}
        <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-blue-500/20 blur-2xl pointer-events-none"></div>

          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20">
              <Smartphone className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">Official Mobile Client</span>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                Alumni Connect Mobile App
              </h2>
            </div>
          </div>
          <p className="text-sm text-blue-100/90 max-w-md leading-relaxed">
            “Connect with your alumni network anytime, anywhere.”
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Key Mobile Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Instant Notifications</p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Real-time alerts for mentorship acceptances and event invites.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white">On-The-Go Chat</p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Low-latency messaging with verified alumni across institutions.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Verified Security</p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Campus email authentication and institutional verification.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Cross-Platform Sync</p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Seamless transition between web dashboard and mobile app.</p>
              </div>
            </div>
          </div>

          {/* Download & QR Action Box */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/60">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-1 shadow-2xs">
                <QrCode className="w-10 h-10 text-slate-800 dark:text-slate-200" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Scan to Install on Device</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Available for Android 8.0+ & iOS 14+</p>
              </div>
            </div>

            <button
              onClick={handleDownloadClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Get on Google Play</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </button>
          </div>

          <div className="text-center text-[11px] text-slate-400 dark:text-slate-500">
            Official release package target: <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px]">{GOOGLE_PLAY_STORE_APP_URL}</code>
          </div>
        </div>
      </motion.div>
    </div>
      )}
    </AnimatePresence>
  );
};
