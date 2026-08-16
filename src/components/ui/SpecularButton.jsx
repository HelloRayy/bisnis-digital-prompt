import React from 'react';

export default function SpecularButton({
  children = 'Premium',
  isUnlocked = false,
  className = '',
  onClick
}) {
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide transition-colors duration-150 shrink-0 select-none shadow-2xs ${
        isUnlocked
          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60'
          : 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/60'
      } ${className}`}
    >
      <span className="font-semibold">
        {children}
      </span>
    </span>
  );
}
