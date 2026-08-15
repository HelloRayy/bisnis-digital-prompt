import React from 'react';

// Wallet Minimal Icon
export function WalletMinimalIcon({ size = 13, className = "" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M17 14h.01"/>
      <path d="M7 7h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14"/>
    </svg>
  );
}

export function SpecularElectricButton({ 
  onClick, 
  credits = 0, 
  label = 'KREDIT', 
  title = 'Klik untuk Top Up Kredit',
  className = ''
}) {
  const numericCredits = Number(credits || 0);
  const formattedCredits = numericCredits.toLocaleString('id-ID');

  return (
    <button
      onClick={onClick}
      title={title}
      type="button"
      className={`relative inline-flex items-center gap-2.5 h-9 px-3.5 sm:px-4 rounded-full bg-gradient-to-b from-purple-500 via-purple-600 to-indigo-600 text-white border border-purple-300/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.45),0_1.5px_4px_0_rgba(147,51,234,0.3)] hover:from-purple-400 hover:via-purple-500 hover:to-indigo-500 hover:border-purple-200/60 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_3px_8px_0_rgba(147,51,234,0.4)] font-sans text-xs font-bold transition-all duration-200 cursor-pointer shrink-0 active:scale-95 group select-none ${className}`}
    >
      {/* Frosted Circular Wallet Icon Badge */}
      <span className="w-5.5 h-5.5 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0 shadow-2xs group-hover:bg-white/25 transition-colors">
        <WalletMinimalIcon size={12} className="text-white shrink-0" />
      </span>

      {/* Label & Dynamic Number in Pure Crisp White */}
      <span className="whitespace-nowrap flex items-center gap-1.5 font-sans">
        <strong className="font-extrabold text-xs sm:text-sm tracking-tight text-white drop-shadow-2xs">
          {formattedCredits}
        </strong>
        <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase text-white">
          {label}
        </span>
      </span>
    </button>
  );
}

export default SpecularElectricButton;
