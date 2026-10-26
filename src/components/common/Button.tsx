import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'brand' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'brand',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
    md: 'text-sm px-4 py-2.5 gap-2 h-10',
    lg: 'text-base px-6 py-3 gap-2.5 h-12',
  };

  const variantStyles: Record<ButtonVariant, string> = {
    brand:
      'bg-[#10E567] hover:bg-[#1bf873] text-black font-semibold shadow-lime-sm hover:shadow-lime-md',
    secondary:
      'bg-[#1D212B] hover:bg-[#252A37] text-white border border-[#2B3140]',
    outline:
      'bg-transparent hover:bg-white/5 text-white border border-zinc-700 hover:border-zinc-500',
    ghost:
      'bg-transparent hover:bg-white/5 text-zinc-300 hover:text-white',
    danger:
      'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
