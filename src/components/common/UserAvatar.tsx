import React, { useState } from 'react';

export function getInitials(name?: string): string {
  if (!name || !name.trim()) return 'U';
  const cleanName = name.trim().replace(/[^a-zA-Z0-9\s]/g, '');
  const parts = cleanName.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface UserAvatarProps {
  name: string;
  avatarUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showBadge?: boolean;
  badgeContent?: React.ReactNode;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-7 h-7 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base font-bold',
  xl: 'w-20 h-20 text-xl font-extrabold',
  '2xl': 'w-24 h-24 sm:w-28 sm:h-28 text-2xl font-black'
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  avatarUrl,
  size = 'md',
  className = '',
  showBadge = false,
  badgeContent
}) => {
  const [imgError, setImgError] = useState(false);
  const initials = getInitials(name);

  // Check if avatarUrl is a real valid non-empty string and not errored
  const hasValidImage = Boolean(avatarUrl && avatarUrl.trim() && !imgError);

  const containerSizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {hasValidImage ? (
        <img
          src={avatarUrl}
          alt={name}
          onError={() => setImgError(true)}
          className={`${containerSizeClass} rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-2xs`}
        />
      ) : (
        <div
          className={`${containerSizeClass} rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white font-extrabold tracking-wider flex items-center justify-center border-2 border-white/60 dark:border-slate-700 shadow-xs select-none`}
          aria-label={name}
          title={name}
        >
          {initials}
        </div>
      )}

      {showBadge && (
        <span className="absolute -bottom-0.5 -right-0.5 p-0.5 bg-teal-600 text-white rounded-full shadow-xs">
          {badgeContent || <span className="block w-2 h-2 rounded-full bg-white" />}
        </span>
      )}
    </div>
  );
};
