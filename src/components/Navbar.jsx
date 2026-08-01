import React, { useState } from 'react';
import { User02Icon, SparklesIcon, UserIcon, Login01Icon, ArrowDown01Icon } from 'hugeicons-react';

export default function Navbar({ 
  brandName = "Daniel Triendl",
  userCredits = 0,
  currentUser = null,
  onOpenAuth = () => {},
  onOpenUpgrade = () => {},
  onSignOut = () => {},
  showCapsuleNav = true
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCenterMenu, setActiveCenterMenu] = useState(null);

  const toggleCenterMenu = (menuName) => {
    setActiveCenterMenu(prev => prev === menuName ? null : menuName);
  };

  return (
    <header className="w-full h-[96px] px-6 md:px-12 flex items-center justify-between bg-transparent text-black transition-colors select-none gap-6 md:gap-10">
      {/* 1. Brand Logo Avatar & Title (Left Side) */}
      <div className="flex items-center gap-3.5 cursor-pointer group shrink-0">
        <div className="w-9 h-9 rounded-full bg-[#f2f2f2] border border-black/5 flex items-center justify-center shrink-0 shadow-2xs transition-transform duration-300 group-hover:scale-105">
          <User02Icon 
            size={22} 
            className="text-black transition-colors duration-300"
          />
        </div>
        <span className="font-sans text-base md:text-lg font-bold text-black tracking-tight group-hover:text-purple-600 transition-colors">
          {brandName}
        </span>
      </div>

      {/* 2. Right Side: Navigation Menu & Account/Credits Capsule Container */}
      {showCapsuleNav && (
        <div className="flex items-center gap-8 md:gap-10 shrink-0">
          {/* Navigation Menu Links */}
          <nav className="hidden md:flex items-center gap-6 font-sans text-sm font-medium text-black/90">
            {/* Item 1: Getting started */}
            <div className="relative">
              <button
                onClick={() => toggleCenterMenu('getting-started')}
                className="flex items-center gap-1 hover:text-purple-600 transition-colors py-1 cursor-pointer font-semibold"
              >
                <span>Getting started</span>
                <ArrowDown01Icon size={14} className={`transition-transform duration-200 ${activeCenterMenu === 'getting-started' ? 'rotate-180' : ''}`} />
              </button>
              {activeCenterMenu === 'getting-started' && (
                <div className="absolute right-0 top-9 w-56 bg-white rounded-2xl p-2 border border-black/10 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-1">
                  <a href="#intro" onClick={() => setActiveCenterMenu(null)} className="px-3 py-2 rounded-xl hover:bg-zinc-100 text-xs font-semibold text-zinc-800">Introduction</a>
                  <a href="#install" onClick={() => setActiveCenterMenu(null)} className="px-3 py-2 rounded-xl hover:bg-zinc-100 text-xs font-semibold text-zinc-800">Installation Guide</a>
                  <a href="#typography" onClick={() => setActiveCenterMenu(null)} className="px-3 py-2 rounded-xl hover:bg-zinc-100 text-xs font-semibold text-zinc-800">Typography & Styles</a>
                </div>
              )}
            </div>

            {/* Item 2: Components */}
            <div className="relative">
              <button
                onClick={() => toggleCenterMenu('components')}
                className="flex items-center gap-1 hover:text-purple-600 transition-colors py-1 cursor-pointer font-semibold"
              >
                <span>Components</span>
                <ArrowDown01Icon size={14} className={`transition-transform duration-200 ${activeCenterMenu === 'components' ? 'rotate-180' : ''}`} />
              </button>
              {activeCenterMenu === 'components' && (
                <div className="absolute right-0 top-9 w-60 bg-white rounded-2xl p-2 border border-black/10 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-1">
                  <a href="#prompts" onClick={() => setActiveCenterMenu(null)} className="px-3 py-2 rounded-xl hover:bg-zinc-100 text-xs font-semibold text-zinc-800">Prompt Cards</a>
                  <a href="#gallery" onClick={() => setActiveCenterMenu(null)} className="px-3 py-2 rounded-xl hover:bg-zinc-100 text-xs font-semibold text-zinc-800">Masonry Gallery</a>
                  <a href="#modals" onClick={() => setActiveCenterMenu(null)} className="px-3 py-2 rounded-xl hover:bg-zinc-100 text-xs font-semibold text-zinc-800">Editorial Modals</a>
                </div>
              )}
            </div>

            {/* Item 3: With Icon */}
            <div className="relative">
              <button
                onClick={() => toggleCenterMenu('with-icon')}
                className="flex items-center gap-1 hover:text-purple-600 transition-colors py-1 cursor-pointer font-semibold"
              >
                <span>With Icon</span>
                <ArrowDown01Icon size={14} className={`transition-transform duration-200 ${activeCenterMenu === 'with-icon' ? 'rotate-180' : ''}`} />
              </button>
              {activeCenterMenu === 'with-icon' && (
                <div className="absolute right-0 top-9 w-52 bg-white rounded-2xl p-2 border border-black/10 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-1">
                  <a href="#hugeicons" onClick={() => setActiveCenterMenu(null)} className="px-3 py-2 rounded-xl hover:bg-zinc-100 text-xs font-semibold text-zinc-800">Hugeicons Pro</a>
                  <a href="#lucide" onClick={() => setActiveCenterMenu(null)} className="px-3 py-2 rounded-xl hover:bg-zinc-100 text-xs font-semibold text-zinc-800">Lucide React</a>
                </div>
              )}
            </div>

            {/* Item 4: Docs */}
            <a 
              href="#docs" 
              className="hover:text-purple-600 transition-colors py-1 font-semibold"
            >
              Docs
            </a>
          </nav>
          <nav className="inline-flex items-center bg-[#f2f2f2] rounded-[48px] h-[48px] w-auto p-1 border border-black/5 shrink-0 shadow-2xs gap-1">
            {/* Item 1: Credit Info Pill */}
            <button
              onClick={onOpenUpgrade}
              className="inline-flex items-center justify-center gap-2.5 h-[40px] px-5 rounded-[48px] bg-white text-black font-sans text-[14px] font-medium shadow-xs transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-95 whitespace-nowrap"
              title="Klik untuk Top Up Kredit"
            >
              <SparklesIcon 
                size={20} 
                className="text-amber-500 fill-amber-400 shrink-0" 
              />
              <span className="whitespace-nowrap flex items-center gap-1.5">
                <strong className="font-bold text-obsidian text-sm">{userCredits.toLocaleString()}</strong>
                <span className="text-black/60 text-xs font-medium">Kredit</span>
              </span>
            </button>

            {/* Item 2: User Account & Dropdown Trigger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center gap-2 h-[40px] px-5 rounded-[48px] bg-transparent text-black/80 hover:text-black font-sans text-[14px] font-medium transition-all duration-200 cursor-pointer hover:bg-black/5 whitespace-nowrap"
            >
              <UserIcon size={20} className="text-black shrink-0" />
              <span className="whitespace-nowrap font-semibold text-sm">
                {currentUser ? (currentUser.email?.split('@')[0] || 'Akun') : 'Akun'}
              </span>
              <ArrowDown01Icon size={14} className={`transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>
          </nav>

          {/* User Dropdown Panel */}
          {isMenuOpen && (
            <div className="absolute right-0 top-[56px] w-64 bg-white rounded-2xl p-3 border border-black/10 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-1">
              <div className="px-3 py-2 border-b border-black/5 mb-1">
                <p className="text-[11px] font-bold text-black/40 uppercase tracking-wider">Status Akun</p>
                <p className="text-xs font-semibold text-black truncate">{currentUser ? currentUser.email : 'Tamu (Guest)'}</p>
              </div>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenUpgrade();
                }}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-zinc-100 text-xs font-semibold text-black transition-colors text-left"
              >
                <span className="flex items-center gap-2"><SparklesIcon size={16} className="text-amber-500" /> Top Up Kredit</span>
                <span className="font-bold text-purple-600">{userCredits} Kredit</span>
              </button>

              {currentUser ? (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onSignOut();
                  }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-red-50 text-xs font-semibold text-red-600 transition-colors text-left"
                >
                  <Login01Icon size={16} /> Keluar (Sign Out)
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-100/80 text-xs font-semibold text-slate-700 transition-colors text-left"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Login with Google</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
