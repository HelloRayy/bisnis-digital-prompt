import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Coins, Sparkle, Share2, Unlock, Lock, Bookmark, Search, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { Dock } from '@/components/ui/dock-two';
import { AnimatedNumber } from '@/components/ui/animated-counter';
import SpecularElectricButton from '@/components/ui/SpecularElectricButton';
import { SubscriptionCards } from './SubscriptionView';
import PromptParameterCustomizer from './prompt-detail/PromptParameterCustomizer';
import PromptImageGallery from './prompt-detail/PromptImageGallery';
import { getOptimizedImageUrl } from '@/utils/image-optimizer';
import { getPromptAspectRatioClass } from '@/utils/prompt-helpers';
import { 
  Cancel01Icon, 
  Copy01Icon, 
  Tick01Icon,
  CheckmarkCircle02Icon,
  Coins01Icon, 
  FavouriteIcon, 
  AlertCircleIcon, 
  Share01Icon,
  SparklesIcon,
  ArrowDown01Icon,
  Image01Icon,
  InformationCircleIcon,
  ArrowUpRight01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon
} from 'hugeicons-react';

/* High-craft SVG Animated Draw Checkmark (Stroke-by-Stroke Path Drawing Motion) */
const AnimatedCheckmarkSVG = ({ size = 18, strokeWidth = 2.5, className = "text-white" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={strokeWidth} 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <motion.path
      d="M4.5 12.75L9.5 17.5L19.5 6.5"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{
        duration: 0.38,
        ease: [0.16, 1, 0.3, 1], // Snappy Apple-style spring ease
      }}
    />
  </svg>
);

/* High-craft SVG Dynamic Padlock with Symmetrical Resting State & Clean Horizontal Flip */
const AnimatedLockIcon = ({ size = 15, className = "text-white" }) => (
  <span className="relative w-4 h-4 flex items-center justify-center shrink-0 overflow-visible">
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ overflow: 'visible' }}
    >
      {/* 1. Perfectly Centered, Symmetrical Padlock Body */}
      <rect x="4.5" y="10.5" width="15" height="11.5" rx="2.5" />
      <circle cx="12" cy="16" r="1.1" fill="currentColor" stroke="none" />

      {/* 2. Symmetrical Shackle in Resting State -> Flips Horizontally to Left on Hover */}
      <g
        style={{ transformOrigin: '7.5px 10.5px' }}
        className="transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-scale-x-100"
      >
        <path d="M7.5 10.5V5.5a4.5 4.5 0 0 1 9 0v5" />
      </g>
    </svg>
  </span>
);


