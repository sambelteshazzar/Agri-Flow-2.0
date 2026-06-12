
import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'card' | 'line' | 'circle' | 'rect';
  width?: string;
  height?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rect', width, height, count = 1 }) => {
  const base = 'rounded-lg bg-slate-200 dark:bg-slate-800 animate-shimmer relative overflow-hidden';

  const variants: Record<string, string> = {
    card: `${base} h-40 w-full`,
    line: `${base} h-4 w-full`,
    circle: `${base} rounded-full`,
    rect: `${base}`,
  };

  const style: React.CSSProperties = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={`${variants[variant]} ${className}`} style={style} />
      ))}
    </>
  );
};

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6 p-1">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Skeleton variant="rect" className="h-28 rounded-xl" count={4} />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Skeleton variant="rect" className="h-64 rounded-xl md:col-span-2" />
      <Skeleton variant="rect" className="h-64 rounded-xl" />
    </div>
    <Skeleton variant="rect" className="h-48 rounded-xl" />
  </div>
);

export const CardGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <Skeleton variant="rect" className="h-36 rounded-none" />
        <div className="p-4 space-y-3">
          <Skeleton variant="line" className="h-5 w-3/4" />
          <Skeleton variant="line" className="h-4 w-1/2" />
          <Skeleton variant="line" className="h-4 w-2/3" />
        </div>
      </div>
    ))}
  </div>
);
