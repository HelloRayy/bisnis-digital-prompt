import React from 'react';

export default function SpecularButton({
  children = 'Premium',
  isUnlocked = false,
  className = '',
  onClick
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide transition-colors duration-150 shrink-0 select-none ${
        isUnlocked
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-2xs hover:bg-emerald-100'
          : 'bg-purple-50 text-purple-700 border border-purple-300 shadow-2xs hover:bg-purple-100'
      } ${className}`}
    >
      <span className="font-semibold">
        {children}
      </span>
    </button>
  );
}
