import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckmarkCircle02Icon, 
  SparklesIcon, 
  Cancel01Icon, 
  StarIcon,
  Logout01Icon
} from 'hugeicons-react';
import { Check, Coins, Zap } from 'lucide-react';
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
        
        {/* CARD 1: BUSINESS / KREDIT REGULER (LIGHT CARD - UNFOLDING FROM LEFT) */}
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
          className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-7 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)] hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 h-full transform-gpu"
        >
          <div>
            <div className="flex items-center justify-between mb-2 min-h-[24px]">
              <span className="inline-block px-3 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-[11px] font-semibold border border-purple-200 dark:border-purple-800">
                {isSub ? 'Paling Diminati' : 'Fleksibel'}
              </span>
            </div>

            <div className="mb-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
                {isSub ? 'Rp 8.000' : `Rp ${basicPrice.toLocaleString('id-ID')}`}
              </span>
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {isSub ? ' /bulan' : ' /top-up'}
              </span>
            </div>

            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {isSub ? 'Business' : 'Kredit Reguler'}
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 min-h-[34px] font-normal leading-relaxed">
              {isSub 
                ? 'Paling efisien bagi prompt engineer dan kreator aktif.'
                : 'Atur jumlah kredit sesuai kebutuhan harian atau mencoba prompt.'}
            </p>

            {/* Clean Minimalist Slider (Unfolding smoothly when active) */}
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
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      {basicCredits.toLocaleString('id-ID')} kredit
                    </span>
                    <span className="font-medium text-zinc-600 dark:text-zinc-400">
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
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-zinc-900 dark:accent-white"
                    style={{
                      background: `linear-gradient(to right, #18181b ${basicPct}%, #e4e4e7 ${basicPct}%)`
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="border-t border-zinc-100 dark:border-zinc-800 my-4" />

            <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-3.5">
              Fitur paket:
            </p>

            <ul className="space-y-3 text-xs text-zinc-600 dark:text-zinc-300 mb-6 font-medium">
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0">
                  <Check size={11} className="text-zinc-700 dark:text-zinc-300 stroke-[2.5]" />
                </div>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {isSub ? '4.000 Kredit (+33% hemat)' : `${basicCredits.toLocaleString('id-ID')} Kredit saldo permanen`}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0">
                  <Check size={11} className="text-zinc-700 dark:text-zinc-300 stroke-[2.5]" />
                </div>
                <span>Akses prompt 3D & video motion</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0">
                  <Check size={11} className="text-zinc-700 dark:text-zinc-300 stroke-[2.5]" />
                </div>
                <span>Prioritas update prompt baru</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0">
                  <Check size={11} className="text-zinc-700 dark:text-zinc-300 stroke-[2.5]" />
                </div>
                <span>Full copy prompt & JSON specs</span>
              </li>
            </ul>
          </div>

          <div className="pt-2 mt-auto">
            <WhiteButton
              onClick={() => navigateToCheckout(isSub ? '10k' : '5k')}
              className="w-full"
            >
              {isSub ? 'Langganan Business' : `Beli ${basicCredits.toLocaleString('id-ID')} Kredit`}
            </WhiteButton>
          </div>
        </motion.div>

        {/* CARD 2: ENTERPRISE / PRO CREATOR (DARK ELEVATED CARD - UNFOLDING FROM RIGHT) */}
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
          className="rounded-3xl bg-zinc-900 dark:bg-zinc-900 text-zinc-100 p-6 sm:p-7 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-zinc-800 dark:border-zinc-700/80 transition-all duration-200 ring-1 ring-black/5 dark:ring-white/10 h-full transform-gpu"
        >
          <div>
            <div className="flex items-center justify-between mb-2 min-h-[24px]">
              <span className="inline-block px-3 py-0.5 rounded-full bg-zinc-800 text-zinc-300 text-[11px] font-semibold border border-zinc-700">
                {isSub ? 'Paling Populer' : 'Paling Hemat • Diskon 20%'}
              </span>
            </div>

            <div className="mb-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {isSub ? 'Rp 20.000' : `Rp ${proPrice.toLocaleString('id-ID')}`}
              </span>
              <span className="text-xs font-medium text-zinc-400">
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

            {/* Clean Minimalist Slider (Unfolding smoothly when active) */}
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
                    <span className="font-semibold text-white">
                      {proCredits.toLocaleString('id-ID')} kredit
                    </span>
                    <span className="font-medium text-zinc-300">
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
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-white"
                    style={{
                      background: `linear-gradient(to right, #ffffff ${proPct}%, #3f3f46 ${proPct}%)`
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="border-t border-zinc-800 my-4" />

            <p className="text-xs font-semibold text-zinc-300 mb-3.5">
              Semua fitur Business, plus:
            </p>

            <ul className="space-y-3 text-xs text-zinc-300 mb-6 font-medium">
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                  <Check size={11} className="text-zinc-200 stroke-[2.5]" />
                </div>
                <span className="font-semibold text-white">
                  {isSub ? '12.000 Kredit (+60% bonus)' : `${proCredits.toLocaleString('id-ID')} Kredit saldo permanen`}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                  <Check size={11} className="text-zinc-200 stroke-[2.5]" />
                </div>
                <span>Akses VIP seluruh prompt eksklusif & 3D</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                  <Check size={11} className="text-zinc-200 stroke-[2.5]" />
                </div>
                <span>Lisensi penggunaan komersial lengkap</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                  <Check size={11} className="text-zinc-200 stroke-[2.5]" />
                </div>
                <span>Dukungan prioritas & update 24/7</span>
              </li>
            </ul>
          </div>

          <div className="pt-2 mt-auto">
            <PrimaryButton
              onClick={() => navigateToCheckout('10k')}
              className="w-full"
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

  return (
    <SidebarProvider className="bg-[#f5f5f7] dark:bg-zinc-950">
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
      <SidebarInset className="bg-[#f5f5f7] dark:bg-zinc-950 transition-all">
        <div className="min-h-screen w-full bg-[#f5f5f7] dark:bg-zinc-950 flex flex-col font-sans overflow-hidden">
          
          {/* Top Sticky Header with SidebarTrigger & Breadcrumbs */}
          <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 md:px-8 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200/80 dark:border-white/5 transform-gpu transition-all">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
              <SidebarTrigger aria-label="Buka Menu Sidebar" className="-ml-1 text-zinc-800 dark:text-zinc-200 hover:bg-black/5 dark:hover:bg-zinc-800 rounded-lg p-1.5 transition-colors shrink-0" />
              <Separator orientation="vertical" className="h-5 bg-zinc-300 dark:bg-zinc-700 shrink-0" />
              <Breadcrumb className="min-w-0 truncate">
                <BreadcrumbList className="flex-nowrap min-w-0 text-xs sm:text-sm">
                  <BreadcrumbItem className="hidden sm:block shrink-0">
                    <BreadcrumbLink href="#" onClick={(e) => { e.preventDefault(); onClose(); }} className="font-semibold text-zinc-900 dark:text-white hover:text-purple-600 transition-colors">
                      Prompt Hub
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden sm:block shrink-0 text-zinc-400" />
                  <BreadcrumbItem className="min-w-0 truncate">
                    <BreadcrumbPage className="capitalize font-medium text-zinc-600 dark:text-zinc-300 truncate">
                      Plans &amp; Pricing
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
              />

              {currentUser ? (
                <button 
                  onClick={() => setShowSignOutConfirm(true)}
                  aria-label="Keluar akun"
                  className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100/90 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900 text-xs font-medium transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
                  title="Keluar Akun"
                >
                  <Logout01Icon size={14} />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              ) : (
                <button 
                  onClick={onOpenAuth}
                  aria-label="Login with Google"
                  className="inline-flex items-center gap-2 h-9 px-4 rounded-full bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 border border-slate-200/80 dark:border-zinc-800 text-xs font-semibold transition-all cursor-pointer shadow-xs hover:shadow-sm active:scale-95 shrink-0 group"
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
          <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8 flex-1 flex flex-col justify-center">
            
            {/* Header with Title on Left and Segmented Toggle on Right */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7 sm:mb-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight mb-1">
                  {billingMode === 'subscription' ? 'Paket & Langganan' : 'Atur Kredit Sendiri'}
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm font-normal">
                  {billingMode === 'subscription' 
                    ? 'Pilih langganan bulanan hemat untuk kuota kredit rutin dan akses fitur AI tanpa hambatan.'
                    : 'Geser slider untuk menentukan jumlah kredit yang Anda butuhkan secara fleksibel.'}
                </p>
              </div>

              {/* Segmented Switch Toggle with Sliding Motion Pill */}
              <div className="relative inline-flex items-center p-1 rounded-full bg-zinc-200/70 dark:bg-zinc-800/80 border border-zinc-300/40 dark:border-zinc-700/50 shrink-0 self-start sm:self-auto shadow-2xs">
                <button
                  type="button"
                  onClick={() => setBillingMode('subscription')}
                  className={`relative z-10 px-4 py-1.5 rounded-full text-xs transition-colors duration-200 cursor-pointer select-none ${
                    billingMode === 'subscription'
                      ? 'text-zinc-900 dark:text-white font-bold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-medium'
                  }`}
                >
                  {billingMode === 'subscription' && (
                    <motion.div
                      layoutId="activeBillingPill"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      className="absolute inset-0 bg-white dark:bg-zinc-900 rounded-full shadow-xs -z-10"
                    />
                  )}
                  Paket Langganan
                </button>
                <button
                  type="button"
                  onClick={() => setBillingMode('topup')}
                  className={`relative z-10 px-4 py-1.5 rounded-full text-xs transition-colors duration-200 cursor-pointer select-none ${
                    billingMode === 'topup'
                      ? 'text-zinc-900 dark:text-white font-bold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-medium'
                  }`}
                >
                  {billingMode === 'topup' && (
                    <motion.div
                      layoutId="activeBillingPill"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      className="absolute inset-0 bg-white dark:bg-zinc-900 rounded-full shadow-xs -z-10"
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
          <AlertDialogContent className="max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xl">
            <AlertDialogHeader className="flex flex-col gap-2">
              <AlertDialogTitle className="text-base font-bold text-zinc-900 dark:text-white">
                Konfirmasi Keluar Akun
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs text-zinc-600 dark:text-zinc-400">
                Apakah Anda yakin ingin keluar dari akun Anda? Anda dapat masuk kembali kapan saja untuk mengakses kredit dan riwayat prompt Anda.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="w-full flex flex-row items-center justify-end gap-2.5 pt-4">
              <AlertDialogCancel 
                onClick={() => setShowSignOutConfirm(false)}
                className="h-9 px-4 rounded-full border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
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
