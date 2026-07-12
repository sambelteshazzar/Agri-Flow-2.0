import React from 'react';

export interface AvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  src?: string;
  onError?: () => void;
}

const SIZE_CLASSES = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
};

const RING_CLASSES = {
  xs: 'ring-1',
  sm: 'ring-2',
  md: 'ring-2',
  lg: 'ring-2',
  xl: 'ring-2',
};

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function getColorFromName(name: string): string {
  const colors = [
    'bg-jade-600',
    'bg-sunburst-600',
    'bg-blue-600',
    'bg-emerald-600',
    'bg-teal-600',
    'bg-green-600',
    'bg-lime-600',
    'bg-cyan-600',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 'md',
  className = '',
  src,
  onError,
}) => {
  const initials = getInitials(name);
  const bgClass = getColorFromName(name);

  if (src) {
    return (
      <img
        src={src}
        alt={`${name}'s avatar`}
        className={`${SIZE_CLASSES[size]} rounded-full object-cover ${className}`}
        onError={(e) => {
          if (onError) onError();
          e.currentTarget.src = `/stock/user.svg`;
        }}
      />
    );
  }

  return (
    <div
      className={`
        ${SIZE_CLASSES[size]} ${RING_CLASSES[size]} rounded-full
        ${bgClass} text-white
        flex items-center justify-center font-semibold
        select-none ${className}
      `}
      aria-label={`${name}'s avatar`}
    >
      {initials}
    </div>
  );
};

export default Avatar;