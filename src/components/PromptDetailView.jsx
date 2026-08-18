import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Coins, Sparkle, Share2, Unlock, Lock, Bookmark, Search, MoreHorizontal, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Dock } from '@/components/ui/dock-two';
import { AnimatedNumber } from '@/components/ui/animated-counter';
import SpecularElectricButton from '@/components/ui/SpecularElectricButton';
import SpecularButton from '@/components/ui/SpecularButton';
import { SubscriptionCards } from './SubscriptionView';
import PromptParameterCustomizer from './prompt-detail/PromptParameterCustomizer';
import PromptImageGallery from './prompt-detail/PromptImageGallery';
import { getOptimizedImageUrl } from '@/utils/image-optimizer';
import { getPromptAspectRatioValue } from '@/utils/prompt-helpers';
import { cn } from '@/lib/utils';
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
import { PrimaryButton, PrimaryCTAButton, SecondaryButton, WhiteButton } from "@/components/ui/button";
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
  const aspectValue = getPromptAspectRatioValue(prompt);

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

  // Variable customizer - cleans up template variables without capturing raw JSON blocks
  const extractVariables = (text) => {
    if (!text || typeof text !== 'string') return {};
    
    // 1. Match bracketed template variables like [cuisine], [subject], <style>
    const bracketMatches = text.match(/\[([a-zA-Z0-9_\s-]{1,30})\]|<([a-zA-Z0-9_\s-]{1,30})>/g) || [];
    const vars = {};
    bracketMatches.forEach(m => {
      const cleanKey = m.replace(/[[\]<>]/g, '').trim();
      if (cleanKey && !vars[cleanKey]) {
        vars[cleanKey] = cleanKey;
      }
    });

    // 2. If no brackets, check for simple curly braces like {subject} (excluding raw JSON with colons/quotes)
    const curlyMatches = text.match(/\{([a-zA-Z0-9_]{1,30})\}/g) || [];
    curlyMatches.forEach(m => {
      const cleanKey = m.replace(/[{}]/g, '').trim();
      if (cleanKey && !vars[cleanKey]) {
        vars[cleanKey] = cleanKey;
      }
    });

    // 3. If prompt is structured JSON, extract key editable leaf fields (e.g. cuisine, subject, style, lighting)
    if (Object.keys(vars).length === 0 && text.trim().startsWith('{')) {
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.subject && typeof parsed.subject === 'object') {
            Object.keys(parsed.subject).forEach(k => {
              if (typeof parsed.subject[k] === 'string' && parsed.subject[k].length < 40) {
                vars[k] = parsed.subject[k];
              }
            });
          } else if (typeof parsed.subject === 'string' && parsed.subject.length < 50) {
            vars['subject'] = parsed.subject;
          }
          if (parsed.style && typeof parsed.style === 'string' && parsed.style.length < 50) {
            vars['style'] = parsed.style;
          }
          if (parsed.lighting && typeof parsed.lighting === 'string' && parsed.lighting.length < 50) {
            vars['lighting'] = parsed.lighting;
          }
        }
      } catch (e) {
        // Not valid JSON, continue with extracted vars
      }
    }

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
      result = result.replace(new RegExp(`\\[${key}\\]|\\{${key}\\}|<${key}>`, 'g'), val);
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
          {/* Fixed Glassmorphism Navbar Header - Slides up on mobile scroll */}
          <header className={cn(
            "fixed top-0 right-0 left-0 md:left-[var(--sidebar-width)] group-data-[state=collapsed]/sidebar-wrapper:md:left-[var(--sidebar-width-icon)] z-40 flex h-16 shrink-0 items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 md:px-8 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-black/5 dark:border-white/5 transform-gpu transition-all duration-300 ease-out",
            isScrolled ? "-translate-y-full md:translate-y-0 opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto" : "translate-y-0 opacity-100"
          )}>
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

            {/* Right: Credits Badge */}
            <div className="flex items-center gap-2.5">
              <SpecularElectricButton 
                onClick={() => {
                  if (onOpenUpgrade) onOpenUpgrade();
                  else setShowSubscription(true);
                }} 
                credits={userCredits} 
              />
            </div>
          </header>

          {/* Main Content Area - Full width workspace matching Home Gallery */}
          <main className="w-full min-w-0 max-w-full overflow-x-hidden mx-auto pt-[76px] sm:pt-[88px] px-3 sm:px-6 md:px-8 pb-36 flex-1 flex flex-col relative">
            
            {/* ============================================================
                MOBILE VIEW (< 1024px / lg:hidden) - KUMO UI DESIGN SYSTEM
                ============================================================ */}
            <div className="lg:hidden flex flex-col gap-3.5 pb-20 relative">
              
              {/* Fixed Top-Left Floating Back Button (Animates smoothly to top safe area when scrolled) */}
              <div className={cn(
                "fixed left-2.5 sm:left-4 z-40 lg:hidden pointer-events-auto transition-all duration-300 ease-out",
                isScrolled ? "top-3.5 sm:top-4" : "top-[80px]"
              )}>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Kembali"
                  className="w-11 h-11 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-md flex items-center justify-center text-obsidian dark:text-white active:scale-90 transition-transform cursor-pointer"
                >
                  <ChevronLeft size={22} className="stroke-[2.5] -ml-0.5" />
                </button>
              </div>

              {/* 1. Hero Image Card with Bottom-Right Zoom Button */}
              <div className="relative w-full rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10">
                
                {/* Aspect-Locked Hero Image */}
                <div 
                  className="relative w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900"
                  style={{ aspectRatio: aspectValue }}
                >
                  {!isHeroLoaded && (
                    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-900 animate-pulse z-0">
                      <div className="w-10 h-10 rounded-full bg-zinc-200/80 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-2">
                        <Image01Icon size={20} className="opacity-60" />
                      </div>
                      <span className="text-[11px] font-medium text-zinc-400">Memuat Preview...</span>
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
                  className="absolute bottom-3.5 right-3.5 z-20 w-9 h-9 rounded-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-sm flex items-center justify-center text-obsidian dark:text-white active:scale-90 transition-transform cursor-pointer"
                >
                  <Search size={16} className="stroke-[2.2]" />
                </button>
              </div>

              {/* 2. Engagement & Action Bar (Directly below Image - KUMO UI Style) */}
              <div className="flex items-center justify-between gap-2 px-1 pt-0.5">
                {/* Left Action Icons */}
                <div className="flex items-center gap-2">
                  {/* Like Button */}
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(prompt.id)}
                    className={`inline-flex items-center gap-1.5 h-10 px-3.5 sm:h-9 sm:px-3 rounded-full text-xs font-bold transition-all active:scale-95 shadow-2xs border-0 cursor-pointer ${
                      isFavorite 
                        ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-300 dark:bg-rose-950/50 dark:text-rose-400' 
                        : 'bg-white dark:bg-zinc-800 text-obsidian dark:text-zinc-100 ring-1 ring-black/10 dark:ring-white/10 hover:bg-zinc-100'
                    }`}
                  >
                    <FavouriteIcon size={16} className={isFavorite ? 'fill-rose-600 text-rose-600' : ''} />
                    <span>{likes + (isFavorite ? 1 : 0)}</span>
                  </button>

                  {/* Comment / Info Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowProjectInfo(!showProjectInfo)}
                    className="h-10 w-10 sm:h-9 sm:w-9 rounded-full bg-white dark:bg-zinc-800 text-obsidian dark:text-zinc-100 ring-1 ring-black/10 dark:ring-white/10 shadow-2xs hover:bg-zinc-100 active:scale-95 flex items-center justify-center cursor-pointer border-0"
                    title="Detail Prompt"
                  >
                    <InformationCircleIcon size={18} />
                  </button>

                  {/* Share Link */}
                  <button
                    type="button"
                    onClick={handleShareLink}
                    className="h-10 w-10 sm:h-9 sm:w-9 rounded-full bg-white dark:bg-zinc-800 text-obsidian dark:text-zinc-100 ring-1 ring-black/10 dark:ring-white/10 shadow-2xs hover:bg-zinc-100 active:scale-95 flex items-center justify-center cursor-pointer border-0"
                    title="Bagikan Tautan"
                  >
                    {copiedLink ? <CheckmarkCircle02Icon size={18} className="text-emerald-600" /> : <Share01Icon size={18} />}
                  </button>

                </div>

                {/* Right: Primary Action Button (KUMO UI PrimaryButton Pill) */}
                <PrimaryButton
                  onClick={handleCopyText}
                  className="h-10 px-5 rounded-full text-xs sm:text-sm font-bold shadow-xs active:scale-95 shrink-0"
                >
                  {copiedText ? (
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <Check size={15} className="stroke-[2.5]" />
                      <span>Disalin!</span>
                    </span>
                  ) : (isUnlocked || !isPremium) ? (
                    <span className="flex items-center gap-1.5">
                      <Copy01Icon size={15} />
                      <span>Salin Prompt</span>
                    </span>
                  ) : (
                    <span>Buka ({promptCost} Kredit)</span>
                  )}
                </PrimaryButton>
              </div>

              {/* 3. Metadata Pills Row */}
              <div className="flex flex-wrap items-center gap-2 px-1 pt-1 text-xs text-ash-gray font-sans">
                <span className="bg-[#f2f2f2] dark:bg-zinc-800 text-obsidian dark:text-zinc-200 px-3 py-1 rounded-full font-semibold">
                  @{author || 'Daniel Triendl'}
                </span>
                <span className="bg-[#f2f2f2] dark:bg-zinc-800 text-obsidian dark:text-zinc-200 px-3 py-1 rounded-full font-semibold">
                  {model}
                </span>
                <span className="bg-[#f2f2f2] dark:bg-zinc-800 text-obsidian dark:text-zinc-200 px-3 py-1 rounded-full font-semibold">
                  {rawPrompt.length.toLocaleString('id-ID')} Karakter
                </span>
                {isPremium && (
                  <SpecularButton isUnlocked={isUnlocked}>
                    {isUnlocked ? 'Unlocked' : `Premium (${promptCost} Kredit)`}
                  </SpecularButton>
                )}
              </div>

              {/* 4. Title & Category Subtitle */}
              <div className="px-1 pt-0.5">
                <h1 className="font-serif text-2xl sm:text-3xl font-normal text-obsidian dark:text-white tracking-tight leading-tight">
                  {title}
                </h1>
                <p className="font-sans text-ash-gray font-normal text-xs sm:text-sm pt-1">
                  {categoryTagsStr} <span className="text-obsidian dark:text-zinc-100 font-semibold">{creatorHandle}</span>
                </p>
              </div>

              {/* 5. Parameter Customizer FIRST, then Teks Prompt SECOND */}
              <div className="px-1 flex flex-col gap-3.5 pt-1">
                {/* Parameter Customizer (1 row per variable, single input without container bg) */}
                {variableKeys.length > 0 && (isUnlocked || !isPremium) && (
                  <PromptParameterCustomizer 
                    variables={variables} 
                    variableKeys={variableKeys} 
                    onChange={handleVariableChange} 
                  />
                )}

                {/* Prompt Quote Display */}
                <div className={`p-4 sm:p-5 rounded-2xl bg-[#f8f8f8] dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-2xs ${
                  !isUnlocked && isPremium ? 'blur-xs select-none opacity-50' : ''
                }`}>
                  <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-black/5 dark:border-white/5">
                    <span className="text-[11px] font-bold text-obsidian dark:text-white uppercase tracking-wider">Teks Prompt</span>
                    <span className="text-[11px] text-zinc-500 font-medium">{compiledPrompt.length} Karakter</span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 font-serif leading-relaxed italic">
                    "{compiledPrompt}"
                  </p>
                </div>

                {/* Dual Action CTAs: Salin Prompt & Salin Gambar (KUMO UI Style) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {/* 1. Salin / Buka Prompt (PrimaryButton Pill) */}
                  <PrimaryButton
                    onClick={handleCopyText}
                    className="w-full h-11 rounded-full text-xs sm:text-sm font-bold shadow-xs flex items-center justify-center gap-2 active:scale-95"
                  >
                    {copiedText ? (
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <Check size={15} className="stroke-[2.5]" />
                        <span>Teks Prompt Disalin!</span>
                      </span>
                    ) : (isUnlocked || !isPremium) ? (
                      <span className="flex items-center gap-1.5">
                        <Copy01Icon size={15} />
                        <span>Salin Teks Prompt</span>
                      </span>
                    ) : (
                      <span>Buka Prompt ({promptCost} Kredit)</span>
                    )}
                  </PrimaryButton>

                  {/* 2. Salin Link Gambar Referensi (Secondary White Button) */}
                  <WhiteButton
                    onClick={copyImageUrlToClipboard}
                    className="w-full h-11 rounded-full text-xs sm:text-sm font-bold shadow-2xs flex items-center justify-center gap-2"
                  >
                    <Image01Icon size={15} className="shrink-0" />
                    <span>{copiedImg ? 'Link Gambar Disalin!' : 'Salin Link Gambar Referensi'}</span>
                  </WhiteButton>
                </div>

                {/* 6. Tutorial Cara Menggunakan Prompt & Direct Link ke Gemini (Mobile Interactive Accordion) */}
                {(isUnlocked || !isPremium) && (
                  <div className="rounded-2xl border border-purple-200/80 dark:border-purple-800/60 bg-purple-50/30 dark:bg-purple-950/20 text-obsidian dark:text-zinc-100 overflow-hidden transition-all shadow-2xs mt-1">
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
                          key="mobile-tutorial-content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col gap-2.5 px-3.5 pb-3.5 pt-2 border-t border-purple-200/60 dark:border-purple-800/40 text-xs">
                            
                            {/* Step 1: Copy Prompt */}
                            <div className="flex items-center justify-between gap-2.5 p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-purple-100/90 dark:border-purple-900/50 shadow-2xs">
                              <div className="flex items-start gap-2 min-w-0">
                                <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                                  1
                                </span>
                                <div className="min-w-0">
                                  <h4 className="font-bold text-obsidian dark:text-white leading-tight">Salin Teks Prompt</h4>
                                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-normal">
                                    Teks prompt siap pakai teroptimasi.
                                  </p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={copyPromptToClipboard}
                                className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-obsidian dark:text-white text-[11px] font-bold shrink-0 cursor-pointer active:scale-95 transition-all shadow-2xs border border-black/5 dark:border-white/10"
                              >
                                {copiedText ? (
                                  <span className="text-emerald-600 font-bold">Disalin!</span>
                                ) : (
                                  <span>Salin</span>
                                )}
                              </button>
                            </div>

                            {/* Step 2: Open Google Gemini */}
                            <div className="flex items-center justify-between gap-2.5 p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-purple-100/90 dark:border-purple-900/50 shadow-2xs">
                              <div className="flex items-start gap-2 min-w-0">
                                <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                                  2
                                </span>
                                <div className="min-w-0">
                                  <h4 className="font-bold text-obsidian dark:text-white leading-tight">Buka Google Gemini</h4>
                                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-normal">
                                    Buka generator AI Google Gemini.
                                  </p>
                                </div>
                              </div>

                              <a
                                href="https://gemini.google.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-600 text-white text-[11px] font-bold shrink-0 cursor-pointer active:scale-95 transition-all shadow-2xs"
                              >
                                <Sparkle className="size-3 text-amber-300 fill-amber-300 shrink-0" />
                                <span>Buka Gemini</span>
                                <ArrowUpRight01Icon size={12} className="shrink-0" />
                              </a>
                            </div>

                            {/* Step 3: Paste & Generate */}
                            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-purple-100/90 dark:border-purple-900/50 shadow-2xs">
                              <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                                3
                              </span>
                              <div>
                                <h4 className="font-bold text-obsidian dark:text-white leading-tight">Tempel & Generate</h4>
                                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-normal">
                                  Tempel teks prompt pada kolom chat Gemini lalu tekan Kirim.
                                </p>
                              </div>
                            </div>

                            {/* PRO TIP: Gambar Referensi */}
                            <div className="p-3 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 flex flex-col gap-2 shadow-2xs">
                              <div className="flex items-start gap-2">
                                <span className="text-sm leading-none shrink-0 mt-0.5">💡</span>
                                <div>
                                  <h4 className="text-[11px] font-bold text-amber-950 dark:text-amber-200">
                                    Tips Hasil Maksimal:
                                  </h4>
                                  <p className="text-[11px] text-amber-800/90 dark:text-amber-400/90 mt-0.5 leading-normal">
                                    Gunakan <strong>link gambar referensi</strong> di bawah bersama teks prompt di Gemini agar gaya visual lebih presisi.
                                  </p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={copyImageUrlToClipboard}
                                className="inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg bg-amber-200/80 dark:bg-amber-900/70 hover:bg-amber-300 text-amber-950 dark:text-amber-100 text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-2xs self-start"
                              >
                                <Image01Icon size={14} className="shrink-0" />
                                <span>{copiedImg ? 'Link Gambar Disalin!' : 'Salin Link Gambar Referensi'}</span>
                              </button>
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

            </div>

            {/* ============================================================
                DESKTOP VIEW (≥ 1024px / hidden lg:flex) - UNIFIED VERTICALLY CENTERED SHOWCASE
                ============================================================ */}
            <div className="hidden lg:flex flex-col justify-center min-h-[calc(100vh-140px)] w-full max-w-6xl mx-auto py-6 relative">
              {/* Dynamic Floating Close CTA Button (Fixed on scroll, clean in-place at top) */}
              <DetailCloseCTA onClose={onClose} isScrolled={isScrolled} />

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center w-full my-auto"
              >
                {/* Left: Aspect-Ratio Hero Image with Multi-image Selector */}
                <div className="lg:col-span-6 xl:col-span-6 flex flex-col gap-3.5 items-center justify-center">
                  <div 
                    className="relative w-full max-w-[560px] max-h-[70vh] rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 shadow-sm flex items-center justify-center group"
                    style={{ aspectRatio: aspectValue }}
                  >
                    {/* Shimmer Skeleton */}
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
                      className={`absolute inset-0 w-full h-full object-cover rounded-3xl cursor-pointer hover:scale-[1.01] transition-all duration-300 z-10 ${
                        isHeroLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.99]'
                      }`}
                      title="Klik untuk memperbesar gambar"
                    />

                    {/* Bottom-Right Floating Zoom Pill */}
                    <button
                      type="button"
                      onClick={() => setIsLightboxOpen(true)}
                      aria-label="Perbesar gambar"
                      className="absolute bottom-3.5 right-3.5 z-20 w-9 h-9 rounded-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-sm flex items-center justify-center text-obsidian dark:text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:scale-105 active:scale-95"
                    >
                      <Search size={15} className="stroke-[2.2]" />
                    </button>
                  </div>

                  {/* Multi-Image Thumbnail Selector (if multiple images) */}
                  {allImages.length > 1 && (
                    <div className="flex items-center gap-2.5 overflow-x-auto max-w-full pb-1 scrollbar-none">
                      {allImages.map((imgUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setSelectedImgIndex(idx);
                          }}
                          className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                            selectedImgIndex === idx 
                              ? 'border-purple-600 shadow-xs ring-2 ring-purple-500/20 scale-105' 
                              : 'border-black/5 dark:border-white/10 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img 
                            src={getOptimizedImageUrl(imgUrl, 120, 75)} 
                            alt={`Thumbnail ${idx + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Title, Metadata, Parameter Customizer, Prompt Box, Tutorial, & CTAs */}
                <div className="lg:col-span-6 xl:col-span-6 flex flex-col gap-4">
                  {/* Title & Subtitle */}
                  <div className="flex flex-col gap-1.5">
                    <h1 className="font-serif text-3xl xl:text-4xl font-normal text-obsidian dark:text-white tracking-tight leading-tight">
                      {title}
                    </h1>
                    <p className="font-sans text-ash-gray font-normal text-sm">
                      {categoryTagsStr} <span className="text-obsidian dark:text-zinc-100 font-semibold">{creatorHandle}</span>
                    </p>
                  </div>

                  {/* Metadata Pills Row */}
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
                      <SpecularButton isUnlocked={isUnlocked}>
                        {isUnlocked ? 'Unlocked' : `Premium (${promptCost} Kredit)`}
                      </SpecularButton>
                    )}
                  </div>

                  {/* Parameter Customizer (1 Input per row if present and unlocked) */}
                  {variableKeys.length > 0 && (isUnlocked || !isPremium) && (
                    <PromptParameterCustomizer 
                      variables={variables} 
                      variableKeys={variableKeys} 
                      onChange={handleVariableChange} 
                    />
                  )}

                  {/* Prompt Quote Display */}
                  <div className={`p-4 rounded-2xl bg-[#f8f8f8] dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-2xs ${
                    !isUnlocked && isPremium ? 'blur-xs select-none opacity-50' : ''
                  }`}>
                    <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-black/5 dark:border-white/5">
                      <span className="text-[11px] font-bold text-obsidian dark:text-white uppercase tracking-wider">Teks Prompt</span>
                      <span className="text-[11px] text-zinc-500 font-medium">{compiledPrompt.length} Karakter</span>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 font-serif leading-relaxed italic max-h-[140px] overflow-y-auto pr-1">
                      "{compiledPrompt}"
                    </p>
                  </div>

                  {/* Tutorial Cara Menggunakan Prompt (Collapsible Accordion Dropdown) */}
                  {(isUnlocked || !isPremium) && (
                    <div className="rounded-2xl border border-purple-200/80 dark:border-purple-800/60 bg-purple-50/30 dark:bg-purple-950/20 text-obsidian dark:text-zinc-100 overflow-hidden transition-all shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setIsTutorialOpen(!isTutorialOpen)}
                        className="w-full px-4 py-2.5 flex items-center justify-between font-semibold text-obsidian dark:text-white text-xs hover:bg-purple-100/50 dark:hover:bg-purple-900/30 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <InformationCircleIcon size={15} className="text-purple-600 dark:text-purple-400 shrink-0" />
                          <span>Cara Menggunakan Prompt Ini</span>
                        </div>
                        <motion.span 
                          animate={{ rotate: isTutorialOpen ? 180 : 0 }} 
                          transition={{ duration: 0.2 }}
                          className="text-purple-600 dark:text-purple-400 shrink-0"
                        >
                          <ArrowDown01Icon size={15} />
                        </motion.span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isTutorialOpen && (
                          <motion.div
                            key="desktop-tutorial-content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-col gap-2 p-3 border-t border-purple-200/60 dark:border-purple-800/40 text-xs">
                              <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white dark:bg-zinc-900 border border-purple-100 dark:border-purple-900/50 shadow-2xs">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                                  <span className="font-semibold text-obsidian dark:text-white truncate">Salin teks prompt teroptimasi</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={copyPromptToClipboard}
                                  className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-obsidian dark:text-white text-[11px] font-bold shrink-0 cursor-pointer active:scale-95 transition-all shadow-2xs border border-black/5 dark:border-white/10"
                                >
                                  {copiedText ? <span className="text-emerald-600">Disalin!</span> : <span>Salin</span>}
                                </button>
                              </div>

                              <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white dark:bg-zinc-900 border border-purple-100 dark:border-purple-900/50 shadow-2xs">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                                  <span className="font-semibold text-obsidian dark:text-white truncate">Buka generator AI Google Gemini</span>
                                </div>
                                <a
                                  href="https://gemini.google.com/"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-600 text-white text-[11px] font-bold shrink-0 cursor-pointer active:scale-95 transition-all shadow-2xs"
                                >
                                  <Sparkle className="size-3 text-amber-300 fill-amber-300 shrink-0" />
                                  <span>Buka Gemini</span>
                                  <ArrowUpRight01Icon size={12} className="shrink-0" />
                                </a>
                              </div>

                              <div className="p-2.5 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 flex items-center justify-between gap-2 shadow-2xs">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-sm leading-none shrink-0">💡</span>
                                  <span className="text-[11px] text-amber-900 dark:text-amber-200 truncate">Tips: Unggah link gambar referensi ke Gemini</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={copyImageUrlToClipboard}
                                  className="px-2.5 py-1 rounded-lg bg-amber-200/80 dark:bg-amber-900/70 hover:bg-amber-300 text-amber-950 dark:text-amber-100 text-[11px] font-bold shrink-0 cursor-pointer active:scale-95 shadow-2xs"
                                >
                                  {copiedImg ? 'Disalin!' : 'Salin Link Gambar'}
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Dual Action CTAs + Engagement Tools */}
                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-black/5 dark:border-white/5 mt-1">
                    {/* Left Action Buttons */}
                    <div className="flex items-center gap-2.5">
                      <PrimaryButton
                        onClick={handleCopyText}
                        className="h-11 px-6 rounded-full text-xs sm:text-sm font-bold shadow-xs flex items-center justify-center gap-2 active:scale-95"
                      >
                        {copiedText ? (
                          <span className="flex items-center gap-1.5 text-emerald-400">
                            <Check size={15} className="stroke-[2.5]" />
                            <span>Teks Disalin!</span>
                          </span>
                        ) : (isUnlocked || !isPremium) ? (
                          <span className="flex items-center gap-1.5">
                            <Copy01Icon size={15} />
                            <span>Salin Teks Prompt</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <AnimatedLockIcon size={14} className="text-white" />
                            <span>Buka Prompt ({promptCost} Kredit)</span>
                          </span>
                        )}
                      </PrimaryButton>

                      <WhiteButton
                        onClick={copyImageUrlToClipboard}
                        className="h-11 px-4.5 rounded-full text-xs sm:text-sm font-bold shadow-2xs flex items-center justify-center gap-1.5"
                      >
                        <Image01Icon size={15} className="shrink-0" />
                        <span>{copiedImg ? 'Link Disalin!' : 'Salin Link Gambar'}</span>
                      </WhiteButton>
                    </div>

                    {/* Right Engagement Buttons */}
                    <div className="flex items-center gap-2">
                      {/* Share Button */}
                      <button
                        type="button"
                        onClick={handleShareLink}
                        className="h-11 w-11 rounded-full bg-white dark:bg-zinc-800 text-obsidian dark:text-zinc-100 ring-1 ring-black/10 dark:ring-white/10 shadow-2xs hover:bg-zinc-100 active:scale-95 flex items-center justify-center cursor-pointer border-0"
                        title="Bagikan Tautan"
                      >
                        {copiedLink ? <CheckmarkCircle02Icon size={18} className="text-emerald-600" /> : <Share01Icon size={18} />}
                      </button>

                      {/* Favorite Button */}
                      <button
                        type="button"
                        onClick={() => onToggleFavorite(prompt.id)}
                        className={`inline-flex items-center gap-1.5 h-11 px-4 rounded-full text-xs font-bold transition-all active:scale-95 shadow-2xs border-0 cursor-pointer ${
                          isFavorite 
                            ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-300 dark:bg-rose-950/50 dark:text-rose-400' 
                            : 'bg-white dark:bg-zinc-800 text-obsidian dark:text-zinc-100 ring-1 ring-black/10 dark:ring-white/10 hover:bg-zinc-100'
                        }`}
                      >
                        <FavouriteIcon size={16} className={isFavorite ? 'fill-rose-600 text-rose-600' : ''} />
                        <span>{likes + (isFavorite ? 1 : 0)}</span>
                      </button>
                    </div>
                  </div>

                </div>
              </motion.div>
            </div>
          </main>

        {/* Lightweight Floating Navigation Dock Component for Desktop */}
        <Dock 
          className="hidden md:block"
          items={[
            {
              icon: SparklesIcon,
              label: 'Prompt',
              isActive: true,
              onClick: () => {}
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
            },
            {
              icon: Share01Icon,
              label: copiedLink ? 'Disalin!' : 'Bagikan',
              isActive: copiedLink,
              onClick: handleShareLink
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
