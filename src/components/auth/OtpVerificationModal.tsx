import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Mail, ArrowRight, X, RefreshCw, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AnimatePresence, motion } from 'framer-motion';

export const OtpVerificationModal: React.FC = () => {
  const { otpModalOpen, setOtpModalOpen, pendingEmailForOtp, addToast, switchUserRole } = useApp();
  const [otp, setOtp] = useState(['4', '8', '2', '9', '1', '0']);
  const [timer, setTimer] = useState(59);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (!otpModalOpen) return;
    const interval = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [otpModalOpen]);

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const updated = [...otp];
    updated[index] = val;
    setOtp(updated);

    // auto focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setOtpModalOpen(false);
      confetti({ particleCount: 90, spread: 70 });
      addToast('Official University Email Verified! Account activated with Verified Student Badge.', 'success');
      switchUserRole('student');
    }, 1200);
  };

  const handleResend = () => {
    setTimer(60);
    addToast('New OTP dispatched to official college email inbox.', 'info');
  };

  return (
    <AnimatePresence>
      {otpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOtpModalOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 380 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 p-6 sm:p-8 text-gray-900 dark:text-slate-100 z-10"
          >
            <motion.button
              whileHover={{ scale: 1.15, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setOtpModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </motion.button>

        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 border border-purple-100 shadow-sm">
            <Mail className="w-7 h-7" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Official Institutional Verification
          </div>

          <h3 className="text-xl font-bold text-gray-900">Verify College Email</h3>
          <p className="text-xs text-gray-500 mt-2 max-w-xs leading-relaxed">
            We sent a 6-digit verification code to{' '}
            <strong className="text-purple-600 font-mono">{pendingEmailForOtp || 'student@tulas.edu.in'}</strong>
          </p>

          {/* OTP Digit inputs */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 my-6">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-input-${idx}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={e => handleOtpChange(idx, e.target.value)}
                className="w-11 h-13 text-center text-xl font-bold rounded-xl border border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all bg-gray-50/70"
              />
            ))}
          </div>

          <div className="flex items-center justify-between w-full text-xs text-gray-500 px-1 mb-6">
            <span>
              Resend in: <strong className="text-gray-800">{timer}s</strong>
            </span>
            <button
              onClick={handleResend}
              disabled={timer > 0}
              className={`flex items-center gap-1 font-semibold ${
                timer > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-purple-600 hover:text-purple-700'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" /> Resend OTP
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleVerify}
            disabled={verifying}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-glow-purple flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {verifying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Activating Institutional Badge...</span>
              </>
            ) : (
              <>
                <span>Complete Verification</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>

          <p className="text-[11px] text-gray-400 mt-4">
            Security notice: Verification guarantees student access to cross-university mentorship.
          </p>
        </div>
      </motion.div>
    </div>
      )}
    </AnimatePresence>
  );
};
