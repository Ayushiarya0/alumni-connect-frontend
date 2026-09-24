import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Lock, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const AuthGateModal: React.FC = () => {
  const {
    authGateModalOpen,
    setAuthGateModalOpen,
    setAuthModalOpen,
    setAuthModalMode
  } = useApp();

  const handleOpenLogin = () => {
    setAuthGateModalOpen(false);
    setAuthModalMode('login');
    setAuthModalOpen(true);
  };

  const handleOpenSignup = () => {
    setAuthGateModalOpen(false);
    setAuthModalMode('signup');
    setAuthModalOpen(true);
  };

  return (
    <AnimatePresence>
      {authGateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur & smooth fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setAuthGateModalOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container with Spring Physics */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 380 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 text-slate-900 dark:text-slate-100 z-10"
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.15, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setAuthGateModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Modal Content */}
            <div className="text-center flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.7, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: 0.1, stiffness: 400, damping: 20 }}
                className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 border border-blue-100 dark:border-blue-900/60 shadow-xs"
              >
                <Lock className="w-7 h-7" />
              </motion.div>

              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Login required
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2.5 max-w-xs leading-relaxed">
                To connect with this alumni, please login or create an account.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleOpenLogin}
                className="w-full sm:w-1/2 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-sm transition-all cursor-pointer text-center"
              >
                Login
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleOpenSignup}
                className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm hover:shadow flex items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
              >
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

