import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  glow = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-[#111318] border border-[#202530] rounded-2xl p-5 shadow-dark-card transition-all duration-200 ${
        hover ? 'hover:border-[#2C3342] hover:bg-[#14171E] cursor-pointer' : ''
      } ${glow ? 'border-[#10E567]/30 shadow-lime-sm' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, action, className = '' }) => (
  <div className={`flex items-start justify-between gap-4 mb-4 ${className}`}>
    <div>
      <h3 className="font-semibold text-white text-base sm:text-lg tracking-tight">{title}</h3>
      {subtitle && <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);