import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PrimaryButton, PrimaryCTAButton, SecondaryButton } from "@/components/ui/button";
import { SidebarProvider, SidebarInset, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

/* Dynamic Floating Secondary CTA Close Button (Fixed on scroll, natural at top) */
function DetailCloseCTA({ onClose, isScrolled }) {
  let sidebarLeft = "left-4 sm:left-6 md:left-8 lg:left-72";
  try {
    const { state, isMobile } = useSidebar();
    if (!isMobile) {
      sidebarLeft = state === "collapsed" ? "left-16 sm:left-20" : "left-72";
    }
  } catch (e) {
    // fallback
  }

  return (
    <div className="mb-6 sm:mb-8 flex items-center justify-start min-h-[36px]">
      <button 
        type="button"
        onClick={onClose}
        className={`transition-all duration-200 cursor-pointer active:scale-95 ${
          isScrolled 
            ? `fixed top-3.5 ${sidebarLeft} z-50 group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl text-zinc-950 dark:text-white ring-1 ring-black/15 dark:ring-white/20 shadow-md text-xs font-semibold hover:bg-white dark:hover:bg-zinc-800 hover:ring-black/25` 
            : 'group inline-flex items-center gap-2.5 p-0 bg-transparent text-obsidian dark:text-zinc-200 text-xs font-semibold hover:text-purple-600'
        }`}
        title="Tutup Preview & Kembali"
      >
        <div className={`transition-all duration-200 flex items-center justify-center ${
          isScrolled 
            ? 'w-5.5 h-5.5 rounded-full bg-zinc-100 dark:bg-zinc-800 group-hover:bg-purple-100 dark:group-hover:bg-purple-950/60 text-zinc-700 dark:text-zinc-300 group-hover:text-purple-600 shadow-2xs' 
            : 'w-8 h-8 rounded-full bg-[#f2f2f2] dark:bg-zinc-800 group-hover:bg-purple-100 dark:group-purple-950/50 border border-black/5 dark:border-white/10 text-obsidian dark:text-zinc-200 group-hover:text-purple-600 shadow-2xs'
        }`}>
          <Cancel01Icon size={isScrolled ? 13 : 16} className="group-hover:rotate-90 transition-transform duration-200 shrink-0" />
        </div>
        <span>Tutup</span>
      </button>
    </div>
  );
}

export default function PromptDetailView({
  prompt,
  onClose,
  userCredits = 0,
  userRole = "Starter Plan",
  currentUser = null,
  favoritePromptIds = [],
  purchasedPromptIds = [],
  onOpenAuth = () => {},
  onSignOut = () => {},
  isUnlocked = false,
  isFavorite = false,
  onToggleFavorite = () => {},
  onDeductCredits = () => {},
  onOpenUpgrade = () => {},
  onSelectCategory = () => {}
}) {
  if (!prompt) return null;

  const {
    prompt: rawPrompt,
    author,
    author_name,
    image,
    images = [],
    categories = [],
    model = 'Midjourney v6',
    source_url,
    isPremium = false,
    cost,
    likes = 0,
    views = 0
  } = prompt;

  const promptCost = cost ?? (prompt?.prompt?.length >= 1533 ? 500 : 400);
  const allImages = images && images.length > 0 ? images : [image];
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const activeImage = allImages[selectedImgIndex] || image;
  const [isHeroLoaded, setIsHeroLoaded] = useState(false);
  const aspectClass = getPromptAspectRatioClass(prompt);

  // Reset loading state if active image changes
  React.useEffect(() => {
    setIsHeroLoaded(false);
  }, [activeImage, prompt?.id]);

  // Selalu mulai dari Tampilan Cover (Stage 1) terlebih dahulu saat membuka detail
  const [showProjectInfo, setShowProjectInfo] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll for sticky secondary close CTA backdrop styling
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || window.pageYOffset || 0;
      setIsScrolled(scrollY > 15);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Variable customizer
  const extractVariables = (text) => {
    if (!text || typeof text !== 'string') return {};
    const matches = text.match(/\{([^}]+)\}|\[([^\]]+)\]/g) || [];
    const vars = {};
    matches.forEach(m => {
      const cleanKey = m.replace(/[{}[\]]/g, '');
      vars[cleanKey] = cleanKey;
    });
    return vars;
  };

  const [variables, setVariables] = useState(() => extractVariables(rawPrompt));
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedImg, setCopiedImg] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showInsufficientModal, setShowInsufficientModal] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);

  React.useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setSelectedImgIndex(prev => (prev > 0 ? prev - 1 : allImages.length - 1));
      } else if (e.key === 'ArrowRight') {
        setSelectedImgIndex(prev => (prev < allImages.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, allImages.length]);

  const containerRef = useRef(null);

  const compilePrompt = () => {
    if (!rawPrompt || typeof rawPrompt !== 'string') return '';
    let result = rawPrompt;
    Object.keys(variables).forEach(key => {
      const val = variables[key];
      result = result.replace(new RegExp(`\\{${key}\\}|\\[${key}\\]`, 'g'), val);
    });
    return result;
  };

  const compiledPrompt = compilePrompt();
  const variableKeys = Object.keys(variables);

  const handleVariableChange = (key, value) => {
    setVariables(prev => ({ ...prev, [key]: value }));
  };

  const fallbackCopyText = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    let successful = false;
    try {
      successful = document.execCommand('copy');
    } catch (err) {}
    document.body.removeChild(textArea);
    return successful;
  };

  const copyPromptToClipboard = async () => {
    const textToCopy = compiledPrompt || rawPrompt || '';
    let success = false;
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function' && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        success = true;
      } catch (err) {
        success = fallbackCopyText(textToCopy);
      }
    } else {
      success = fallbackCopyText(textToCopy);
    }

    if (success) {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
      toast.success('Teks prompt berhasil disalin ke clipboard!');
    } else {
      setErrorMsg('Gagal menyalin teks. Silakan salin secara manual.');
      toast.error('Gagal menyalin teks.');
    }
  };

  const copyImageUrlToClipboard = async () => {
    const imgUrl = activeImage || image;
    if (!imgUrl) return;
    try {
      await navigator.clipboard.writeText(imgUrl);
      setCopiedImg(true);
      setTimeout(() => setCopiedImg(false), 2500);
      toast.success('Link gambar referensi berhasil disalin!');
    } catch (e) {
      toast.error('Gagal menyalin link gambar.');
    }
  };

  const handleCopyText = async () => {
    setErrorMsg('');
    if (!currentUser) {
      toast.info('Silakan masuk dengan Google untuk membuka prompt ini.');
      onOpenAuth();
      return;
    }

    if (isPremium && !isUnlocked && userCredits < promptCost) {
      setShowInsufficientModal(true);
      return;
    }

    if (isPremium && !isUnlocked) {
      setShowConfirmModal(true);
      return;
    }

    await copyPromptToClipboard();
  };

  const executeUnlock = async () => {
    setErrorMsg('');
    if (!currentUser) {
      toast.info('Silakan masuk dengan Google untuk membuka prompt ini.');
      onOpenAuth();
      return;
    }

    if (userCredits < promptCost) {
      setShowInsufficientModal(true);
      return;
    }

    const unlockTask = new Promise(async (resolve, reject) => {
      try {
        if (isPremium && !isUnlocked) {
          const result = await onDeductCredits(promptCost, prompt.id, prompt.prompt.slice(0, 30));
          if (!result?.success) {
            if (result?.reason === 'AUTH_REQUIRED') {
              onOpenAuth();
              return reject(new Error('Silakan login terlebih dahulu'));
            }
            setShowInsufficientModal(true);
            const reason = result?.reason || 'Kredit Anda tidak mencukupi.';
            setErrorMsg(reason);
            return reject(new Error(reason));
          }
        }

        setShowProjectInfo(true);
        resolve('Prompt berhasil dibeli & dibuka!');
      } catch (err) {
        reject(err);
      }
    });

    toast.promise(unlockTask, {
      loading: 'Memproses pembelian prompt...',
      success: (msg) => msg || 'Prompt berhasil dibeli & dibuka!',
      error: (err) => err?.message || 'Gagal memproses pembelian prompt.'
    });
  };

  const handleShareLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Clean title & tags snippet matching Figma format
  const title = prompt.title || rawPrompt.split('\n')[0].replace(/[{}[\]]/g, '').slice(0, 45) || 'Not good at doing normal things';
  const categoryTagsStr = categories.map(c => `#${c.toLowerCase().replace(/[^a-z0-9]/g, '')}`).join(' ');
  const creatorHandle = author ? (author.startsWith('@') ? author : `@${author}`) : '@creator';

  // Hardware accelerated 60fps spring transition
  const smoothPhysics = { type: 'spring', stiffness: 180, damping: 24, mass: 0.8 };

  return (
    <SidebarProvider className="bg-white dark:bg-zinc-950">
      {/* 1. App Sidebar (Persistent Navigation) */}
      <AppSidebar 
        currentUser={currentUser}
        userCredits={userCredits}
        userRole={userRole}
        activeCategory={categories[0]?.toLowerCase() || "all"}
        searchQuery=""
        favoritePromptIds={favoritePromptIds}
        purchasedPromptIds={purchasedPromptIds}
        onSearchChange={() => onClose()}
        onOpenAuth={onOpenAuth}
        onOpenUpgrade={() => {
          if (onOpenUpgrade) onOpenUpgrade();
          else setShowSubscription(true);
        }}
        onSignOut={onSignOut}
        onSelectCategory={(cat) => {
          onClose();
        }}
      />

      {/* 2. Workspace Content Inset */}
      <SidebarInset className="bg-white dark:bg-zinc-950 transition-all">
        <div 
          ref={containerRef}
          className="relative min-h-screen w-full bg-white dark:bg-zinc-950 text-obsidian dark:text-white flex flex-col justify-between selection:bg-purple-100 selection:text-purple-900 font-sans"
        >
          {/* Top Sticky Header Bar */}
          <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 md:px-8 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-black/5 dark:border-white/5 transform-gpu transition-all">
            {/* Left: SidebarTrigger & Breadcrumbs */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
              <SidebarTrigger aria-label="Buka Menu Sidebar" className="-ml-1 text-obsidian dark:text-zinc-200 hover:bg-black/5 dark:hover:bg-zinc-800 rounded-lg p-1.5 transition-colors shrink-0" />
              <Separator orientation="vertical" className="h-5 bg-black/10 dark:bg-white/10 shrink-0" />
              <Breadcrumb className="min-w-0 truncate">
                <BreadcrumbList className="flex-nowrap min-w-0 text-xs sm:text-sm">
                  <BreadcrumbItem className="hidden sm:block shrink-0">
                    <BreadcrumbLink href="#" onClick={(e) => { e.preventDefault(); onClose(); }} className="font-bold text-obsidian dark:text-white hover:text-purple-600 transition-colors">
                      Prompt Hub
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden sm:block shrink-0 text-black/40" />
                  <BreadcrumbItem className="min-w-0 truncate">
                    <BreadcrumbPage className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                      {author || "Detail Prompt"}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Right: Credits, Share, and Close / Back */}
            <div className="flex items-center gap-2.5">
              <SpecularElectricButton 
                onClick={() => {
                  if (onOpenUpgrade) onOpenUpgrade();
                  else setShowSubscription(true);
                }} 
                credits={userCredits} 
              />

              <button
                onClick={handleShareLink}
                className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-all cursor-pointer border border-black/5 dark:border-white/10 shadow-2xs"
                title="Bagikan Tautan"
              >
                {copiedLink ? <CheckmarkCircle02Icon size={16} className="text-emerald-600" /> : <Share01Icon size={16} />}
              </button>

              <button 
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold border border-black/5 dark:border-white/10 transition-colors cursor-pointer"
                title="Tutup & Kembali"
              >
                <Cancel01Icon size={14} />
                <span className="hidden sm:inline">Tutup</span>
              </button>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="max-w-6xl mx-auto w-full px-3.5 sm:px-6 md:px-10 pt-3 sm:pt-6 pb-36 flex-1 flex flex-col relative">
            
            {/* ============================================================
                MOBILE VIEW (< 1024px / lg:hidden) - MATCHING USER SCREENSHOT
                ============================================================ */}
            <div className="lg:hidden flex flex-col gap-3.5 pb-20">
              
              {/* 1. Hero Image Card with Top-Left Back Button & Bottom-Right Zoom Button */}
              <div className="relative w-full rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-md">
                
                {/* Top-Left Floating Back Button */}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Kembali"
                  className="absolute top-3.5 left-3.5 z-20 w-9 h-9 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-md flex items-center justify-center text-zinc-900 dark:text-white active:scale-90 transition-transform cursor-pointer"
                >
                  <ArrowLeft01Icon size={18} />
                </button>

                {/* Aspect-Locked Hero Image */}
                <div className={`relative w-full ${aspectClass} [contain:paint]`}>
                  {!isHeroLoaded && (
                    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-900 animate-pulse z-0">
                      <div className="w-10 h-10 rounded-full bg-zinc-200/80 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-2">
                        <Image01Icon size={20} className="opacity-60" />
                      </div>
                      <span className="text-[11px] font-medium text-zinc-400">Memuat...</span>
                    </div>
                  )}
                  <img
                    src={getOptimizedImageUrl(activeImage, 1080, 80)}
                    alt={title}
                    decoding="async"
                    onLoad={() => setIsHeroLoaded(true)}
                    onClick={() => setIsLightboxOpen(true)}
                    className={`absolute inset-0 w-full h-full object-cover cursor-pointer transition-opacity duration-300 ${
                      isHeroLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </div>

                {/* Bottom-Right Floating Zoom/Lightbox Button */}
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  aria-label="Perbesar gambar"
                  className="absolute bottom-3.5 right-3.5 z-20 w-9 h-9 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-md flex items-center justify-center text-zinc-900 dark:text-white active:scale-90 transition-transform cursor-pointer"
                >
                  <Search size={16} className="stroke-[2.2]" />
                </button>
              </div>

              {/* 2. Engagement & Action Bar (Directly below Image - Matches Reference) */}
              <div className="flex items-center justify-between gap-2 px-1 pt-0.5">
                {/* Left Action Icons */}
                <div className="flex items-center gap-2.5 text-zinc-700 dark:text-zinc-300">
                  {/* Like Button */}
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(prompt.id)}
                    className="flex items-center gap-1 text-xs font-bold active:scale-90 transition-transform cursor-pointer px-1 py-1"
                  >
                    <FavouriteIcon size={20} className={isFavorite ? 'fill-red-600 text-red-600' : ''} />
                    <span>{likes + (isFavorite ? 1 : 0)}</span>
                  </button>

                  {/* Comment / Info Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowProjectInfo(!showProjectInfo)}
                    className="p-1 rounded-full active:scale-90 transition-transform text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 cursor-pointer"
                    title="Detail Prompt"
                  >
                    <InformationCircleIcon size={20} />
                  </button>

                  {/* Share Link */}
                  <button
                    type="button"
                    onClick={handleShareLink}
                    className="p-1 rounded-full active:scale-90 transition-transform text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 cursor-pointer"
                    title="Bagikan Tautan"
                  >
                    <Share01Icon size={20} />
                  </button>

                  {/* More Options / Lightbox */}
                  <button
                    type="button"
                    onClick={() => setIsLightboxOpen(true)}
                    className="p-1 rounded-full active:scale-90 transition-transform text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 cursor-pointer"
                    title="Opsi Lainnya"
                  >
                    <MoreHorizontal size={20} />
                  </button>
                </div>

                {/* Right: Primary Action Button (Red / Rose-600 Pill - Matches Reference "Save" style) */}
                <button
                  type="button"
                  onClick={handleCopyText}
                  className={`px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm text-white shadow-md active:scale-95 transition-all cursor-pointer ${
                    copiedText
                      ? 'bg-emerald-600 shadow-emerald-600/30'
                      : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/25'
                  }`}
                >
                  {copiedText
                    ? 'Disalin!'
                    : (isUnlocked || !isPremium)
                      ? 'Salin Prompt'
                      : `Buka (${promptCost} Kredit)`}
                </button>
              </div>

              {/* 3. Author Row */}
              <div className="flex items-center gap-2 px-1 pt-1">
                <div className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[10px] font-bold">
                  {(author || 'W')[0].toUpperCase()}
                </div>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                  @{author || 'Daniel Triendl'}
                </span>
                <span className="text-[11px] text-zinc-400 font-medium ml-auto">
                  {model}
                </span>
              </div>

              {/* 4. Title */}
              <div className="px-1">
                <h1 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white leading-snug tracking-tight">
                  {title}
                </h1>
              </div>

              {/* 5. Prompt Text & Parameter Customizer */}
              <div className="px-1 flex flex-col gap-3">
                {/* Prompt Quote Display */}
                <div className={`p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/10 ${
                  !isUnlocked && isPremium ? 'blur-xs select-none opacity-50' : ''
                }`}>
                  <p className="text-xs text-zinc-800 dark:text-zinc-200 font-serif leading-relaxed italic">
                    "{compiledPrompt}"
                  </p>
                </div>

                {/* Parameter Customizer (if available and unlocked) */}
                {variableKeys.length > 0 && (isUnlocked || !isPremium) && (
                  <PromptParameterCustomizer 
                    variables={variables} 
                    variableKeys={variableKeys} 
                    onChange={handleVariableChange} 
                  />
                )}

                {/* Copy Image Link Button */}
                <button
                  type="button"
                  onClick={copyImageUrlToClipboard}
                  className="w-full py-3 rounded-full bg-zinc-200/80 dark:bg-zinc-800/80 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-bold text-xs transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Image01Icon size={14} />
                  <span>{copiedImg ? 'Link Gambar Disalin!' : 'Salin Link Gambar Referensi'}</span>
                </button>
              </div>

            </div>

            {/* ============================================================
                DESKTOP VIEW (≥ 1024px / hidden lg:block) - FULL EDITORIAL SHOWCASE
                ============================================================ */}
            <div className="hidden lg:block">
              {/* Dynamic Floating Close CTA Button (Fixed on scroll, clean in-place at top) */}
              <DetailCloseCTA onClose={onClose} isScrolled={isScrolled} />
              <AnimatePresence mode="wait">
                {!showProjectInfo ? (
                  /* STAGE 1: Visual Cover View */
                  <motion.div 
                    key="stage-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto"
                  >
              {/* Left Image Showcase with Aspect Ratio Locked Skeleton */}
              <div className="lg:col-span-6 flex flex-col gap-4 sticky lg:top-24 items-center justify-center">
                <div className={`relative w-full max-w-[500px] ${aspectClass} max-h-[70vh] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-md flex items-center justify-center [contain:paint]`}>
                  {/* High-Craft Shimmer Skeleton (Preserves exact dimensions before image loads) */}
                  {!isHeroLoaded && (
                    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-900 animate-pulse z-0">
                      <div className="w-12 h-12 rounded-full bg-zinc-200/80 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-2">
                        <Image01Icon size={24} className="opacity-60" />
                      </div>
                      <span className="text-[11px] font-medium text-zinc-400/80 tracking-wide">Memuat Preview...</span>
                    </div>
                  )}

                  <img 
                    src={getOptimizedImageUrl(activeImage, 1200, 80)} 
                    alt={title} 
                    decoding="async"
                    onLoad={() => setIsHeroLoaded(true)}
                    onClick={() => setIsLightboxOpen(true)}
                    className={`absolute inset-0 w-full h-full object-cover rounded-2xl cursor-pointer hover:scale-[1.01] transition-all duration-300 z-10 ${
                      isHeroLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.99]'
                    }`}
                    title="Klik untuk memperbesar gambar"
                  />
                </div>
              </div>

                {/* Right Details & CTA OR Subscription Panel */}
                {showSubscription ? (
                  <div className="lg:col-span-6 flex flex-col gap-5 max-h-[75vh] overflow-y-auto pr-1.5 scrollbar-thin animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between border-b border-black/5 pb-3">
                      <div>
                        <h2 className="text-lg font-bold text-obsidian tracking-tight">Paket Berlangganan</h2>
                        <p className="text-xs text-ash-gray">Isi ulang kredit instan untuk membuka seluruh prompt premium.</p>
                      </div>
                      <button 
                        onClick={() => setShowSubscription(false)} 
                        className="text-xs font-semibold text-zinc-500 hover:text-black bg-zinc-100 hover:bg-zinc-200 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                      >
                        Tutup
                      </button>
                    </div>

                    <SubscriptionCards 
                      userCredits={userCredits} 
                      onTopUp={(credits) => {
                        onDeductCredits(credits);
                      }} 
                      isPanel={true} 
                    />
                  </div>
                ) : (
                  <div className="lg:col-span-6 flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                      <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-obsidian tracking-tight leading-tight">
                        {title}
                      </h1>
                      <p className="font-sans text-ash-gray font-normal text-lg flex items-center flex-wrap gap-x-2">
                        <span>{categoryTagsStr}</span>
                        <span className="text-obsidian font-semibold">{creatorHandle}</span>
                      </p>
                    </div>

                    {/* Metadata Pills */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-ash-gray font-sans">
                      <span className="bg-[#f2f2f2] dark:bg-zinc-800 text-obsidian dark:text-zinc-200 px-3 py-1 rounded-full font-semibold">
                        Model: {model}
                      </span>
                      <span className="bg-[#f2f2f2] dark:bg-zinc-800 text-obsidian dark:text-zinc-200 px-3 py-1 rounded-full font-semibold">
                        Author: @{author || 'Daniel Triendl'}
                      </span>
                      <span className="bg-[#f2f2f2] dark:bg-zinc-800 text-obsidian dark:text-zinc-200 px-3 py-1 rounded-full font-semibold">
                        {rawPrompt.length.toLocaleString('id-ID')} Karakter Prompt
                      </span>
                      {isPremium && (
                        <span className={`px-3 py-1 rounded-full font-bold ${
                          isUnlocked ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                        }`}>
                          {isUnlocked ? 'Unlocked' : `Premium (${promptCost} Kredit)`}
                        </span>
                      )}
                    </div>

                    {/* CTA Buy / Unlock Button & Actions */}
                    <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-black/5 mt-2">
                      <button 
                        onClick={() => setShowProjectInfo(true)}
                        className="flex items-center gap-2.5 text-sm font-semibold text-obsidian hover:text-purple-600 transition-colors duration-200 group cursor-pointer"
                      >
                        <span>{isPremium && !isUnlocked ? `Buka Prompt & Customize (${promptCost} Kredit)` : 'Lihat Prompt & Customize'}</span>
                        <span className="relative w-7 h-7 rounded-full bg-[#f2f2f2] group-hover:bg-purple-100 text-black group-hover:text-purple-600 flex items-center justify-center transition-colors duration-200 overflow-hidden shrink-0">
                          <ArrowDown01Icon size={14} className="transition-transform duration-250 ease-out group-hover:translate-y-6" />
                          <ArrowDown01Icon size={14} className="absolute transition-transform duration-250 ease-out -translate-y-6 group-hover:translate-y-0 text-purple-600" />
                        </span>
                      </button>

                      <div className="flex items-center gap-2">
                        {/* Share Button */}
                        <button
                          type="button"
                          onClick={handleShareLink}
                          className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 ring-1 ring-black/10 dark:ring-white/10 shadow-2xs transition-all duration-200 cursor-pointer active:scale-95 border-0"
                          title="Bagikan Tautan Prompt"
                        >
                          {copiedLink ? <Check size={14} className="text-emerald-600 stroke-[2.5]" /> : <Share2 size={14} className="stroke-[2]" />}
                          <span>{copiedLink ? 'Link Disalin!' : 'Bagikan'}</span>
                        </button>

                        {/* Favorite Button */}
                        <button
                          type="button"
                          onClick={() => onToggleFavorite(prompt.id)}
                          className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full ring-1 transition-all duration-200 cursor-pointer active:scale-95 shadow-2xs border-0 ${
                            isFavorite 
                              ? 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 ring-red-200 dark:ring-red-800' 
                              : 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 ring-black/10 dark:ring-white/10 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                          }`}
                        >
                          <FavouriteIcon size={14} className={isFavorite ? 'fill-red-600' : ''} />
                          <span>{likes + (isFavorite ? 1 : 0)}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              /* STAGE 2: Unlocked / Purchased Editorial View (Pure High-Craft Editorial Layout) */
              <motion.div 
                key="stage-editorial"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-10 max-w-4xl"
              >
                {/* 1. Small Top Thumbnails (Clickable to select and open Fullscreen Lightbox Overlay) */}
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {allImages.map((imgUrl, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => {
                        setSelectedImgIndex(idx);
                        setIsLightboxOpen(true);
                      }}
                      className={`max-h-36 max-w-[240px] shrink-0 overflow-hidden cursor-pointer group/thumb rounded-xl border-2 transition-all ${
                        selectedImgIndex === idx 
                          ? 'border-purple-600 shadow-md ring-2 ring-purple-500/20' 
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                      title={`Klik untuk memperbesar gambar ${idx + 1}`}
                    >
                      <img 
                        src={getOptimizedImageUrl(imgUrl, 240, 75)} 
                        alt={`Thumbnail ${idx}`} 
                        decoding="async"
                        className="h-auto max-h-36 w-auto object-contain rounded-lg group-hover/thumb:scale-105 transition-transform duration-300" 
                      />
                    </div>
                  ))}
                </div>

                {/* 2. Title & Hashtags */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="flex flex-col gap-2"
                >
                  <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-obsidian tracking-tight leading-tight">
                    {title} <span className="font-sans text-ash-gray font-normal text-lg sm:text-xl">{categoryTagsStr} <span className="text-obsidian font-semibold">{creatorHandle}</span></span>
                  </h1>

                  {/* Tag Pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-ash-gray font-sans">
                    <span className="bg-[#f2f2f2] dark:bg-zinc-800 text-obsidian dark:text-zinc-200 px-3 py-1 rounded-full font-semibold">
                      Client: {author || 'Monocle Magazine'}
                    </span>
                    <span className="bg-[#f2f2f2] dark:bg-zinc-800 text-obsidian dark:text-zinc-200 px-3 py-1 rounded-full font-semibold">
                      Model: {model}
                    </span>
                    <span className="bg-[#f2f2f2] dark:bg-zinc-800 text-obsidian dark:text-zinc-200 px-3 py-1 rounded-full font-semibold">
                      {rawPrompt.length.toLocaleString('id-ID')} Karakter Prompt
                    </span>
                    {isPremium && (
                      <span className={`px-3 py-1 rounded-full font-bold ${
                        isUnlocked ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                      }`}>
                        {isUnlocked ? 'Unlocked' : `Premium (${promptCost} Kredit)`}
                      </span>
                    )}
                  </div>
                </motion.div>

                {/* Tutorial Cara Menggunakan Prompt (Collapsible Dropdown - Interactive Workflow) */}
                {(isUnlocked || !isPremium) && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.11 }}
                    className="rounded-xl border border-purple-200/80 dark:border-purple-800/60 bg-purple-50/30 dark:bg-purple-950/20 text-obsidian dark:text-zinc-100 overflow-hidden transition-all shadow-2xs"
                  >
                    <button
                      type="button"
                      onClick={() => setIsTutorialOpen(!isTutorialOpen)}
                      className="w-full px-4 py-3 flex items-center justify-between font-semibold text-obsidian dark:text-white text-xs sm:text-sm hover:bg-purple-100/50 dark:hover:bg-purple-900/30 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <InformationCircleIcon size={16} className="text-purple-600 dark:text-purple-400 shrink-0" />
                        <span>Cara Menggunakan Prompt Ini</span>
                      </div>
                      <motion.span 
                        animate={{ rotate: isTutorialOpen ? 180 : 0 }} 
                        transition={{ duration: 0.2 }}
                        className="text-purple-600 dark:text-purple-400 shrink-0"
                      >
                        <ArrowDown01Icon size={16} />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isTutorialOpen && (
                        <motion.div
                          key="tutorial-content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col gap-2.5 px-4 pb-4 pt-2.5 border-t border-purple-200/60 dark:border-purple-800/40">
                            
                            {/* Step 1: Copy Prompt */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-purple-100/90 dark:border-purple-900/50 shadow-2xs">
                              <div className="flex items-start gap-2.5">
                                <span className="w-5.5 h-5.5 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                  1
                                </span>
                                <div>
                                  <h4 className="text-xs sm:text-sm font-bold text-obsidian dark:text-white leading-tight">Salin Teks Prompt</h4>
                                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 leading-normal">
                                    {variableKeys.length > 0 
                                      ? 'Kustomisasi variabel di bawah (jika ada), lalu salin teks prompt siap pakai.'
                                      : 'Salin teks prompt teroptimasi ke clipboard Anda.'}
                                  </p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={copyPromptToClipboard}
                                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-750 text-obsidian dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold shadow-2xs cursor-pointer active:scale-95 transition-all self-start sm:self-auto shrink-0"
                              >
                                {copiedText ? (
                                  <>
                                    <AnimatedCheckmarkSVG size={14} strokeWidth={2.5} className="text-emerald-600 shrink-0" />
                                    <span className="text-emerald-600 font-semibold">Disalin!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy01Icon size={14} className="shrink-0" />
                                    <span>Salin Prompt</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Step 2: Open Google Gemini */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-purple-100/90 dark:border-purple-900/50 shadow-2xs">
                              <div className="flex items-start gap-2.5">
                                <span className="w-5.5 h-5.5 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                  2
                                </span>
                                <div>
                                  <h4 className="text-xs sm:text-sm font-bold text-obsidian dark:text-white leading-tight">Buka Google Gemini</h4>
                                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 leading-normal">
                                    Kunjungi generator AI Google Gemini untuk men-generate gambar atau visual baru.
                                  </p>
                                </div>
                              </div>

                              <a
                                href="https://gemini.google.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-750 text-obsidian dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold shadow-2xs cursor-pointer active:scale-95 transition-all self-start sm:self-auto shrink-0 group"
                              >
                                <Sparkle className="size-3.5 text-blue-600 dark:text-blue-400 fill-blue-500 shrink-0" />
                                <span>Buka Gemini</span>
                                <ArrowUpRight01Icon size={13} className="text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                              </a>
                            </div>

                            {/* Step 3: Paste & Generate */}
                            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-purple-100/90 dark:border-purple-900/50 shadow-2xs">
                              <span className="w-5.5 h-5.5 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                3
                              </span>
                              <div>
                                <h4 className="text-xs sm:text-sm font-bold text-obsidian dark:text-white leading-tight">Tempel (*Paste*) & Generate</h4>
                                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 leading-normal">
                                  Tempel (<kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-[11px] font-semibold border border-zinc-200 dark:border-zinc-700 text-obsidian dark:text-white">Ctrl+V</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-[11px] font-semibold border border-zinc-200 dark:border-zinc-700 text-obsidian dark:text-white">Cmd+V</kbd>) teks prompt pada kolom chat Gemini lalu tekan Enter.
                                </p>
                              </div>
                            </div>

                            {/* PRO TIP: Image Reference Tip */}
                            <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                              <div className="flex items-start gap-2.5">
                                <span className="text-base leading-none shrink-0 mt-0.5">💡</span>
                                <div>
                                  <h4 className="text-xs font-bold text-amber-950 dark:text-amber-200">
                                    Tips Hasil Maksimal:
                                  </h4>
                                  <p className="text-xs text-amber-800/90 dark:text-amber-400/90 mt-0.5 leading-normal">
                                    Salin atau unggah <strong>gambar referensi</strong> prompt ini ke Gemini bersama teks prompt agar hasil AI lebih akurat sesuai style & komposisi yang diinginkan.
                                  </p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={copyImageUrlToClipboard}
                                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 text-xs font-bold transition-all shrink-0 cursor-pointer active:scale-95 shadow-2xs self-start sm:self-auto"
                              >
                                <Image01Icon size={13} className="shrink-0" />
                                <span>{copiedImg ? 'Link Disalin!' : 'Salin Link Gambar'}</span>
                              </button>
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* 3. Parameter Customizer Box (SHADCN BASE UI CARD DESIGN) */}
                {variableKeys.length > 0 && (isUnlocked || !isPremium) && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.12 }}
                    className="rounded-xl border border-black/10 bg-white text-obsidian shadow-2xs p-5 flex flex-col gap-4"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <SparklesIcon size={16} className="text-purple-600 shrink-0" />
                        <h3 className="text-sm font-semibold leading-none tracking-tight text-obsidian">Kustomisasi Parameter Prompt</h3>
                      </div>
                      <p className="text-xs text-ash-gray pl-6">
                        Ubah nilai variabel di bawah untuk menyesuaikan hasil teks prompt secara otomatis.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                      {variableKeys.map((vKey) => (
                        <div key={vKey} className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium text-obsidian flex items-center justify-between">
                            <span className="capitalize">{vKey}</span>
                            <span className="text-[11px] text-purple-600 font-mono">{`{${vKey}}`}</span>
                          </label>
                          <input 
                            type="text" 
                            value={variables[vKey]}
                            onChange={(e) => handleVariableChange(vKey, e.target.value)}
                            className="h-9 w-full rounded-md border border-black/15 bg-white px-3 py-1 text-sm shadow-2xs transition-colors focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600 font-normal text-obsidian"
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* 4. Pure High-Craft Editorial Typography Display */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="flex flex-col gap-6"
                >
                  <div className="relative">
                    {/* Quick Copy Button in Top-Right Corner */}
                    {(isUnlocked || !isPremium) && (
                      <button
                        type="button"
                        onClick={handleCopyText}
                        className={`absolute top-0 right-0 z-10 p-3 rounded-full border transition-colors duration-200 cursor-pointer shadow-sm flex items-center justify-center ${
                          copiedText 
                            ? 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/30' 
                            : 'bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md border-black/10 dark:border-white/10 text-zinc-900 dark:text-white hover:bg-zinc-950 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-zinc-950'
                        }`}
                        title="Salin Cepat Teks Prompt"
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          {copiedText ? (
                            <div key="check">
                              <AnimatedCheckmarkSVG size={18} strokeWidth={2.5} className="text-white" />
                            </div>
                          ) : (
                            <div key="copy">
                              <Copy01Icon size={18} />
                            </div>
                          )}
                        </AnimatePresence>
                      </button>
                    )}

                    <div className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-obsidian leading-[1.3] tracking-tight transition-all duration-500 ${!isUnlocked && isPremium ? 'blur-xs select-none opacity-40 min-h-[200px] sm:min-h-[220px] max-h-64 overflow-hidden py-4' : 'pr-16 py-3 sm:py-4'}`}>
                      "{compiledPrompt}"
                    </div>

                    {/* Lock Overlay for Premium Items */}
                    {!isUnlocked && isPremium && (
                      <div className="absolute inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center gap-4 rounded-2xl border border-zinc-200 pointer-events-none my-auto">
                        <div className="flex flex-col items-center">
                          <h3 className="text-lg sm:text-xl font-bold text-obsidian tracking-tight">Prompt Premium Terkunci</h3>
                          <p className="text-xs sm:text-sm text-ash-gray mt-1.5 leading-relaxed max-w-md">Gunakan {promptCost} kredit untuk membuka dan menyalin teks prompt ini.</p>
                        </div>
                        <PrimaryCTAButton
                          label={`Buka Prompt (${Number(promptCost).toLocaleString('id-ID')} Kredit)`}
                          hoverLabel="Buka & Salin Sekarang"
                          onClick={handleCopyText}
                        />
                      </div>
                    )}
                  </div>

                  {/* Primary CTA Action Toolbar */}
                  {(isUnlocked || !isPremium) && (
                    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-black/5">
                      <button
                        onClick={handleCopyText}
                        className={`h-12 px-8 rounded-full font-bold text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-95 duration-200 ${
                          copiedText
                            ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                            : 'bg-gradient-to-b from-zinc-800 to-zinc-950 text-white border border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_1.5px_3px_0_rgba(0,0,0,0.25)] hover:from-zinc-700 hover:via-zinc-800 hover:to-zinc-950 hover:border-white/25 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35),0_3px_8px_0_rgba(0,0,0,0.3)]'
                        }`}
                      >
                        {copiedText ? <AnimatedCheckmarkSVG size={18} strokeWidth={2.5} className="text-white" /> : <Copy01Icon size={18} />}
                        <span>{copiedText ? 'Teks Prompt Berhasil Disalin!' : 'Salin Teks Prompt'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleShareLink}
                        className="h-12 px-6 rounded-full bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 ring-1 ring-black/10 dark:ring-white/10 shadow-2xs font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-95 border-0"
                        title="Bagikan Tautan Prompt"
                      >
                        {copiedLink ? <Check size={16} className="text-emerald-600 stroke-[2.5]" /> : <Share2 size={16} className="stroke-[2]" />}
                        <span>{copiedLink ? 'Link Disalin!' : 'Bagikan'}</span>
                      </button>

                      {errorMsg && (
                        <span className="text-xs text-red-500 flex items-center gap-1 font-medium">
                          <AlertCircleIcon size={14} /> {errorMsg}
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

        {/* Lightweight Floating Navigation Dock Component for Desktop */}
        <Dock 
          className="hidden md:block"
          items={[
            {
              icon: Image01Icon,
              label: 'Cover',
              isActive: !showProjectInfo,
              onClick: () => setShowProjectInfo(false)
            },
            {
              icon: InformationCircleIcon,
              label: 'Prompt Info',
              isActive: showProjectInfo,
              onClick: () => setShowProjectInfo(true)
            },
            { isSeparator: true },
            {
              icon: FavouriteIcon,
              label: isFavorite ? 'Disukai' : 'Suka',
              isActive: isFavorite,
              onClick: () => onToggleFavorite(prompt.id),
              className: isFavorite ? 'text-red-500 fill-red-500' : ''
            },
            {
              icon: Bookmark,
              label: isBookmarked ? 'Tersimpan' : 'Bookmark',
              isActive: isBookmarked,
              onClick: () => setIsBookmarked(!isBookmarked),
              className: isBookmarked ? 'text-amber-500 fill-amber-500' : ''
            }
          ]} 
        />

        {/* Confirmation Modal (Compact Standard Layout with KUMO UI Colorstyle) */}
        <AlertDialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
          <AlertDialogContent className="rounded-2xl p-5 sm:p-6 !max-w-[420px] w-[calc(100vw-32px)] bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xl flex flex-col gap-3.5">
            <AlertDialogHeader className="flex flex-col text-left items-start gap-1.5 w-full p-0">
              <AlertDialogTitle className="font-bold text-base text-zinc-900 dark:text-zinc-100 tracking-tight">
                Buka Prompt Ini?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed text-left">
                Gunakan <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">{Number(promptCost).toLocaleString('id-ID')} Kredit</strong> untuk membuka prompt ini (Sisa saldo: <strong className="text-purple-600 dark:text-purple-400 font-semibold">{Number(userCredits).toLocaleString('id-ID')} Kredit</strong>).
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="flex flex-row items-center justify-end gap-2.5 w-full pt-3.5 border-t border-black/5 dark:border-white/5 mt-1">
              <AlertDialogCancel 
                onClick={() => setShowConfirmModal(false)}
                className="h-9 px-4 rounded-xl font-semibold text-xs"
              >
                Batal
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  setShowConfirmModal(false);
                  await executeUnlock();
                }}
                className="group h-9 px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <AnimatedLockIcon size={14} className="text-white" />
                <span>Setuju & Buka</span>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Insufficient Credits Alert Dialog */}
        <AlertDialog open={showInsufficientModal} onOpenChange={setShowInsufficientModal}>
          <AlertDialogContent className="rounded-2xl p-5 sm:p-6 !max-w-[420px] w-[calc(100vw-32px)] bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xl flex flex-col gap-3.5">
            <AlertDialogHeader className="flex flex-col text-left items-start gap-1.5 w-full p-0">
              <AlertDialogTitle className="font-bold text-base text-zinc-900 dark:text-zinc-100 tracking-tight">
                Kredit Anda Tidak Mencukupi
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed text-left">
                Membutuhkan <strong className="text-zinc-900 dark:text-zinc-100 font-semibold">{Number(promptCost).toLocaleString('id-ID')} Kredit</strong>, saldo Anda saat ini <strong className="text-purple-600 dark:text-purple-400 font-semibold">{Number(userCredits).toLocaleString('id-ID')} Kredit</strong>.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="flex flex-row items-center justify-end gap-2.5 w-full pt-3.5 border-t border-black/5 dark:border-white/5 mt-1">
              <AlertDialogCancel 
                onClick={() => setShowInsufficientModal(false)}
                className="h-9 px-4 rounded-xl font-semibold text-xs"
              >
                Nanti Saja
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setShowInsufficientModal(false);
                  if (onOpenUpgrade) onOpenUpgrade();
                  else setShowSubscription(true);
                }}
                className="h-9 px-4 rounded-xl font-bold text-xs flex items-center gap-1.5"
              >
                <Coins size={13} className="stroke-[2.5]" />
                <span>Top Up Kredit</span>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Fullscreen Image Lightbox Modal with Blurred Backdrop */}
        <AnimatePresence>
          {isLightboxOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsLightboxOpen(false)}
              className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-between p-4 md:p-8 cursor-pointer select-none"
            >
              {/* Top Close Control */}
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-6 right-6 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer backdrop-blur-md border border-white/10"
                title="Tutup Preview (Esc)"
              >
                <Cancel01Icon size={20} />
              </button>

              {/* Prev Button (if multiple images) */}
              {allImages.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImgIndex(prev => (prev > 0 ? prev - 1 : allImages.length - 1));
                  }}
                  className="z-10 p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer backdrop-blur-md border border-white/10 hover:scale-110 active:scale-95"
                  title="Gambar Sebelumnya (←)"
                >
                  <ArrowLeft01Icon size={24} />
                </button>
              )}

              {/* Expanded Image & Counter */}
              <div className="flex flex-col items-center gap-4 max-w-full max-h-full mx-auto" onClick={(e) => e.stopPropagation()}>
                <img
                  key={selectedImgIndex}
                  src={getOptimizedImageUrl(activeImage, 1600, 85)}
                  alt={title}
                  decoding="async"
                  className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                />
                {allImages.length > 1 && (
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-white text-xs font-semibold">
                    <span>{selectedImgIndex + 1} / {allImages.length}</span>
                  </div>
                )}
              </div>

              {/* Next Button (if multiple images) */}
              {allImages.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImgIndex(prev => (prev < allImages.length - 1 ? prev + 1 : 0));
                  }}
                  className="z-10 p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer backdrop-blur-md border border-white/10 hover:scale-110 active:scale-95"
                  title="Gambar Selanjutnya (→)"
                >
                  <ArrowRight01Icon size={24} />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
