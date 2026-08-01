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
      className={`relative inline-flex items-center gap-2 h-9 px-4 rounded-full overflow-hidden
        bg-gradient-to-r from-white via-blue-50/80 to-blue-100/90 
        hover:from-blue-50 hover:via-blue-100 hover:to-blue-200/90
        text-slate-900 font-sans text-xs font-bold
        border border-blue-200/90 border-t-blue-500/90
        shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_2px_10px_rgba(37,99,235,0.12)]
        hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_4px_16px_rgba(37,99,235,0.22)]
        transition-all duration-300 cursor-pointer shrink-0 active:scale-95 group ${className}`}
    >
      {/* Micro Dot Matrix Pattern Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity"
        style={{
          backgroundImage: 'radial-gradient(ellipse at center, rgba(37, 99, 235, 0.25) 1px, transparent 1px)',
          backgroundSize: '5px 5px',
          backgroundPosition: 'right center'
        }}
      />

      {/* Icon */}
      <div className="relative z-10 p-0.5 rounded-full bg-blue-500/10 border border-blue-400/30 group-hover:bg-blue-500/20 group-hover:scale-105 transition-all">
        <Coins size={14} className="text-blue-600 shrink-0 group-hover:rotate-12 transition-transform" />
      </div>

      {/* Label & Number */}
      <span className="relative z-10 whitespace-nowrap flex items-center gap-1">
        <span className="text-blue-700 font-extrabold text-xs sm:text-sm">
          <AnimatedNumber value={credits} />
        </span>
        <span className="text-slate-600 text-xs font-semibold">{label}</span>
      </span>
    </button>
  );
}

export default SpecularElectricButton;
