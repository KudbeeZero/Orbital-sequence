/**
 * Button - Cyan-bordered button component with hover/active states.
 * Supports primary (filled) and outline variants, plus size options.
 */

import { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const variantClasses = {
  primary:
    'bg-cyan-primary/20 border-cyan-primary text-cyan-primary hover:bg-cyan-primary/40 active:bg-cyan-primary/60',
  outline:
    'bg-transparent border-cyan-primary/50 text-cyan-primary hover:border-cyan-primary hover:bg-cyan-primary/10',
  danger:
    'bg-danger/20 border-danger text-danger hover:bg-danger/40',
};

const sizeClasses = {
  sm: 'px-3 py-1 text-xs',
  md: 'px-5 py-2 text-sm',
  lg: 'px-8 py-3 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        border font-[var(--font-display)] uppercase tracking-wider
        transition-all duration-200 cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
