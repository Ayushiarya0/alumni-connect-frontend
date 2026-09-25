import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

export interface WorkflowStep {
  id: string | number;
  label: string;
  sublabel?: string;
  icon?: LucideIcon;
  color?: string; // e.g. 'blue' | 'indigo' | 'teal' | 'purple' | 'emerald'
}

interface AnimatedWorkflowPipelineProps {
  steps: WorkflowStep[];
  activeStep?: number;
  interactive?: boolean;
  className?: string;
}

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/60',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
    glow: 'rgba(59, 130, 246, 0.4)',
  },
  indigo: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/60',
    text: 'text-indigo-700 dark:text-indigo-300',
    border: 'border-indigo-200 dark:border-indigo-800',
    glow: 'rgba(99, 102, 241, 0.4)',
  },
  teal: {
    bg: 'bg-teal-50 dark:bg-teal-950/60',
    text: 'text-teal-700 dark:text-teal-300',
    border: 'border-teal-200 dark:border-teal-800',
    glow: 'rgba(20, 184, 166, 0.4)',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/60',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-800',
    glow: 'rgba(168, 85, 247, 0.4)',
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/60',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800',
    glow: 'rgba(16, 185, 129, 0.4)',
  },
};

export const AnimatedWorkflowPipeline: React.FC<AnimatedWorkflowPipelineProps> = ({
  steps,
  interactive = true,
  className = '',
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className={`w-full py-4 relative ${className}`}>
      {/* Background flowing connecting line on desktop */}
      <div className="hidden md:block absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-gradient-to-r from-blue-200 via-indigo-200 to-emerald-200 dark:from-blue-900/50 dark:via-indigo-900/50 dark:to-emerald-900/50 rounded-full overflow-hidden">
        {/* Animated glowing energy pulse that runs along the pipeline */}
        <motion.div
          animate={{ x: ['-100%', '300%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="w-1/3 h-full bg-gradient-to-r from-transparent via-blue-500 to-teal-400 opacity-90 shadow-[0_0_12px_rgba(59,130,246,0.8)]"
        />
      </div>

      <div className="relative z-10 flex flex-wrap md:flex-nowrap items-center justify-between gap-3 sm:gap-4">
        {steps.map((step, idx) => {
          const colors = COLOR_MAP[step.color || 'blue'] || COLOR_MAP.blue;
          const Icon = step.icon;
          const isHovered = hoveredIdx === idx;

          return (
            <React.Fragment key={step.id}>
              <motion.div
                onMouseEnter={() => interactive && setHoveredIdx(idx)}
                onMouseLeave={() => interactive && setHoveredIdx(null)}
                animate={{
                  y: isHovered ? -4 : 0,
                  scale: isHovered ? 1.05 : 1,
                }}
                transition={{ duration: 0.2 }}
                className={`flex-1 min-w-[130px] p-3 rounded-2xl border ${colors.bg} ${colors.border} shadow-sm backdrop-blur-xs flex flex-col items-center text-center cursor-default transition-all duration-200`}
              >
                {Icon && (
                  <motion.div
                    animate={isHovered ? { rotate: [0, -10, 10, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 font-bold ${colors.bg} ${colors.text} border ${colors.border} shadow-xs`}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.div>
                )}
                <span className={`text-xs font-bold ${colors.text}`}>{step.label}</span>
                {step.sublabel && (
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {step.sublabel}
                  </span>
                )}
              </motion.div>

              {/* Connecting Chevron on Mobile/Tablet */}
              {idx < steps.length - 1 && (
                <div className="md:hidden flex items-center justify-center text-slate-400 dark:text-slate-600 font-black text-sm">
                  →
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
