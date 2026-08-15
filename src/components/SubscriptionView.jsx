import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft01Icon, 
  CheckmarkCircle02Icon, 
  SparklesIcon, 
  Cancel01Icon, 
  StarIcon,
  Logout01Icon,
  CreditCardIcon,
  ShieldCheck01Icon,
  HelpCircleIcon
} from 'hugeicons-react';
import { 
  Coins, 
  Zap, 
  Lock, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Sparkles, 
  ArrowRight 
} from 'lucide-react';
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

/* High-Performance Lightweight Shimmer Button */
function ShimmerButton({ children, onClick, className = "", isPopular = false }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`relative inline-flex w-full items-center justify-center rounded-full p-[1.5px] transition-all duration-200 cursor-pointer active:scale-98 group ${className} ${
        isPopular
          ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 shadow-md shadow-purple-500/25 hover:shadow-purple-500/35'
          : 'bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-700'
      }`}
    >
      <span className={`relative z-10 w-full inline-flex items-center justify-center rounded-full py-3 px-6 text-xs font-bold transition-all duration-200 ${
        isPopular
          ? 'bg-purple-600 text-white hover:bg-purple-700'
          : 'bg-zinc-900 text-white hover:bg-black dark:bg-zinc-800'
      }`}>
        <span className="flex items-center justify-center gap-2 tracking-wide font-sans">
          {children}
        </span>
      </span>
    </button>
  );
}

