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
      className={`group/specular relative inline-flex items-center justify-center overflow-hidden rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide transition-all duration-300 shrink-0 select-none ${
        isUnlocked
          ? 'bg-emerald-500/10 text-emerald-900 border border-emerald-400/60 shadow-xs backdrop-blur-md'
          : 'bg-purple-500/10 text-purple-950 border border-purple-300/60 shadow-xs backdrop-blur-md'
      } ${className}`}
    >
      {/* Specular Edge Highlight Gradient (Triggers & Runs on Hover) */}
      <span 
        aria-hidden="true" 
        className="pointer-events-none absolute -inset-[100%] opacity-0 group-hover:opacity-100 group-hover/specular:opacity-100 group-hover:animate-[spin_3s_linear_infinite] group-hover/specular:animate-[spin_3s_linear_infinite] transition-opacity duration-300 bg-[conic-gradient(from_0deg,transparent_0_310deg,rgba(192,132,252,0.95)_360deg)]" 
      />

      {/* Inner Mask for Crisp Edge */}
      <span 
        aria-hidden="true" 
        className={`pointer-events-none absolute inset-[1px] rounded-full transition-colors duration-300 ${
          isUnlocked 
            ? 'bg-emerald-50/90 group-hover:bg-emerald-100/90' 
            : 'bg-gradient-to-r from-amber-100/90 via-purple-100/90 to-pink-100/90 group-hover:from-amber-200/90 group-hover:via-purple-200/90 group-hover:to-pink-200/90'
        }`} 
      />

      {/* Label Text */}
      <span className={`relative z-10 font-bold tracking-tight ${
        isUnlocked
          ? 'text-emerald-950'
          : 'bg-gradient-to-r from-purple-950 via-amber-950 to-indigo-950 bg-clip-text text-transparent'
      }`}>
        {children}
      </span>
    </button>
  );
}
