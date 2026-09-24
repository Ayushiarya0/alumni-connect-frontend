import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppView } from '../../types';

interface BackButtonProps {
  label?: string;
  fallbackView?: AppView;
  className?: string;
  onClick?: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({
  label = 'Back',
  fallbackView,
  className = '',
  onClick
}) => {
  const { goBack, navigate } = useApp();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (fallbackView) {
      navigate(fallbackView);
    } else {
      goBack();
    }
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xs transition-all cursor-pointer group ${className}`}
      title={label}
    >
      <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
      <span>{label}</span>
    </button>
  );
};