export function SubscriptionCards({ userCredits = 0, onTopUp = () => {}, isPanel = false }) {
  const [successMsg, setSuccessMsg] = useState('');

  const navigateToCheckout = (planSlug) => {
    const checkoutUrl = `/checkout/${planSlug}`;
    window.history.pushState({}, '', checkoutUrl);
    window.dispatchEvent(new Event('popstate'));
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Success Alert Banner */}
      {successMsg && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-xs"
        >
          <div className="flex items-center gap-2">
            <CheckmarkCircle02Icon size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 cursor-pointer">
            <Cancel01Icon size={14} />
          </button>
        </motion.div>
      )}

      {/* Pricing Cards Container (Stack vertically in panel mode, 3-column in full mode) */}
      <div className={isPanel ? "flex flex-col gap-4 w-full" : "grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 w-full items-stretch"}>
        
        {/* 1. STARTER PLAN CARD */}
        <div className="relative rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-7 flex flex-col justify-between hover:border-purple-300 dark:hover:border-purple-800/60 hover:bg-purple-50/10 transition-all duration-200 shadow-xs">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold tracking-wider text-zinc-700 dark:text-zinc-300 uppercase">
                Starter Plan
              </h3>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                +100 Kredit
              </span>
            </div>
            
            <div className="mb-0.5">
              <span className="text-2xl sm:text-3xl font-semibold text-obsidian dark:text-white tracking-tight">Rp 0</span>
              <span className="text-zinc-500 text-xs font-medium"> / gratis</span>
            </div>
            <p className="text-[11px] text-zinc-400 mb-5 font-medium">Saldo awal gratis untuk eksplorasi platform</p>

            <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300 mb-6 font-medium">
              <li className="flex items-center gap-2">
                <CheckmarkCircle02Icon size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>100 Kredit gratis pendaftaran</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckmarkCircle02Icon size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Akses koleksi prompt terbuka</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckmarkCircle02Icon size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Fitur pencarian & penyaring dasar</span>
              </li>
            </ul>
          </div>

          <div>
            <button
              disabled={true}
              className="w-full py-2.5 px-4 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 text-xs font-semibold cursor-default"
            >
              Paket Aktif (Default)
            </button>
            <p className="text-[10px] text-zinc-400 text-center mt-2 font-medium">
              Otomatis aktif untuk semua pengguna baru
            </p>
          </div>
        </div>

        {/* 2. 10K PLAN CARD (Center Card / Paling Populer - Rp 10.000 -> 4.000 Kredit) */}
        <div className="relative rounded-3xl border-2 border-purple-600 dark:border-purple-500 shadow-purple-500/10 bg-white dark:bg-zinc-900 p-6 sm:p-7 flex flex-col justify-between shadow-lg transition-colors duration-200 ring-2 ring-purple-500/20">
          {/* Top Right Popular Badge */}
          <div className="absolute -top-3.5 right-5 bg-purple-600 text-white text-[11px] font-bold px-3.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            <StarIcon size={12} className="fill-white text-white" />
            <span>Paling Populer</span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3 mt-1">
              <h3 className="text-xs font-bold tracking-wider uppercase text-purple-600 dark:text-purple-400">
                Pro Artist (10k)
              </h3>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full border bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800">
                +4.000 Kredit
              </span>
            </div>
            
            <div className="mb-0.5 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-semibold text-obsidian dark:text-white tracking-tight">Rp 10.000</span>
              <span className="text-zinc-500 text-xs font-medium"> / top-up</span>
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mb-5">Nilai terbaik (Bonus +25% ekstra saldo)</p>

            <ul className="space-y-2.5 text-xs text-zinc-800 dark:text-zinc-200 mb-6 font-medium">
              <li className="flex items-center gap-2">
                <CheckmarkCircle02Icon size={15} className="text-purple-600 dark:text-purple-400 shrink-0" />
                <span className="font-bold text-obsidian dark:text-white">4.000 Kredit tanpa kedaluwarsa</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckmarkCircle02Icon size={15} className="text-purple-600 dark:text-purple-400 shrink-0" />
                <span>Buka seluruh Prompt Visual, Motion & Web 4K</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckmarkCircle02Icon size={15} className="text-purple-600 dark:text-purple-400 shrink-0" />
                <span>Akses Prompt Customizer & Style Remix</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckmarkCircle02Icon size={15} className="text-purple-600 dark:text-purple-400 shrink-0" />
                <span>Dukungan prioritas & aktivasi instan</span>
              </li>
            </ul>
          </div>

          <div>
            <ShimmerButton
              isPopular={true}
              onClick={() => navigateToCheckout('10k')}
            >
              <span>Beli Rp 10.000</span>
              <SparklesIcon size={14} className="text-purple-200 fill-purple-200" />
            </ShimmerButton>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium text-center mt-2">
              Pilihan terbaik untuk kreator & desainer aktif
            </p>
          </div>
        </div>

        {/* 3. 5K PLAN CARD (Rp 5.000 -> 1.500 Kredit) */}
        <div className="relative rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-7 flex flex-col justify-between hover:border-purple-300 dark:hover:border-purple-800/60 hover:bg-purple-50/10 transition-all duration-200 shadow-xs">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold tracking-wider text-zinc-700 dark:text-zinc-300 uppercase">
                Basic Top-Up (5k)
              </h3>
              <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                +1.500 Kredit
              </span>
            </div>
            
            <div className="mb-0.5">
              <span className="text-2xl sm:text-3xl font-semibold text-obsidian dark:text-white tracking-tight">Rp 5.000</span>
              <span className="text-zinc-500 text-xs font-medium"> / top-up</span>
            </div>
            <p className="text-[11px] text-zinc-400 mb-5 font-medium">Pengisian saldo hemat dan terjangkau</p>

            <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300 mb-6 font-medium">
              <li className="flex items-center gap-2">
                <CheckmarkCircle02Icon size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>1.500 Kredit tanpa kedaluwarsa</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckmarkCircle02Icon size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Buka prompt gambar pilihan</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckmarkCircle02Icon size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Aktivasi langsung ke akun</span>
              </li>
            </ul>
          </div>

          <div>
            <button
              onClick={() => navigateToCheckout('5k')}
              className="w-full py-2.5 px-4 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-750 text-obsidian dark:text-zinc-100 text-xs font-bold transition-all duration-200 cursor-pointer shadow-xs active:scale-98"
            >
              Beli Rp 5.000
            </button>
            <p className="text-[10px] text-zinc-400 text-center mt-2 font-medium">
              Pengisian saldo cepat untuk kebutuhan dasar
            </p>
          </div>
        </div>

      </div>
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
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: "Bagaimana cara pengisian kredit dilakukan?",
      a: "Pilih paket yang diinginkan (10k atau 5k), lalu scan QRIS yang muncul menggunakan aplikasi perbankan atau e-wallet (GoPay, OVO, DANA, BCA, Mandiri, dll). Saldo akan langsung bertambah otomatis dalam hitungan detik."
    },
    {
      q: "Apakah kredit memiliki batas masa kedaluwarsa?",
      a: "Tidak ada! Semua kredit yang Anda miliki bersifat permanen (seumur hidup) dan tidak pernah hangus."
    },
    {
      q: "Untuk apa saja kredit ini dapat digunakan?",
      a: "Kredit dapat digunakan untuk membuka prompt premium resolusi tinggi, salin kode visual 4K, kustomisasi variabel prompt (Prompt Customizer), dan remix gaya AI."
    }
  ];

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
        <div className="relative min-h-screen w-full bg-[#fafafa] dark:bg-zinc-950 flex flex-col font-sans">
          
          {/* Top Sticky Header with SidebarTrigger & Breadcrumbs */}
          <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 md:px-8 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-black/5 dark:border-white/5 transform-gpu transition-all">
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
                    <BreadcrumbPage className="capitalize font-semibold text-black/70 dark:text-zinc-300 truncate">
                      Paket Langganan & Top Up
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
          <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pt-8 md:pt-12 pb-24 flex flex-col items-center">
            
            {/* Hero Section */}
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-xs font-bold mb-4 border border-purple-200/80 dark:border-purple-800/80 shadow-2xs">
                <SparklesIcon size={14} className="fill-purple-200 dark:fill-purple-900" />
                <span>Kredit & Paket Langganan</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-obsidian dark:text-white tracking-tight leading-tight mb-4">
                Buka Kreativitas Tanpa Batas dengan Kredit Prompt
              </h1>
              
              <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base font-medium">
                Pilih paket pengisian kredit sesuai kebutuhan Anda. Kredit berlaku selamanya tanpa batas waktu kedaluwarsa.
              </p>
            </div>

            {/* Pricing Cards */}
            <SubscriptionCards userCredits={userCredits} onTopUp={onTopUp} isPanel={false} />

            {/* Value Pillars Banner */}
            <div className="mt-14 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs flex flex-col gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Zap size={18} />
                </div>
                <h4 className="text-xs font-bold text-obsidian dark:text-white">Aktivasi Instan</h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Saldo kredit otomatis masuk detik itu juga setelah pembayaran.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs flex flex-col gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <ShieldCheck01Icon size={18} />
                </div>
                <h4 className="text-xs font-bold text-obsidian dark:text-white">Kredit Permanen</h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Saldo tidak memiliki masa berlaku dan berlaku selamanya.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs flex flex-col gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <CreditCardIcon size={18} />
                </div>
                <h4 className="text-xs font-bold text-obsidian dark:text-white">QRIS Nasional</h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Mendukung GoPay, OVO, DANA, ShopeePay, dan seluruh m-Banking.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs flex flex-col gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Lock size={18} />
                </div>
                <h4 className="text-xs font-bold text-obsidian dark:text-white">Bebas Biaya Admin</h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Harga final tanpa potongan atau biaya tersembunyi apapun.</p>
              </div>
            </div>

            {/* Quick FAQ Section */}
            <div className="mt-12 w-full max-w-3xl flex flex-col gap-3">
              <h3 className="text-sm font-bold text-obsidian dark:text-white text-center mb-2">
                Pertanyaan Umum Seputar Kredit
              </h3>
              {faqs.map((faq, idx) => (
                <div 
                  key={idx}
                  className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-4 flex items-center justify-between text-xs font-bold text-obsidian dark:text-zinc-200 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {openFaq === idx ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-4 text-xs text-zinc-600 dark:text-zinc-400 font-medium border-t border-zinc-100 dark:border-zinc-800 pt-2.5">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </main>
        </div>
      </SidebarInset>

      {/* Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <AlertDialog open={showSignOutConfirm} onOpenChange={setShowSignOutConfirm}>
          <AlertDialogContent className="max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xl">
            <AlertDialogHeader className="flex flex-col gap-2">
              <AlertDialogTitle className="text-base font-bold text-obsidian dark:text-white">
                Konfirmasi Keluar Akun
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
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
