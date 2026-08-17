import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckmarkCircle02Icon, 
  SparklesIcon, 
  Cancel01Icon, 
  StarIcon,
  Logout01Icon
} from 'hugeicons-react';
import { Check, Coins, Zap, Sparkle, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { SearchInputWithLoader } from '@/components/ui/search-input';
import SpecularElectricButton from '@/components/ui/SpecularElectricButton';
import SpecularButton from '@/components/ui/SpecularButton';
import { PrimaryButton, WhiteButton } from '@/components/ui/button';
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

/**
 * Per-Digit Rolling Number Ticker (Odometer Style)
 * Setiap digit angka (0-9) bergulir secara independen satu per satu dari atas ke bawah.
 */
export function DigitTicker({ value, prefix = "", suffix = "", className = "" }) {
  const str = String(value);
  const chars = str.split("");

  return (
    <span className={`inline-flex items-baseline tabular-nums select-none ${className}`}>
      {prefix && <span className="inline-block mr-0.5 font-bold">{prefix}</span>}
      {chars.map((char, index) => {
        const isDigit = !isNaN(parseInt(char, 10));

        if (!isDigit) {
          // Titik pemisah ribuan ('.') atau karakter simbol tetap statis
          return (
            <span key={`sep-${index}-${char}`} className="inline-block">
              {char}
            </span>
          );
        }

        // Posisi kolom dihitung dari kanan (satuan, puluhan, ratusan, dst.)
        const posFromRight = chars.length - 1 - index;

        return (
          <span
            key={`col-${posFromRight}`}
            className="relative inline-block h-[1.12em] overflow-hidden leading-none align-baseline"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={`${posFromRight}-${char}`}
                initial={{ y: "-100%", opacity: 0, filter: "blur(1.5px)" }}
                animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                exit={{ y: "100%", opacity: 0, filter: "blur(1.5px)" }}
                transition={{
                  type: "spring",
                  stiffness: 520,
                  damping: 32,
                  mass: 0.5,
                  delay: posFromRight * 0.015, // Efek cascade halus per digit
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            </AnimatePresence>
          </span>
        );
      })}
      {suffix && <span className="inline-block ml-0.5">{suffix}</span>}
    </span>
  );
}

export function SubscriptionCards({ userCredits = 0, onTopUp = () => {}, isPanel = false, billingMode = 'subscription' }) {
  // Slider states for "Atur Kredit" mode
  const [basicCredits, setBasicCredits] = useState(1500); // 500 - 3000
  const [proCredits, setProCredits] = useState(6000); // 4000 - 20000

  const navigateToCheckout = (planSlug) => {
    onTopUp(planSlug);
  };

  const isSub = billingMode === 'subscription';

  // Calculations for custom slider cards
  const basicPrice = Math.round(basicCredits * 2.5); // Rp 2.5 per kredit
  const proPrice = Math.round(proCredits * 2.0); // Rp 2.0 per kredit

  const basicPct = ((basicCredits - 500) / (3000 - 500)) * 100;
  const proPct = ((proCredits - 4000) / (20000 - 4000)) * 100;

  return (
    <div className="w-full" style={{ perspective: 1200 }}>
      {/* 2-Column Plan Grid with 3D Unfolding Entry Motion */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 items-stretch"
      >
        
        {/* CARD 1: BUSINESS / KREDIT REGULER (KUMO UI LIGHT SPECULAR CARD) */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 28, rotateY: -12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 24, 
            mass: 0.8,
            delay: 0.05 
          }}
          className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 p-6 sm:p-7 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.9)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-black/20 dark:hover:border-white/20 transition-all duration-200 h-full transform-gpu"
        >
          <div>
            <div className="flex items-center justify-between mb-2 min-h-[24px]">
              <span className="inline-block px-3 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-[11px] font-bold border border-purple-200/80 dark:border-purple-800 shadow-2xs">
                {isSub ? 'Paling Diminati' : 'Fleksibel'}
              </span>
            </div>

            {/* Per-Digit Rolling Ticker on Price Nominal */}
            <div className="mb-2 flex items-baseline">
              <DigitTicker
                prefix="Rp"
                value={isSub ? '8.000' : basicPrice.toLocaleString('id-ID')}
                className="text-3xl sm:text-4xl font-extrabold text-obsidian dark:text-zinc-100 tracking-tight"
              />
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 ml-1">
                {isSub ? ' /bulan' : ' /top-up'}
              </span>
            </div>

            <h3 className="text-xl font-bold text-obsidian dark:text-zinc-100 tracking-tight">
              {isSub ? 'Business' : 'Kredit Reguler'}
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 min-h-[34px] font-normal leading-relaxed">
              {isSub 
                ? 'Paling efisien bagi prompt engineer dan kreator aktif.'
                : 'Atur jumlah kredit sesuai kebutuhan harian atau mencoba prompt.'}
            </p>

            {/* Clean Minimalist Slider */}
            <AnimatePresence mode="wait">
              {!isSub && (
                <motion.div 
                  key="basic-slider"
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  className="overflow-hidden"
                >
                  <div className="flex justify-between items-center text-xs sm:text-sm mb-2">
                    <span className="font-bold text-obsidian dark:text-white flex items-center gap-1.5">
                      <Coins size={14} className="text-purple-600 stroke-[2.2]" />
                      {basicCredits.toLocaleString('id-ID')} kredit
                    </span>
                    <span className="font-semibold text-zinc-500 dark:text-zinc-400 text-xs">
                      Rp 2,5/kredit
                    </span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="3000"
                    step="250"
                    value={basicCredits}
                    onChange={(e) => setBasicCredits(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-purple-600 dark:accent-purple-400 bg-zinc-200/80 dark:bg-zinc-800"
                    style={{
                      background: `linear-gradient(to right, #9333ea ${basicPct}%, #e4e4e7 ${basicPct}%)`
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="border-t border-black/5 dark:border-white/10 my-4" />

            <p className="text-xs font-bold text-obsidian dark:text-zinc-200 mb-3.5">
              Fitur paket:
            </p>

            <ul className="space-y-3 text-xs text-zinc-600 dark:text-zinc-300 mb-6 font-medium">
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-black/10 dark:border-white/10 flex items-center justify-center shrink-0">
                  <Check size={11} className="text-purple-600 dark:text-purple-400 stroke-[2.5]" />
                </div>
                <span className="font-bold text-obsidian dark:text-zinc-100">
                  {isSub ? '4.000 Kredit (+33% hemat)' : `${basicCredits.toLocaleString('id-ID')} Kredit saldo permanen`}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-black/10 dark:border-white/10 flex items-center justify-center shrink-0">
                  <Check size={11} className="text-purple-600 dark:text-purple-400 stroke-[2.5]" />
                </div>
                <span>Akses prompt 3D & video motion</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-black/10 dark:border-white/10 flex items-center justify-center shrink-0">
                  <Check size={11} className="text-purple-600 dark:text-purple-400 stroke-[2.5]" />
                </div>
                <span>Prioritas update prompt baru</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-black/10 dark:border-white/10 flex items-center justify-center shrink-0">
                  <Check size={11} className="text-purple-600 dark:text-purple-400 stroke-[2.5]" />
                </div>
                <span>Full copy prompt & JSON specs</span>
              </li>
            </ul>
          </div>

          <div className="pt-2 mt-auto">
            <WhiteButton
              onClick={() => navigateToCheckout(isSub ? '10k' : '5k')}
              className="w-full h-11 rounded-full text-xs sm:text-sm font-bold"
            >
              {isSub ? 'Langganan Business' : `Beli ${basicCredits.toLocaleString('id-ID')} Kredit`}
            </WhiteButton>
          </div>
        </motion.div>

        {/* CARD 2: ENTERPRISE / PRO CREATOR (KUMO UI OBSIDIAN DARK ELEVATED CARD) */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 28, rotateY: 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 24, 
            mass: 0.8,
            delay: 0.12 
          }}
          className="rounded-3xl bg-zinc-950 dark:bg-zinc-900 text-zinc-100 p-6 sm:p-7 flex flex-col justify-between shadow-[0_12px_32px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.15)] border border-white/15 dark:border-zinc-700/80 transition-all duration-200 ring-1 ring-black/10 h-full transform-gpu"
        >
          <div>
            <div className="flex items-center justify-between mb-2 min-h-[24px]">
              <span className="inline-block px-3 py-0.5 rounded-full bg-zinc-800/90 text-zinc-200 text-[11px] font-bold border border-white/15 shadow-2xs">
                {isSub ? 'Paling Populer' : 'Paling Hemat • Diskon 20%'}
              </span>
            </div>

            {/* Per-Digit Rolling Ticker on Price Nominal */}
            <div className="mb-2 flex items-baseline">
              <DigitTicker
                prefix="Rp"
                value={isSub ? '20.000' : proPrice.toLocaleString('id-ID')}
                className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
              />
              <span className="text-xs font-semibold text-zinc-400 ml-1">
                {isSub ? ' /bulan' : ' /top-up'}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight">
              {isSub ? 'Enterprise' : 'Pro Creator'}
            </h3>
            <p className="text-xs text-zinc-400 mt-1 min-h-[34px] font-normal leading-relaxed">
              {isSub 
                ? 'Solusi terlengkap dengan kuota maksimal untuk studio kreatif & agensi.'
                : 'Pilihan volume besar dengan tarif per kredit termurah untuk power user.'}
            </p>

            {/* Clean Minimalist Slider */}
            <AnimatePresence mode="wait">
              {!isSub && (
                <motion.div 
                  key="pro-slider"
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  className="overflow-hidden"
                >
                  <div className="flex justify-between items-center text-xs sm:text-sm mb-2">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Coins size={14} className="text-amber-400 stroke-[2.2]" />
                      {proCredits.toLocaleString('id-ID')} kredit
                    </span>
                    <span className="font-semibold text-zinc-400 text-xs">
                      Rp 2,0/kredit
                    </span>
                  </div>
                  <input
                    type="range"
                    min="4000"
                    max="20000"
                    step="1000"
                    value={proCredits}
                    onChange={(e) => setProCredits(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-white bg-zinc-800"
                    style={{
                      background: `linear-gradient(to right, #ffffff ${proPct}%, #3f3f46 ${proPct}%)`
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="border-t border-white/10 my-4" />

            <p className="text-xs font-bold text-zinc-200 mb-3.5">
              Semua fitur Business, plus:
            </p>

            <ul className="space-y-3 text-xs text-zinc-300 mb-6 font-medium">
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-zinc-800 border border-white/15 flex items-center justify-center shrink-0">
                  <Check size={11} className="text-white stroke-[2.5]" />
                </div>
                <span className="font-bold text-white">
                  {isSub ? '12.000 Kredit (+60% bonus)' : `${proCredits.toLocaleString('id-ID')} Kredit saldo permanen`}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-zinc-800 border border-white/15 flex items-center justify-center shrink-0">
                  <Check size={11} className="text-white stroke-[2.5]" />
                </div>
                <span>Akses VIP seluruh prompt eksklusif & 3D</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-zinc-800 border border-white/15 flex items-center justify-center shrink-0">
                  <Check size={11} className="text-white stroke-[2.5]" />
                </div>
                <span>Lisensi penggunaan komersial lengkap</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-zinc-800 border border-white/15 flex items-center justify-center shrink-0">
                  <Check size={11} className="text-white stroke-[2.5]" />
                </div>
                <span>Dukungan prioritas & update 24/7</span>
              </li>
            </ul>
          </div>

          <div className="pt-2 mt-auto">
            <PrimaryButton
              onClick={() => navigateToCheckout('10k')}
              className="w-full h-11 rounded-full text-xs sm:text-sm font-bold shadow-lg"
            >
              {isSub ? 'Langganan Enterprise' : `Beli ${proCredits.toLocaleString('id-ID')} Kredit`}
            </PrimaryButton>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}

export default function SubscriptionView({ 
  userCredits = 0, 
  userRole = "Starter Plan",
  currentUser = null,
  favoritePromptIds = [],
  purchasedPromptIds = [],
  onClose = () => {}, 
  onNavigate = () => {},
  onTopUp = () => {},
  onOpenAuth = () => {},
  onSignOut = () => {}
}) {
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [billingMode, setBillingMode] = useState('subscription'); // 'subscription' | 'topup'
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || window.pageYOffset || 0;
      setIsScrolled(scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <SidebarProvider className="bg-white dark:bg-zinc-950">
      {/* 1. App Sidebar (Active on Subscription) */}
      <AppSidebar 
        currentUser={currentUser}
        userCredits={userCredits}
        userRole={userRole}
        activeCategory="subscription"
        searchQuery=""
        favoritePromptIds={favoritePromptIds}
        purchasedPromptIds={purchasedPromptIds}
        onSearchChange={(q) => {
          onClose();
        }}
        onOpenAuth={onOpenAuth}
        onOpenUpgrade={() => {}}
        onSignOut={() => setShowSignOutConfirm(true)}
        onSelectCategory={(cat) => {
          onClose();
        }}
      />

      {/* 2. Workspace Content Inset */}
      <SidebarInset className="bg-white dark:bg-zinc-950 transition-all">
        <div className="min-h-screen w-full bg-white dark:bg-zinc-950 flex flex-col font-sans overflow-x-hidden pb-28 md:pb-0">
          
          {/* Top Fixed Glassmorphism Header - Slides up on mobile scroll */}
          <header className={cn(
            "fixed top-0 right-0 left-0 md:left-[var(--sidebar-width)] group-data-[state=collapsed]/sidebar-wrapper:md:left-[var(--sidebar-width-icon)] z-40 flex h-16 shrink-0 items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 md:px-8 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-black/5 dark:border-white/5 transform-gpu transition-all duration-300 ease-out",
            isScrolled ? "-translate-y-full md:translate-y-0 opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto" : "translate-y-0 opacity-100"
          )}>
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
              <SidebarTrigger aria-label="Buka Menu Sidebar" className="-ml-1 text-obsidian hover:bg-black/5 rounded-lg p-1.5 transition-colors shrink-0" />
              <Separator orientation="vertical" className="h-5 bg-black/10 shrink-0" />
              <Breadcrumb className="min-w-0 truncate">
                <BreadcrumbList className="flex-nowrap min-w-0 text-xs sm:text-sm">
                  <BreadcrumbItem className="hidden sm:block shrink-0">
                    <BreadcrumbLink href="#" onClick={(e) => { e.preventDefault(); onClose(); }} className="font-bold text-obsidian hover:text-purple-600 transition-colors">
                      Prompt Hub
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden sm:block shrink-0 text-black/40" />
                  <BreadcrumbItem className="min-w-0 truncate">
                    <BreadcrumbPage className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                      Paket &amp; Langganan
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Center: Search input redirect */}
            <div className="hidden sm:flex flex-1 justify-center max-w-md md:max-w-lg lg:max-w-xl mx-2 sm:mx-4 min-w-0 transition-all duration-300">
              <SearchInputWithLoader
                value=""
                onChange={() => onClose()}
                onClear={() => {}}
                placeholder="Cari prompt..."
                className="w-full"
              />
            </div>

            {/* Right: Credits Badge & Auth buttons */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto z-10">
              <SpecularElectricButton 
                credits={userCredits} 
                onClick={() => {}} 
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

          {/* Main Showcase Area */}
          <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 md:px-8 pt-[84px] sm:pt-[96px] pb-6 md:pb-8 flex-1 flex flex-col justify-center relative">
            
            {/* Fixed Top-Left Floating Back Button on Mobile (Smooth scroll motion to top safe area) */}
            <div className={cn(
              "fixed left-2.5 sm:left-4 z-40 md:hidden pointer-events-auto transition-all duration-300 ease-out",
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
            
            {/* Header with Title on Left and Segmented Toggle on Right */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7 sm:mb-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-obsidian dark:text-zinc-100 tracking-tight leading-tight mb-1">
                  {billingMode === 'subscription' ? 'Paket & Langganan' : 'Atur Kredit Sendiri'}
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm font-normal">
                  {billingMode === 'subscription' 
                    ? 'Pilih langganan bulanan hemat untuk kuota kredit rutin dan akses fitur AI tanpa hambatan.'
                    : 'Geser slider untuk menentukan jumlah kredit yang Anda butuhkan secara fleksibel.'}
                </p>
              </div>

              {/* Segmented Switch Toggle with Sliding Motion Pill */}
              <div className="relative inline-flex items-center p-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 shrink-0 self-start sm:self-auto shadow-2xs">
                <button
                  type="button"
                  onClick={() => setBillingMode('subscription')}
                  className={`relative z-10 px-4 py-1.5 rounded-full text-xs transition-colors duration-200 cursor-pointer select-none ${
                    billingMode === 'subscription'
                      ? 'text-obsidian dark:text-white font-bold'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-obsidian dark:hover:text-white font-medium'
                  }`}
                >
                  {billingMode === 'subscription' && (
                    <motion.div
                      layoutId="activeBillingPill"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-full shadow-xs border border-black/5 dark:border-white/10 -z-10"
                    />
                  )}
                  Paket Langganan
                </button>
                <button
                  type="button"
                  onClick={() => setBillingMode('topup')}
                  className={`relative z-10 px-4 py-1.5 rounded-full text-xs transition-colors duration-200 cursor-pointer select-none ${
                    billingMode === 'topup'
                      ? 'text-obsidian dark:text-white font-bold'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-obsidian dark:hover:text-white font-medium'
                  }`}
                >
                  {billingMode === 'topup' && (
                    <motion.div
                      layoutId="activeBillingPill"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-full shadow-xs border border-black/5 dark:border-white/10 -z-10"
                    />
                  )}
                  Atur Kredit
                </button>
              </div>
            </div>

            {/* Pricing Cards Grid */}
            <SubscriptionCards 
              userCredits={userCredits} 
              onTopUp={onTopUp} 
              isPanel={false} 
              billingMode={billingMode} 
            />

          </main>
        </div>
      </SidebarInset>

      {/* Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <AlertDialog open={showSignOutConfirm} onOpenChange={setShowSignOutConfirm}>
          <AlertDialogContent className="max-w-md bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-3xl p-6 shadow-xl">
            <AlertDialogHeader className="flex flex-col gap-2">
              <AlertDialogTitle className="text-base font-bold text-obsidian dark:text-white">
                Konfirmasi Keluar Akun
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs text-zinc-600 dark:text-zinc-400">
                Apakah Anda yakin ingin keluar dari akun Anda? Anda dapat masuk kembali kapan saja untuk mengakses kredit dan riwayat prompt Anda.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="w-full flex flex-row items-center justify-end gap-2.5 pt-4">
              <AlertDialogCancel 
                onClick={() => setShowSignOutConfirm(false)}
                className="h-9 px-4 rounded-full border border-black/10 dark:border-white/10 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Batal
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => {
                  setShowSignOutConfirm(false);
                  onSignOut();
                }}
                className="h-9 px-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
              >
                Ya, Keluar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </SidebarProvider>
  );
}
