import React from 'react';
import { motion } from 'framer-motion';
import { 
  SidebarHomeIcon,
  SidebarSearchIcon,
  SidebarCreditCardIcon,
  SidebarHeartIcon,
  SidebarClockIcon
} from './SidebarIcons';

/**
 * KUMO UI Mobile Bottom Dock (Icon-Only Floating Glass Pill Navigation)
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
      label: 'Home',
      icon: SidebarHomeIcon,
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
      icon: SidebarSearchIcon,
      isActive: false,
      onClick: () => {
        onOpenSearch();
      }
    },
    {
      id: 'subscription',
      label: 'Langganan',
      icon: SidebarCreditCardIcon,
      isActive: isSubs,
      onClick: () => {
        onOpenUpgrade();
      }
    },
    {
      id: 'favorites',
      label: 'Favorit',
      icon: SidebarHeartIcon,
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
      icon: SidebarClockIcon,
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
      <div className="pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.14)]">
        {navItems.map((item) => {
          const IconComp = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              aria-label={item.label}
              title={item.label}
              className={`relative flex items-center justify-center w-11 h-11 rounded-full transition-all cursor-pointer select-none active:scale-90 ${
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
                  size={22}
                  active={item.isActive}
                  className={`transition-transform duration-200 ${
                    item.isActive 
                      ? 'text-purple-600 dark:text-purple-400 scale-105' 
                      : ''
                  }`} 
                />
                {item.badge !== null && item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 min-w-[15px] h-3.5 px-1 rounded-full bg-purple-600 text-white text-[9px] font-extrabold flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
