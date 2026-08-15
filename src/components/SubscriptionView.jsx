import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft01Icon, CheckmarkCircle02Icon, SparklesIcon, Cancel01Icon, StarIcon } from 'hugeicons-react';

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
          className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-xs"
        >
          <div className="flex items-center gap-2">
            <CheckmarkCircle02Icon size={18} className="text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
            <Cancel01Icon size={14} />
          </button>
        </motion.div>
      )}

      {/* Pricing Cards Container (Stack vertically in panel mode, 3-column in full mode) */}
      <div className={isPanel ? "flex flex-col gap-4 w-full" : "grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 w-full items-stretch"}>
        
        {/* 1. STARTER PLAN CARD */}
        <div className="relative rounded-2xl border border-zinc-200 bg-white p-5 md:p-6 flex flex-col justify-between hover:border-purple-300 hover:bg-purple-50/20 transition-colors duration-200 shadow-xs">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold tracking-wider text-zinc-700 uppercase">
                Starter Plan
              </h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                +100 Kredit
              </span>
            </div>
            
            <div className="mb-0.5">
              <span className="text-2xl sm:text-3xl font-semibold text-obsidian tracking-tight">Rp 0</span>
              <span className="text-zinc-500 text-xs font-medium"> / gratis</span>
            </div>
            <p className="text-[11px] text-zinc-400 mb-4 font-medium">Saldo awal gratis untuk eksplorasi platform</p>

            <ul className="space-y-2 text-xs text-zinc-700 mb-6 font-medium">
              <li className="flex items-center gap-2">
                <CheckmarkCircle02Icon size={15} className="text-emerald-600 shrink-0" />
                <span>100 Kredit gratis pendaftaran</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckmarkCircle02Icon size={15} className="text-emerald-600 shrink-0" />
                <span>Akses koleksi prompt terbuka</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckmarkCircle02Icon size={15} className="text-emerald-600 shrink-0" />
                <span>Fitur pencarian & penyaring dasar</span>
              </li>
            </ul>
          </div>

          <div>
            <button
              disabled={true}
              className="w-full py-2.5 px-4 rounded-full border border-zinc-200 bg-zinc-100 text-zinc-500 text-xs font-semibold cursor-default"
            >
              Paket Aktif (Default)
            </button>
            <p className="text-[10px] text-zinc-400 text-center mt-2 font-medium">
              Otomatis aktif untuk semua pengguna baru
            </p>
          </div>
        </div>

        {/* 2. 10K PLAN CARD (Center Card / Paling Populer - Rp 10.000 -> 4.000 Kredit) */}
        <div className="relative rounded-2xl border-2 border-purple-600 shadow-purple-500/10 bg-white p-6 md:p-7 flex flex-col justify-between shadow-lg transition-colors duration-200">
          {/* Top Right Popular Badge */}
          <div className="absolute -top-3.5 right-5 bg-purple-600 text-white text-[11px] font-semibold px-3.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            <StarIcon size={12} className="fill-white text-white" />
            <span>Paling Populer</span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3 mt-1">
              <h3 className="text-xs font-bold tracking-wider uppercase text-purple-600">
                Pro Artist (10k)
              </h3>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full border bg-purple-100 text-purple-700 border-purple-300">
                +4.000 Kredit
              </span>
            </div>
            
            <div className="mb-0.5 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-semibold text-obsidian tracking-tight">Rp 10.000</span>
              <span className="text-zinc-500 text-xs font-medium"> / top-up</span>
            </div>
            <p className="text-xs text-purple-600 font-medium mb-4">Nilai terbaik (Bonus +25% ekstra saldo)</p>

            <ul className="space-y-2 text-xs text-zinc-800 mb-6 font-medium">
              <li className="flex items-center gap-2">
                <CheckmarkCircle02Icon size={15} className="text-purple-600 shrink-0" />
                <span className="font-bold text-obsidian">4.000 Kredit tanpa kedaluwarsa</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckmarkCircle02Icon size={15} className="text-purple-600 shrink-0" />
                <span>Buka seluruh Prompt Visual, Motion & Web 4K</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckmarkCircle02Icon size={15} className="text-purple-600 shrink-0" />
                <span>Akses Prompt Customizer & Style Remix</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckmarkCircle02Icon size={15} className="text-purple-600 shrink-0" />
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
            <p className="text-[10px] text-zinc-500 font-medium text-center mt-2">
              Pilihan terbaik untuk kreator & desainer aktif
            </p>
          </div>
        </div>

        {/* 3. 5K PLAN CARD (Rp 5.000 -> 1.500 Kredit) */}
        <div className="relative rounded-2xl border border-zinc-200 bg-white p-5 md:p-6 flex flex-col justify-between hover:border-purple-300 hover:bg-purple-50/20 transition-colors duration-200 shadow-xs">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold tracking-wider text-zinc-700 uppercase">
                Basic Top-Up (5k)
              </h3>
              <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                +1.500 Kredit
              </span>
            </div>
            
            <div className="mb-0.5">
              <span className="text-2xl sm:text-3xl font-semibold text-obsidian tracking-tight">Rp 5.000</span>
              <span className="text-zinc-500 text-xs font-medium"> / top-up</span>
            </div>
            <p className="text-[11px] text-zinc-400 mb-4 font-medium">Pengisian saldo hemat dan terjangkau</p>

            <ul className="space-y-2 text-xs text-zinc-700 mb-6 font-medium">
              <li className="flex items-center gap-2">
                <CheckmarkCircle02Icon size={15} className="text-emerald-600 shrink-0" />
                <span>1.500 Kredit tanpa kedaluwarsa</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckmarkCircle02Icon size={15} className="text-emerald-600 shrink-0" />
                <span>Buka prompt gambar pilihan</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckmarkCircle02Icon size={15} className="text-emerald-600 shrink-0" />
                <span>Aktivasi langsung ke akun</span>
              </li>
            </ul>
          </div>

          <div>
            <button
              onClick={() => navigateToCheckout('5k')}
              className="w-full py-2.5 px-4 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 text-obsidian text-xs font-bold transition-all duration-200 cursor-pointer shadow-xs active:scale-98"
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

