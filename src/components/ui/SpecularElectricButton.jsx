import React from 'react';
import { Coins } from 'lucide-react';
import { AnimatedNumber } from './animated-counter';

export function SpecularElectricButton({ 
  onClick, 
  credits = 0, 
  label = 'Kredit', 
  title = 'Klik untuk Top Up Kredit',
  className = ''
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      type="button"
      className={`relative inline-flex items-center justify-center p-[1.5px] rounded-full overflow-hidden
        shadow-[0_2px_12px_rgba(37,99,235,0.15)] hover:shadow-[0_4px_20px_rgba(37,99,235,0.3)]
        transition-all duration-300 cursor-pointer shrink-0 active:scale-95 group ${className}`}
    >
      {/* Animated Rotating Shiny Gradient Border Layer */}
      <span className="absolute inset-[-150%] animate-[spin_3.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#3b82f6_0%,#1d4ed8_28%,transparent_50%,#60a5fa_78%,#3b82f6_100%)] opacity-90 group-hover:opacity-100 transition-opacity" />

      {/* Inner White Button Container (No Grid Effect, Pure White BG) */}
      <span className="relative z-10 inline-flex items-center gap-2 h-[34px] px-3.5 rounded-full bg-white text-slate-900 font-sans text-xs font-bold w-full transition-colors group-hover:bg-slate-50/95">
        {/* Icon Badge */}
        <span className="p-0.5 rounded-full bg-blue-50 border border-blue-200 group-hover:bg-blue-100 group-hover:scale-105 transition-all flex items-center justify-center">
          <Coins size={13} className="text-blue-600 shrink-0 group-hover:rotate-12 transition-transform" />
        </span>

        {/* Label & Number */}
        <span className="whitespace-nowrap flex items-center gap-1">
          <strong className="text-blue-700 font-extrabold text-xs sm:text-sm">
            <AnimatedNumber value={credits} />
          </strong>
          <span className="text-slate-700 text-xs font-semibold">{label}</span>
        </span>
      </span>
    </button>
  );
}

export default SpecularElectricButton;
