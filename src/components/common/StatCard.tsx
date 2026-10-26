import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  subtitle?: string;
  highlight?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
  subtitle,
  highlight = false,
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-200 ${
        highlight
          ? 'bg-gradient-to-br from-[#121E16] to-[#111318] border-[#10E567]/30 shadow-lime-sm'
          : 'bg-[#111318] border-[#202530] hover:border-[#2C3342]'
      }`}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{title}</p>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
            highlight
              ? 'bg-[#10E567]/20 border-[#10E567]/30 text-[#10E567]'
              : 'bg-[#181B23] border-[#262B37] text-zinc-300'
          }`}
        >
          {icon}
        </div>
      </div>

      <div className="mt-3">
        <h4 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{value}</h4>
        {(change || subtitle) && (
          <div className="flex items-center gap-2 mt-2">
            {change && (
              <span
                className={`inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded-md ${
                  isPositive
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-red-500/10 text-red-400'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-3 h-3 mr-1 inline" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1 inline" />
                )}
                {change}
              </span>
            )}
            {subtitle && <span className="text-xs text-zinc-400">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
