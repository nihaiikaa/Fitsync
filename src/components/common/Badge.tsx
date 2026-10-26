import React from 'react';

export type BadgeVariant =
  | 'active'
  | 'inactive'
  | 'expired'
  | 'pending'
  | 'completed'
  | 'in_progress'
  | 'scheduled'
  | 'cancelled'
  | 'brand'
  | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  const variantStyles: Record<BadgeVariant, string> = {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    completed: 'bg-[#10E567]/15 text-[#10E567] border-[#10E567]/30',
    in_progress: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    scheduled: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    inactive: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    expired: 'bg-red-500/10 text-red-400 border-red-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
    brand: 'bg-[#10E567]/15 text-[#10E567] border-[#10E567]/30 font-semibold',
    neutral: 'bg-zinc-800/80 text-zinc-300 border-zinc-700/60',
  };

  return (
    <span
      className={`inline-flex items-center justify-center font-medium rounded-full border transition-colors ${sizeClasses} ${variantStyles[variant]} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80" />
      {children}
    </span>
  );
};
