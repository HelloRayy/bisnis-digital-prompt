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
  label = 'Kredit', 
  title = 'Klik untuk Top Up Kredit',
  className = ''
}) {
  const numericCredits = Number(credits || 0);
  const formattedCredits = numericCredits.toLocaleString('id-ID');
  const isHighTier = numericCredits > 10000;

  return (
    <button
      onClick={onClick}
      title={title}
      type="button"
      className={`relative inline-flex items-center justify-center p-[1.5px] rounded-full overflow-hidden
        ${isHighTier 
          ? 'bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 shadow-[0_0_20px_rgba(168,85,247,0.5)] ring-2 ring-purple-400/40 hover:shadow-[0_0_25px_rgba(168,85,247,0.7)]' 
          : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-[0_2px_10px_rgba(59,130,246,0.15)] hover:shadow-[0_4px_16px_rgba(59,130,246,0.25)]'
        }
        transition-all duration-200 cursor-pointer shrink-0 active:scale-95 group ${className}`}
    >
      {/* Inner Button Box with dynamic purple tier styling */}
      <span className={`relative z-10 inline-flex items-center gap-2 h-[32px] px-3.5 rounded-full font-sans text-xs font-bold w-full transition-colors ${
        isHighTier 
          ? 'bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white group-hover:from-purple-900 group-hover:to-indigo-900' 
          : 'bg-white text-slate-900 group-hover:bg-slate-50 dark:bg-zinc-900 dark:text-white'
      }`}>
        {/* Icon Badge */}
        <span className={`p-1 rounded-full flex items-center justify-center ${
          isHighTier 
            ? 'bg-purple-500/30 border border-purple-400/60 shadow-xs' 
            : 'bg-blue-50 border border-blue-200 group-hover:bg-blue-100'
        }`}>
          <WalletMinimalIcon size={12} className={isHighTier ? "text-purple-200 shrink-0" : "text-blue-600 shrink-0"} />
        </span>

        {/* Label & Number */}
        <span className="whitespace-nowrap flex items-center gap-1.5">
          <strong className={`font-black text-xs tracking-tight ${isHighTier ? 'text-purple-100 drop-shadow-xs' : 'text-blue-700 dark:text-blue-400'}`}>
            {formattedCredits}
          </strong>
          <span className={`text-xs font-bold tracking-wide uppercase text-[10px] ${isHighTier ? 'text-purple-300' : 'text-slate-700 dark:text-zinc-300'}`}>
            {label}
          </span>
        </span>
      </span>
    </button>
  );
}

export default SpecularElectricButton;
