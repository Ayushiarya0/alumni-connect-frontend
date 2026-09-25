import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Mail, ArrowRight, X, RefreshCw, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const OtpVerificationModal: React.FC = () => {
  const {
    otpModalOpen,
    setOtpModalOpen,
    pendingEmailForOtp,
    verifyEmailToken,
    resendVerificationEmail,
    currentDevVerificationToken,
    isEmailVerified,
    addToast
  } = useApp();

  const [otp, setOtp] = useState(['4', '8', '2', '9', '1', '0']);
  const [timer, setTimer] = useState(60);
  const [verifying, setVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!otpModalOpen) return;
    setTimer(60);
    setErrorMessage(null);
    setOtp(currentDevVerificationToken.split('').slice(0, 6));

    const interval = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [otpModalOpen, currentDevVerificationToken]);

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const updated = [...otp];
    updated[index] = val;
    setOtp(updated);
    setErrorMessage(null);

    // auto focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('').trim();
    if (code.length < 6) {
      setErrorMessage('Please enter all 6 digits of the verification code.');
      return;
    }

    setVerifying(true);
    setErrorMessage(null);

    setTimeout(() => {
      setVerifying(false);
      const res = verifyEmailToken(code);
      if (!res.success) {
        setErrorMessage(res.message);
      }
    }, 600);
  };

  const handleResend = () => {
    setTimer(60);
    setErrorMessage(null);
    const res = resendVerificationEmail(pendingEmailForOtp);
    if (res.devToken) {
      setOtp(res.devToken.split('').slice(0, 6));
    }
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
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 380 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 text-slate-900 dark:text-slate-100 z-10"
          >
            <motion.button
              whileHover={{ scale: 1.15, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setOtpModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </motion.button>

            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 border border-blue-100 dark:border-blue-900 shadow-xs">
                <Mail className="w-7 h-7" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Email Verification Required
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Verify Your Email</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-xs leading-relaxed">
                Verification email sent to{' '}
                <strong className="text-blue-600 dark:text-blue-400 font-mono break-all">
                  {pendingEmailForOtp || 'student@university.edu.in'}
                </strong>
              </p>

              {/* Dev mode token notice */}
              <div className="w-full mt-3 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-[11px] text-amber-800 dark:text-amber-300 text-left flex items-start gap-2">
                <KeyRound className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Development Email Service Fallback:</span>
                  <div className="text-slate-600 dark:text-slate-400 text-[10px] mt-0.5">
                    Your active verification token is <span className="font-mono font-bold text-amber-700 dark:text-amber-300">{currentDevVerificationToken}</span>. Enter this token or use the prefilled code below.
                  </div>
                </div>
              </div>

              {/* OTP Digit inputs */}
              <div className="flex items-center justify-center gap-2 sm:gap-2.5 my-5">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(idx, e.target.value)}
                    className="w-10 h-12 text-center text-lg font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all"
                  />
                ))}
              </div>

              {errorMessage && (
                <div className="mb-4 text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center justify-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="flex items-center justify-between w-full text-xs text-slate-500 dark:text-slate-400 px-1 mb-5">
                <span>
                  Resend in: <strong className="text-slate-800 dark:text-slate-200">{timer}s</strong>
                </span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={timer > 0}
                  className={`flex items-center gap-1 font-semibold cursor-pointer ${
                    timer > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-blue-600 dark:text-blue-400 hover:underline'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Resend Verification Email
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleVerify}
                disabled={verifying}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {verifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Token...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Email & Access Platform</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>

              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-4">
                Full platform access, mentor discovery, and direct messaging are granted upon verification.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
