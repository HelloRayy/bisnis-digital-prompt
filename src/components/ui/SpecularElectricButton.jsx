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
  const formattedCredits = Number(credits || 0).toLocaleString('id-ID');

  return (
    <button
      onClick={onClick}
      title={title}
      type="button"
      className={`relative inline-flex items-center justify-center p-[1px] rounded-full overflow-hidden
        bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:to-purple-600
        shadow-[0_2px_10px_rgba(59,130,246,0.15)] hover:shadow-[0_4px_16px_rgba(59,130,246,0.25)]
        transition-all duration-200 cursor-pointer shrink-0 active:scale-95 group ${className}`}
    >
      {/* Inner White Button Container */}
      <span className="relative z-10 inline-flex items-center gap-2 h-[32px] px-3 rounded-full bg-white text-slate-900 font-sans text-xs font-bold w-full transition-colors group-hover:bg-slate-50">
        {/* Icon Badge */}
        <span className="p-0.5 rounded-full bg-blue-50 border border-blue-200 group-hover:bg-blue-100 flex items-center justify-center">
          <WalletMinimalIcon size={12} className="text-blue-600 shrink-0" />
        </span>

        {/* Label & Number */}
        <span className="whitespace-nowrap flex items-center gap-1">
          <strong className="text-blue-700 font-extrabold text-xs">
            {formattedCredits}
          </strong>
          <span className="text-slate-600 text-xs font-medium">{label}</span>
        </span>
      </span>
    </button>
  );
}

export default SpecularElectricButton;
