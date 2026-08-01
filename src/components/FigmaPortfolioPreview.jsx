import React, { useState, useEffect, useRef, useMemo } from 'react';
import promptsData from '../data/prompts.json';
import { 
  ArrowUpRight01Icon, 
  SparklesIcon, 
  Logout01Icon, 
  Login01Icon, 
  Image01Icon, 
  Video01Icon, 
  BrowserIcon, 
  FavouriteIcon,
  CircleUnlock01Icon
} from 'hugeicons-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { BanknoteArrowUp, Coins } from 'lucide-react';
import { getCleanShortSlug } from '../utils/slug';
import { getOptimizedImageUrl } from '../utils/image-optimizer';
import { AppSidebar } from '@/components/app-sidebar';
import { Dock } from '@/components/ui/dock-two';
import { AnimatedNumber } from '@/components/ui/animated-counter';
import { SearchInputWithLoader } from '@/components/ui/search-input';
import SpecularButton from '@/components/ui/SpecularButton';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// Helper to perform Fisher-Yates Shuffle on array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

function PortfolioImageItem({ src, alt, isPriority = false }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const optimizedSrc = useMemo(() => getOptimizedImageUrl(src, 500, 75), [src]);

  // Reset loading state if image URL changes
  useEffect(() => {
    setIsLoaded(false);
  }, [src]);

  return (
    <>
      {!isLoaded && (
        <div className="absolute inset-0 bg-zinc-200 overflow-hidden z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
        </div>
      )}
      <img
        src={optimizedSrc}
        alt={alt}
        loading={isPriority ? "eager" : "lazy"}
        fetchPriority={isPriority ? "high" : "low"}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-105 z-10 ${
          isLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-md scale-105'
        }`}
      />
    </>
  );
}

export default function FigmaPortfolioPreview({ 
  onOpenDetail = () => {},
  onNavigateHome = () => {},
  favoritePromptIds = [],
  purchasedPromptIds = [],
  userCredits = 0,
  userRole = "Starter Plan",
  currentUser = null,
  onOpenAuth = () => {},
  onOpenUpgrade = () => {},
  onSignOut = () => {}
}) {
  // Default selected category: Image
  const [activeCategory, setActiveCategory] = useState('image');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(30);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const loadMoreRef = useRef(null);

  // Load all 399 prompts from dataset with random shuffle on page refresh
  const [allPrompts] = useState(() => {
    return shuffleArray(promptsData).map((item, idx) => ({
      ...item,
      _stableId: item.id ? `prompt_${item.id}_${idx}` : `prompt_idx_${idx}`
    }));
  });

  // Filter items based on active category & search query
  const rawFiltered = allPrompts.filter((item) => {
    const promptText = (item.prompt || '').toLowerCase();
    const authorText = (item.author || '').toLowerCase();
    const matchesSearch = searchQuery === '' || promptText.includes(searchQuery.toLowerCase()) || authorText.includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    const catLower = (item.categories || []).join(' ').toLowerCase();
    if (activeCategory === 'image') {
      return catLower.includes('image') || catLower.includes('graphic') || catLower.includes('illustration') || catLower.includes('3d') || catLower.includes('poster') || catLower.includes('photography');
    }
    if (activeCategory === 'video') {
      return catLower.includes('video') || catLower.includes('motion') || catLower.includes('animation');
    }
    if (activeCategory === 'website') {
      return catLower.includes('web') || catLower.includes('ui') || catLower.includes('brand') || catLower.includes('product');
    }
    if (activeCategory === 'favorite') {
      return favoritePromptIds.includes(item.id);
    }
    if (activeCategory === 'unlocked') {
      return purchasedPromptIds.includes(item.id);
    }
    return true;
  });

  // Susun: 10 Prompt Gratis teratas ditaruh paling depan, lalu tampilkan seluruh prompt sisa di bawahnya
  const freePrompts = rawFiltered.filter(p => !p.isPremium);
  const premiumPrompts = rawFiltered.filter(p => p.isPremium);

  const top10Free = freePrompts.slice(0, 10);
  const remainingFree = freePrompts.slice(10);

  // Full dataset containing all available items (10 Free prompts at top, remaining below)
  const filteredPrompts = useMemo(() => {
    return [...top10Free, ...premiumPrompts, ...remainingFree];
  }, [rawFiltered]);

  // Reset visible count when category or search changes
  useEffect(() => {
    setVisibleCount(30);
  }, [activeCategory, searchQuery]);

  // Progressive batch rendering observer (loads +30 cards as user scrolls near bottom)
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) => Math.min(prev + 30, filteredPrompts.length));
      }
    }, { rootMargin: '400px' });

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [filteredPrompts.length]);

  const displayedPrompts = useMemo(() => {
    return filteredPrompts.slice(0, visibleCount);
  }, [filteredPrompts, visibleCount]);

  // Diverse Organic Asymmetric Aspect Ratios for dynamic Masonry layout
  const aspectRatios = [
    'aspect-[4/5]',    // Col 1 Tall
    'aspect-square',   // Col 2 Square
    'aspect-[2/3]',    // Col 3 Extra Tall
    'aspect-[16/11]',  // Col 4 Wide
    'aspect-[9/14]',   // Col 5 Ultra Tall
    'aspect-[3/4]',    // Col 6 Medium Tall
    'aspect-[5/4]',    // Col 7 Medium Wide
    'aspect-[3/5]'     // Col 8 Portrait
  ];

  // Helper to extract a short, concise 1-line title
  const getShortTitle = (promptObj) => {
    if (!promptObj) return 'Untitled Artwork';
    const cleanPrompt = promptObj.prompt.replace(/^\{.*?\}/, '').trim();
    if (cleanPrompt.length <= 24) return cleanPrompt;
    
    const words = cleanPrompt.split(' ');
    if (words.length > 3) {
      const shortSnippet = words.slice(0, 3).join(' ');
      if (shortSnippet.length > 24) return shortSnippet.slice(0, 23) + '...';
      return shortSnippet;
    }
    return cleanPrompt.slice(0, 23) + '...';
  };

  return (
    <SidebarProvider>
      <AppSidebar 
        currentUser={currentUser}
        userCredits={userCredits}
        userRole={userRole}
        onOpenAuth={onOpenAuth}
        onOpenUpgrade={onOpenUpgrade}
        onSignOut={onSignOut}
        onSelectCategory={setActiveCategory}
      />
      <SidebarInset>
        {/* Fixed Glassmorphism Navbar Header */}
        <header className="fixed top-0 right-0 left-0 md:left-[var(--sidebar-width)] group-data-[state=collapsed]/sidebar-wrapper:md:left-[var(--sidebar-width-icon)] z-40 flex h-16 shrink-0 items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 md:px-8 bg-white/95 backdrop-blur-xl transition-all">
          {/* Left: Sidebar trigger, separator, breadcrumbs */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
            <SidebarTrigger aria-label="Buka Menu Sidebar" className="-ml-1 text-obsidian hover:bg-black/5 rounded-lg p-1.5 transition-colors shrink-0" />
            <Separator orientation="vertical" className="h-5 bg-black/10 shrink-0" />
            <Breadcrumb className="min-w-0 truncate">
              <BreadcrumbList className="flex-nowrap min-w-0 text-xs sm:text-sm">
                <BreadcrumbItem className="hidden sm:block shrink-0">
                  <BreadcrumbLink href="#" onClick={(e) => { e.preventDefault(); onNavigateHome(); }} className="font-bold text-obsidian hover:text-purple-600 transition-colors">
                    Prompt Hub
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden sm:block shrink-0 text-black/40" />
                <BreadcrumbItem className="min-w-0 truncate">
                  <BreadcrumbPage className="capitalize font-semibold text-black/70 truncate">
                    Portfolio ({activeCategory})
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Center: Search Bar Input matching screenshot UI */}
          <div className="hidden sm:flex flex-1 justify-center max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-2 sm:mx-4 min-w-0 transition-all duration-300">
            <SearchInputWithLoader
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              placeholder="Search..."
              className="w-full"
            />
          </div>

          {/* Right: Credits Badge & User Auth Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto z-10">
            <button 
              onClick={onOpenUpgrade}
              className="inline-flex items-center gap-2 h-9 px-3.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-sans text-xs font-bold shadow-md shadow-purple-600/20 border border-purple-400/30 transition-all duration-200 cursor-pointer shrink-0 active:scale-95 group"
              title="Klik untuk Top Up Kredit"
            >
              <Coins size={15} className="text-amber-300 shrink-0 group-hover:rotate-12 transition-transform" />
              <span className="whitespace-nowrap flex items-center gap-1">
                <span className="text-white font-extrabold"><AnimatedNumber value={userCredits} /></span>
                <span className="text-purple-100 text-xs font-medium">Kredit</span>
              </span>
            </button>

            {currentUser ? (
              <button 
                onClick={() => setShowSignOutConfirm(true)}
                aria-label="Keluar akun"
                className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-rose-50 hover:bg-rose-100/90 text-rose-600 border border-rose-200/60 text-xs font-medium transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
                title="Keluar Akun"
              >
                <Logout01Icon size={14} />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            ) : (
              <button 
                onClick={onOpenAuth}
                aria-label="Login with Google"
                className="inline-flex items-center gap-2 h-9 px-4 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 text-xs font-semibold transition-all cursor-pointer shadow-xs hover:shadow-sm active:scale-95 shrink-0 group"
              >
                <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Login with Google</span>
              </button>
            )}
          </div>
        </header>

        {/* Main Content: Masonry Grid Layout */}
        <main className="p-4 sm:p-6 md:p-8 pt-20 sm:pt-24 w-full min-w-0 max-w-full overflow-x-hidden mx-auto pb-32">
          {displayedPrompts.length > 0 ? (
            <>
              <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-4 sm:gap-6 space-y-4 sm:space-y-6 mt-8 sm:mt-10 md:mt-12">
                {displayedPrompts.map((item, index) => {
                  const isUnlocked = purchasedPromptIds.includes(item.id) || !item.isPremium;
                  const aspectClass = aspectRatios[index % aspectRatios.length];
                  const customSlug = getCleanShortSlug(item);
                  const promptCost = item.cost ?? (item.prompt?.length >= 1533 ? 500 : 400);

                  return (
                    <div 
                      key={item._stableId}
                      onClick={() => onOpenDetail(item, customSlug)}
                      className="break-inside-avoid group cursor-pointer flex flex-col gap-2.5 mb-6 gpu-accelerated"
                    >
                      <div className={`relative w-full ${aspectClass} rounded-2xl overflow-hidden bg-plaster-gray border border-black/5 shadow-xs group-hover:shadow-xl transition-shadow duration-300`}>
                        <PortfolioImageItem src={item.image} alt={getShortTitle(item)} isPriority={index < 6} />

                        {/* Top Subtle Gradient Overlay (Visible on Hover) */}
                        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                        {/* Top Overlay Badge (Price / Status - Revealed on Hover) */}
                        <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-1 group-hover:translate-y-0">
                          {item.isPremium ? (
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold shadow-md backdrop-blur-md ${
                              isUnlocked 
                                ? 'bg-emerald-500/90 text-white border border-emerald-400/50' 
                                : 'bg-black/80 text-white border border-white/20'
                            }`}>
                              {isUnlocked ? 'Terbuka' : `${promptCost} Kredit`}
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/95 text-obsidian border border-black/10 shadow-md backdrop-blur-md">
                              Gratis
                            </span>
                          )}
                        </div>

                        {/* Hover Arrow Overlay */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                          <div className="w-11 h-11 rounded-full aspect-square bg-white text-obsidian flex items-center justify-center shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                            <ArrowUpRight01Icon size={20} />
                          </div>
                        </div>
                      </div>

                      {/* Meta Card Info */}
                      <div className="flex flex-col gap-1 px-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-xs font-bold text-obsidian group-hover:text-purple-600 transition-colors truncate">
                            {getShortTitle(item)}
                          </h3>
                        </div>
                        <div className="flex items-center justify-between gap-2 text-[11px] text-ash-gray font-medium">
                          <span className="truncate">@{item.author?.startsWith('@') ? item.author.slice(1) : (item.author || 'Daniel Triendl')}</span>
                          {item.isPremium && (
                            <SpecularButton isUnlocked={isUnlocked}>
                              {isUnlocked ? 'Unlocked' : 'Premium'}
                            </SpecularButton>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progressive Batch Loading Sentinel */}
              {visibleCount < filteredPrompts.length && (
                <div ref={loadMoreRef} className="py-8 flex justify-center items-center">
                  <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-3 text-ash-gray font-sans">
              <p className="text-base font-semibold">Tidak ada karya yang cocok dengan pencarian "{searchQuery}".</p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveCategory('image'); }} 
                className="text-xs font-bold text-obsidian underline cursor-pointer"
              >
                Reset Pencarian
              </button>
            </div>
          )}

          {/* Clean Bottom Spacing for Floating Dock */}
          <div className="h-16 w-full pointer-events-none" />
        </main>

        {/* Bottom Low Opacity Scroll Fade Mask (Sticky inside SidebarInset) */}
        <div className="sticky bottom-0 z-30 w-full h-10 -mt-10 bg-gradient-to-t from-white/70 via-white/20 to-transparent pointer-events-none" />

        {(() => {
          const hasCreditsOrPurchases = userCredits > 0 || (purchasedPromptIds && purchasedPromptIds.length > 0);
          return (
            <Dock 
              items={[
                {
                  icon: Image01Icon,
                  label: 'Gambar',
                  isActive: activeCategory === 'image',
                  onClick: () => setActiveCategory('image')
                },
                {
                  icon: Video01Icon,
                  label: 'Video',
                  isLocked: !hasCreditsOrPurchases,
                  isActive: activeCategory === 'video',
                  onClick: () => setActiveCategory('video')
                },
                {
                  icon: BrowserIcon,
                  label: 'Website',
                  isLocked: !hasCreditsOrPurchases,
                  isActive: activeCategory === 'website',
                  onClick: () => setActiveCategory('website')
                },
                { isSeparator: true },
                {
                  icon: FavouriteIcon,
                  label: 'Favorit',
                  isActive: activeCategory === 'favorite',
                  onClick: () => setActiveCategory(activeCategory === 'favorite' ? 'image' : 'favorite'),
                  className: activeCategory === 'favorite' 
                    ? 'bg-rose-50 text-rose-600 font-bold' 
                    : 'text-rose-500 hover:bg-rose-50/80 hover:text-rose-600'
                },
                {
                  icon: CircleUnlock01Icon,
                  label: 'Milik Saya',
                  isActive: activeCategory === 'unlocked',
                  onClick: () => setActiveCategory(activeCategory === 'unlocked' ? 'image' : 'unlocked'),
                  className: activeCategory === 'unlocked' 
                    ? 'bg-emerald-50 text-emerald-600 font-bold' 
                    : 'text-emerald-500 hover:bg-emerald-50/80 hover:text-emerald-600'
                },
                {
                  icon: BanknoteArrowUp,
                  label: 'Top Up',
                  onClick: onOpenUpgrade,
                  className: 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }
              ]} 
            />
          );
        })()}
      </SidebarInset>

      {/* Sign Out Confirmation Modal (Red Destructive Style with Prominent Red Logout Icon) */}
      <AlertDialog open={showSignOutConfirm} onOpenChange={setShowSignOutConfirm}>
        <AlertDialogContent className="max-w-[420px] bg-white p-6 rounded-2xl border border-rose-100 shadow-2xl flex flex-col gap-4">
          <AlertDialogHeader className="flex flex-col text-left items-start gap-2 w-full">
            <div className="w-10 h-10 rounded-full bg-rose-100/80 border border-rose-200/60 text-rose-600 flex items-center justify-center shrink-0">
              <Logout01Icon size={20} className="stroke-[2.2]" />
            </div>
            <AlertDialogTitle className="text-base font-bold text-obsidian text-left">
              Apakah Anda yakin ingin keluar?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-zinc-500 font-normal leading-relaxed text-left">
              Sesi login Anda akan diakhiri. Anda perlu masuk kembali untuk mengakses sisa kredit dan fitur prompt eksklusif.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="w-full flex flex-row items-center justify-end gap-2.5 pt-2">
            <AlertDialogCancel
              onClick={() => setShowSignOutConfirm(false)}
              className="rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-obsidian text-xs font-semibold py-2 px-4 cursor-pointer"
            >
              Batal
            </AlertDialogCancel>
            
            <AlertDialogAction
              onClick={() => {
                setShowSignOutConfirm(false);
                onSignOut();
              }}
              className="rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold py-2 px-4 cursor-pointer border-none shadow-md shadow-rose-600/20 transition-colors"
            >
              Keluar Akun
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}