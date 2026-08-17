import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Search, CreditCard, Heart, Clock, User } from 'lucide-react';

/**
 * KUMO UI Mobile Bottom Dock (Floating Glass Pill Navigation)
 * Eksklusif untuk mobile screen (< 768px / md:hidden) dengan visual language yang konsisten.
 */
export default function MobileBottomDock({
  currentPath = '/',
  activeCategory = 'all',
  favoriteCount = 0,
  onNavigate = () => {},
  onSelectCategory = () => {},
  onOpenSearch = () => {},
  onOpenUpgrade = () => {},
  onOpenHistory = () => {},
  onOpenAuth = () => {},
  currentUser = null,
}) {
  const isHome = (currentPath === '/' || currentPath === '') && activeCategory !== 'favorite';
  const isSubs = currentPath === '/subscription' || currentPath === '/pricing' || currentPath === '/subs';
  const isFav = activeCategory === 'favorite';

  const navItems = [
    {
      id: 'explore',
      label: 'Explore',
      icon: Sparkles,
      isActive: isHome && !isSubs && !isFav,
      onClick: () => {
        onSelectCategory('all');
        if (currentPath !== '/') {
          onNavigate('/');
        }
      }
    },
    {
      id: 'search',
      label: 'Cari',
      icon: Search,
      isActive: false,
      onClick: () => {
        onOpenSearch();
      }
    },
    {
      id: 'subscription',
      label: 'Langganan',
      icon: CreditCard,
      isActive: isSubs,
      onClick: () => {
        onOpenUpgrade();
      }
    },
    {
      id: 'favorites',
      label: 'Favorit',
      icon: Heart,
      badge: favoriteCount > 0 ? favoriteCount : null,
      isActive: isFav,
      onClick: () => {
        if (currentPath !== '/') {
          onNavigate('/');
        }
        onSelectCategory(isFav ? 'all' : 'favorite');
      }
    },
    {
      id: 'history',
      label: currentUser ? 'Riwayat' : 'Akun',
      icon: currentUser ? Clock : User,
      isActive: false,
      onClick: () => {
        if (currentUser) {
          onOpenHistory();
        } else {
          onOpenAuth();
        }
      }
    }
  ];

  return (
    <nav 
      aria-label="Mobile Navigation Dock"
      className="fixed bottom-4 inset-x-0 z-40 flex justify-center px-4 md:hidden pointer-events-none"
    >
      <div className="pointer-events-auto flex items-center gap-1 p-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-300/60 dark:border-zinc-700/60 shadow-[0_8px_30px_rgba(0,0,0,0.12)] transform-gpu transition-all">
        {navItems.map((item) => {
          const IconComp = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              aria-label={item.label}
              className={`relative flex flex-col items-center justify-center min-w-[56px] h-12 px-2.5 rounded-full text-[10px] font-semibold transition-colors cursor-pointer select-none active:scale-90 ${
                item.isActive
                  ? 'text-zinc-950 dark:text-white'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              {/* Active Sliding Pill Indicator */}
              {item.isActive && (
                <motion.div
                  layoutId="activeMobileDockPill"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  className="absolute inset-0 bg-zinc-100 dark:bg-zinc-800 rounded-full border border-black/5 dark:border-white/10 shadow-2xs -z-10"
                />
              )}

              <div className="relative flex items-center justify-center">
                <IconComp 
                  size={18} 
                  className={`transition-transform duration-200 ${
                    item.isActive 
                      ? 'text-purple-600 dark:text-purple-400 stroke-[2.3] scale-105' 
                      : 'stroke-[1.8]'
                  }`} 
                />
                {item.badge !== null && item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[14px] h-3.5 px-1 rounded-full bg-purple-600 text-white text-[9px] font-extrabold flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="mt-0.5 tracking-tight font-medium leading-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
