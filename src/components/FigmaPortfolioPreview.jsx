import React, { useState, useEffect, useRef, useMemo } from 'react';
import promptsData from '../data/prompts.json';
import { 
  ArrowUpRight01Icon, 
  ArrowLeft01Icon,
  ArrowRight01Icon,
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
import { BanknoteArrowUp, Coins, MoreHorizontal } from 'lucide-react';
import { getCleanShortSlug } from '../utils/slug';
import { getOptimizedImageUrl } from '../utils/image-optimizer';
import { getPromptAspectRatioClass } from '../utils/prompt-helpers';
import { AppSidebar } from '@/components/app-sidebar';
import { Dock } from '@/components/ui/dock-two';
import { AnimatedNumber } from '@/components/ui/animated-counter';
import { SearchInputWithLoader } from '@/components/ui/search-input';
import SpecularButton from '@/components/ui/SpecularButton';
import SpecularElectricButton from '@/components/ui/SpecularElectricButton';
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

const PortfolioImageItem = React.memo(function PortfolioImageItem({ src, alt, isPriority = false }) {
  const optimizedSrc = getOptimizedImageUrl(src, 480, 75);

  return (
    <div className="absolute inset-0 w-full h-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden [contain:paint]">
      <img
        src={optimizedSrc}
        alt={alt}
        loading={isPriority ? "eager" : "lazy"}
        fetchPriority={isPriority ? "high" : "low"}
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
      />
    </div>
  );
});

export default function FigmaPortfolioPreview({ 
  onOpenDetail = () => {},
  onNavigateHome = () => {},
  favoritePromptIds = [],
  purchasedPromptIds = [],
  userCredits = 0,
  userRole = "Starter Plan",
  currentUser = null,
  activeCategory: propCategory,
  onSelectCategory: propOnSelectCategory,
  searchQuery: propSearchQuery,
  onSearchChange: propOnSearchChange,
  onOpenAuth = () => {},
  onOpenUpgrade = () => {},
  onSignOut = () => {}
}) {
  // Controlled or uncontrolled category & search state
  const [internalCategory, setInternalCategory] = useState('all');
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  
  const activeCategory = propCategory !== undefined ? propCategory : internalCategory;
  const setActiveCategory = propOnSelectCategory || setInternalCategory;
  const searchQuery = propSearchQuery !== undefined ? propSearchQuery : internalSearchQuery;
  const setSearchQuery = propOnSearchChange || setInternalSearchQuery;

  const [currentPage, setCurrentPage] = useState(1);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const ITEMS_PER_PAGE = 24;

  // Helper for human-friendly category label in breadcrumbs
  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'all': return 'Semua Prompt';
      case 'trending': return 'Trending Sekarang';
      case 'editor': return 'Pilihan Editor';
      case 'new': return 'Baru Dirilis';
      case 'image': return 'Image & Graphic';
      case 'video': return 'Video & Motion';
      case 'website': return 'Website & UI';
      case 'favorite': return 'Favorit Saya';
      case 'unlocked': return 'Prompt Terbuka';
      default: return cat;
    }
  };

  // Load all prompts from dataset
  const [allPrompts] = useState(() => {
    return shuffleArray(promptsData).map((item, idx) => ({
      ...item,
      _stableId: item.id ? `prompt_${item.id}__${idx}` : `prompt_idx_${idx}`
    }));
  });

  // Strictly memoized filtered dataset: Only recalculated when filters actually change!
  const filteredPrompts = useMemo(() => {
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
      if (activeCategory === 'trending') {
        return item.isPremium || (item.id % 2 === 0);
      }
      if (activeCategory === 'editor') {
        return (item.id % 3 === 0) || item.isPremium;
      }
      if (activeCategory === 'new') {
        return (item.id % 2 !== 0);
      }
      return true;
    });

    const freePrompts = rawFiltered.filter(p => !p.isPremium);
    const premiumPrompts = rawFiltered.filter(p => p.isPremium);

    const top10Free = freePrompts.slice(0, 10);
    const remainingFree = freePrompts.slice(10);

    return [...top10Free, ...premiumPrompts, ...remainingFree];
  }, [allPrompts, activeCategory, searchQuery, favoritePromptIds, purchasedPromptIds]);

  // Reset page to 1 when category or search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  // Instant 0ms scroll jump to top on page change (eliminates smooth scroll thread lag)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [currentPage]);

  const totalPages = Math.ceil(filteredPrompts.length / ITEMS_PER_PAGE) || 1;

  // Paginated Prompts (Exactly 24 items per page in DOM -> Zero Lag, 60 FPS)
  const displayedPrompts = useMemo(() => {
    return filteredPrompts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  }, [filteredPrompts, currentPage]);

  // Dynamic Column Count detection matching Tailwind breakpoints (1, 2, 3, 4, 5, 6 cols)
  const [columnCount, setColumnCount] = useState(6);

  useEffect(() => {
    const updateColumnCount = () => {
      if (typeof window === 'undefined') return;
      const w = window.innerWidth;
      if (w >= 1536) setColumnCount(6);       // 2xl
      else if (w >= 1280) setColumnCount(5);  // xl
      else if (w >= 1024) setColumnCount(4);  // lg
      else if (w >= 768) setColumnCount(3);   // md
      else setColumnCount(2);                 // mobile (< 768px ALWAYS 2 columns as in reference!)
    };

    updateColumnCount();
    window.addEventListener('resize', updateColumnCount);
    return () => window.removeEventListener('resize', updateColumnCount);
  }, []);

  // Stable Column Buckets
  const columnBuckets = useMemo(() => {
    const cols = Array.from({ length: columnCount }, () => []);
    displayedPrompts.forEach((item, index) => {
      cols[index % columnCount].push({ item, index });
    });
    return cols;
  }, [displayedPrompts, columnCount]);

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
    <SidebarProvider className="bg-white dark:bg-zinc-950">
      <AppSidebar 
        currentUser={currentUser}
        userCredits={userCredits}
        userRole={userRole}
        activeCategory={activeCategory}
        searchQuery={searchQuery}
        favoritePromptIds={favoritePromptIds}
        purchasedPromptIds={purchasedPromptIds}
        onSearchChange={setSearchQuery}
        onOpenAuth={onOpenAuth}
        onOpenUpgrade={onOpenUpgrade}
        onSignOut={onSignOut}
        onSelectCategory={setActiveCategory}
      />
      <SidebarInset className="bg-white dark:bg-zinc-950 transition-all">
        <div className="relative min-h-screen w-full bg-white dark:bg-zinc-950 flex flex-col">
          {/* Fixed Glassmorphism Navbar Header - Pinned at top of viewport */}
          <header className="fixed top-0 right-0 left-0 md:left-[var(--sidebar-width)] group-data-[state=collapsed]/sidebar-wrapper:md:left-[var(--sidebar-width-icon)] z-40 flex h-16 shrink-0 items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 md:px-8 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-black/5 dark:border-white/5 transform-gpu transition-all">
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
                  <BreadcrumbPage className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                    {getCategoryLabel(activeCategory)}
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
            <SpecularElectricButton 
              onClick={onOpenUpgrade} 
              credits={userCredits} 
            />

            {currentUser ? (
              <button 
                onClick={() => setShowSignOutConfirm(true)}
                aria-label="Keluar akun"
                className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-white dark:bg-zinc-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 text-zinc-700 dark:text-zinc-300 ring-1 ring-black/10 dark:ring-white/10 text-xs font-semibold transition-all duration-200 cursor-pointer shadow-2xs active:scale-95 shrink-0 border-0"
                title="Keluar Akun"
              >
                <Logout01Icon size={14} />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            ) : (
              <button 
                onClick={onOpenAuth}
                aria-label="Login with Google"
                className="inline-flex items-center gap-2 h-9 px-4 rounded-full bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 ring-1 ring-black/10 dark:ring-white/10 text-xs font-bold transition-all duration-200 cursor-pointer shadow-2xs active:scale-95 shrink-0 group border-0"
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

        {/* Main Content: Masonry Grid Layout with safe gap under fixed header */}
        <main className="w-full min-w-0 max-w-full overflow-x-hidden mx-auto pt-[76px] sm:pt-[88px] px-3 sm:px-6 md:px-8 pb-32">
          
          {/* Mobile Search Bar (Visible only on < 640px) */}
          <div className="sm:hidden mb-3.5">
            <SearchInputWithLoader
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              placeholder="Cari prompt..."
              className="w-full"
            />
          </div>

          {displayedPrompts.length > 0 ? (
            <>
              {/* 2-Column Mobile Masonry Grid matching Pinterest / Behance UI */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2.5 sm:gap-5 lg:gap-6 items-start">
                {columnBuckets.map((columnItems, colIdx) => (
                  <div key={`col_bucket_${colIdx}`} className="flex flex-col gap-3.5 sm:gap-5 lg:gap-6">
                    {columnItems.map(({ item, index }) => {
                      const isUnlocked = purchasedPromptIds.includes(item.id) || !item.isPremium;
                      const aspectClass = getPromptAspectRatioClass(item);
                      const customSlug = getCleanShortSlug(item);
                      const promptCost = item.cost ?? (item.prompt?.length >= 1533 ? 500 : 400);

                      return (
                        <div 
                          key={item._stableId}
                          onClick={() => onOpenDetail(item, customSlug)}
                          className="group cursor-pointer flex flex-col gap-1.5 sm:gap-2 [content-visibility:auto]"
                        >
                          <div className={`relative w-full ${aspectClass} rounded-2xl sm:rounded-[20px] overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-2xs group-hover:shadow-md transition-shadow duration-200 [contain:paint]`}>
                            <PortfolioImageItem src={item.image} alt={getShortTitle(item)} isPriority={index < 12} />

                            {/* Top Subtle Gradient Overlay (Visible on Hover) */}
                            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10" />

                            {/* Top Overlay Badge (Price / Status - Revealed on Hover) */}
                            <div className="absolute top-2.5 right-2.5 z-20 opacity-0 group-hover:opacity-100 transition-all duration-200 transform -translate-y-1 group-hover:translate-y-0">
                              {item.isPremium ? (
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shadow-xs ${
                                  isUnlocked 
                                    ? 'bg-emerald-600 text-white border border-emerald-400/50' 
                                    : 'bg-zinc-900/95 text-white border border-white/20'
                                }`}>
                                  {isUnlocked ? 'Terbuka' : `${promptCost} Kredit`}
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/95 text-zinc-900 border border-black/10 shadow-xs">
                                  Gratis
                                </span>
                              )}
                            </div>

                            {/* Hover Arrow Overlay */}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center z-10">
                              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full aspect-square bg-white text-obsidian flex items-center justify-center shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
                                <ArrowUpRight01Icon size={18} />
                              </div>
                            </div>
                          </div>

                          {/* Meta Card Info (Matching Reference Layout) */}
                          <div className="flex flex-col gap-0.5 px-0.5">
                            <div className="flex items-center justify-between gap-1 min-w-0">
                              <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-purple-600 transition-colors truncate leading-snug">
                                {getShortTitle(item)}
                              </h3>
                              <button
                                type="button"
                                aria-label="Menu opsi prompt"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenDetail(item, customSlug);
                                }}
                                className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white p-0.5 rounded-full transition-colors shrink-0 cursor-pointer"
                              >
                                <MoreHorizontal size={13} />
                              </button>
                            </div>
                            <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
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
                ))}
              </div>

              {/* Split-Bar Balanced Pagination (Left: Items Info | Right: Generous Spaced Controls) */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 mt-14 mb-8 pt-8 border-t border-black/5 dark:border-white/10 w-full font-sans px-2 sm:px-4 text-xs sm:text-sm">
                  {/* Left Info Text with Sturdy Gap */}
                  <div className="text-zinc-500 dark:text-zinc-400 font-medium text-xs sm:text-sm shrink-0">
                    Menampilkan <span className="font-bold text-obsidian dark:text-white">{(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredPrompts.length)}</span> dari <span className="font-bold text-obsidian dark:text-white">{filteredPrompts.length}</span> Prompt
                  </div>

                  {/* Right Controls: Spaced Chevrons & Generous Page Pills */}
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
                    {/* Previous Page Chevron Button (Clean transparent without background) */}
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className="w-9 h-9 sm:w-10 sm:h-10 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 rounded-xl disabled:opacity-20 disabled:pointer-events-none transition-all cursor-pointer flex items-center justify-center shrink-0"
                      aria-label="Previous Page"
                    >
                      <ArrowLeft01Icon size={18} />
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 3)
                        .map((page, idx, arr) => {
                          const prevPage = arr[idx - 1];
                          const showEllipsis = prevPage && page - prevPage > 1;
                          const isActive = currentPage === page;

                          return (
                            <React.Fragment key={page}>
                              {showEllipsis && (
                                <span className="px-1.5 text-xs text-zinc-400 font-semibold select-none">...</span>
                              )}
                              <button
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0 ${
                                  isActive
                                    ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-950 dark:text-white shadow-xs scale-105 border border-zinc-300 dark:border-zinc-600 font-bold'
                                    : 'bg-white dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-white/10 shadow-2xs'
                                }`}
                              >
                                {page}
                              </button>
                            </React.Fragment>
                          );
                        })}
                    </div>

                    {/* Next Page Chevron Button (Clean transparent without background) */}
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className="w-9 h-9 sm:w-10 sm:h-10 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 rounded-xl disabled:opacity-20 disabled:pointer-events-none transition-all cursor-pointer flex items-center justify-center shrink-0"
                      aria-label="Next Page"
                    >
                      <ArrowRight01Icon size={18} />
                    </button>
                  </div>
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
                  isActive: activeCategory === 'image' || activeCategory === 'all',
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
        </div>
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
              className="h-10 px-5 rounded-full text-xs font-bold"
            >
              Batal
            </AlertDialogCancel>
            
            <AlertDialogAction
              onClick={() => {
                setShowSignOutConfirm(false);
                onSignOut();
              }}
              className="h-10 px-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all active:scale-95 border-0 shadow-xs"
            >
              Keluar Akun
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}