export default function SubscriptionView({ userCredits = 0, onClose = () => {}, onTopUp = () => {} }) {
  return (
    <div className="min-h-screen bg-white text-obsidian font-sans flex flex-col justify-between selection:bg-purple-100 selection:text-purple-900 pb-20">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-black/5 py-4 px-6 md:px-10 flex items-center justify-between gap-4">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f4f4f5] hover:bg-black/5 text-obsidian text-sm font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft01Icon size={18} />
          <span>Kembali ke Galeri</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold flex items-center gap-1.5">
            <SparklesIcon size={14} className="text-purple-600 fill-purple-200" />
            <span>Kredit Anda: {Number(userCredits).toLocaleString('id-ID')}</span>
          </div>
        </div>
      </header>

      {/* Main Content Showcase */}
      <main className="max-w-6xl mx-auto w-full px-6 md:px-10 py-10 md:py-16 flex flex-col items-center">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-4 border border-purple-200/60">
            <SparklesIcon size={14} />
            <span>Kredit & Paket Langganan</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal font-serif text-obsidian tracking-tight leading-tight mb-4">
            Buka Kreativitas Tanpa Batas dengan Kredit Prompt
          </h1>
          <p className="text-ash-gray text-sm sm:text-base font-normal">
            Pilih paket pengisian kredit sesuai kebutuhan Anda. Kredit berlaku selamanya tanpa batas waktu kedaluwarsa.
          </p>
        </div>

        {/* Pricing Cards */}
        <SubscriptionCards userCredits={userCredits} onTopUp={onTopUp} isPanel={false} />
      </main>
    </div>
  );
}
