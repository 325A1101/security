import React from 'react';
import { playClickSound } from '../utils/audio.ts';

interface CyberButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
}

export const CyberButton: React.FC<CyberButtonProps> = ({
  children,
  onClick,
  active = false,
  variant = 'primary',
  className = '',
  disabled = false,
  type = 'button',
  'aria-label': ariaLabel,
}) => {
  const handleClick = () => {
    if (disabled) return;
    playClickSound();
    onClick?.();
  };

  const baseStyle =
    'relative inline-flex items-center justify-center font-bold text-sm tracking-wide transition-all duration-200 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 select-none';

  const variants = {
    primary: active
      ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30 border border-cyan-400 font-extrabold'
      : 'bg-slate-800/90 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-950/70 hover:border-cyan-400 hover:text-cyan-200 hover:shadow-md hover:shadow-cyan-500/20 active:scale-[0.98]',
    secondary: active
      ? 'bg-slate-700 text-white border border-slate-500'
      : 'bg-slate-900/80 text-slate-300 border border-slate-700/80 hover:bg-slate-800 hover:text-white hover:border-slate-500',
    danger:
      'bg-rose-950/40 text-rose-300 border border-rose-500/40 hover:bg-rose-900/60 hover:text-white hover:border-rose-400',
    success:
      'bg-emerald-950/40 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900/60 hover:text-white hover:border-emerald-400',
    ghost:
      'bg-transparent text-slate-400 hover:text-cyan-300 hover:bg-slate-800/50 border border-transparent',
  };

  const disabledStyle = disabled
    ? 'opacity-40 cursor-not-allowed pointer-events-none'
    : '';

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${baseStyle} ${variants[variant]} ${disabledStyle} px-4 py-2.5 ${className}`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};
