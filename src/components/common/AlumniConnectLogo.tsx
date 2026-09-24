import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'auto';
  showSubtitle?: boolean;
  className?: string;
}

export const AlumniConnectLogo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'auto',
  showSubtitle = true,
  className = ''
}) => {
  // Size metrics
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Geometric Mark: Mortarboard, Networking Nodes & Upward Growth */}
      <div
        className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 dark:from-slate-800 dark:via-indigo-900 dark:to-blue-900 p-0.5 shadow-sm border border-slate-300/40 dark:border-slate-700/60 ${iconSizes[size]}`}
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1"
        >
          {/* Base Diamond / Academic Cap Foundation */}
          <path
            d="M18 4L4 12L18 20L32 12L18 4Z"
            fill="url(#cap-grad)"
          />
          {/* Connection Arc & Growth Surge */}
          <path
            d="M9 16.5V23.5C9 27.5 13 31 18 31C23 31 27 27.5 27 23.5V16.5"
            stroke="url(#arc-grad)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Network Node 1 (Student Node) */}
          <circle cx="10" cy="21" r="2" fill="#38BDF8" />
          {/* Network Node 2 (Alumni Node) */}
          <circle cx="26" cy="21" r="2" fill="#2DD4BF" />
          {/* Central Mentor / Growth Pinnacle Star */}
          <path
            d="M18 11L19.2 14.5L22.8 14.8L20 17.2L20.8 20.7L18 18.9L15.2 20.7L16 17.2L13.2 14.8L16.8 14.5L18 11Z"
            fill="#F8FAFC"
          />

          <defs>
            <linearGradient id="cap-grad" x1="4" y1="4" x2="32" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3B82F6" />
              <stop offset="0.6" stopColor="#4F46E5" />
              <stop offset="1" stopColor="#1E293B" />
            </linearGradient>
            <linearGradient id="arc-grad" x1="9" y1="16.5" x2="27" y2="31" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38BDF8" />
              <stop offset="0.5" stopColor="#6366F1" />
              <stop offset="1" stopColor="#14B8A6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Typography: Clean, Professional, Accessible Contrast in Light & Dark */}
      <div className="flex flex-col">
        <div className={`font-extrabold tracking-tight leading-none ${textSizes[size]}`}>
          <span
            style={{ color: 'var(--logo-primary)' }}
            className={
              variant === 'light'
                ? 'text-slate-900'
                : variant === 'dark'
                ? 'text-white'
                : 'text-slate-900 dark:text-white transition-colors duration-200'
            }
          >
            Alumni
          </span>
          <span
            style={{ color: 'var(--logo-accent)' }}
            className={
              variant === 'light'
                ? 'text-blue-600 ml-1'
                : variant === 'dark'
                ? 'text-blue-400 ml-1'
                : 'text-blue-600 dark:text-blue-400 ml-1 transition-colors duration-200'
            }
          >
            Connect
          </span>
        </div>
        {showSubtitle && (
          <span
            className={
              variant === 'light'
                ? 'text-[9px] font-semibold tracking-wider uppercase mt-0.5 text-slate-500'
                : variant === 'dark'
                ? 'text-[9px] font-semibold tracking-wider uppercase mt-0.5 text-slate-400'
                : 'text-[9px] font-semibold tracking-wider uppercase mt-0.5 text-slate-500 dark:text-slate-400 transition-colors duration-200'
            }
          >
            Verified University Network
          </span>
        )}
      </div>
    </div>
  );
};
