import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft01Icon, CheckmarkCircle02Icon, SparklesIcon, Cancel01Icon, StarIcon } from 'hugeicons-react';
import { createGenPayQris } from '@/lib/genpay';
import QrisPaymentModal from './QrisPaymentModal';

/* Premium Shimmer Button Component with Framer Motion Border Beam */
function ShimmerButton({ children, onClick, className = "", isPopular = false }) {
  return (
    <div className={`relative group inline-flex w-full items-center justify-center p-[2px] overflow-hidden rounded-full font-sans transition-transform duration-200 active:scale-98 cursor-pointer ${className}`}>
      {/* 1. Framer Motion Rotating Conic Light Beam Traveling 360 Degrees */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
        className="absolute -inset-[150%] aspect-square w-[400%] h-[400%] origin-center pointer-events-none"
        style={{
          background: isPopular
            ? 'conic-gradient(from 0deg, transparent 0 280deg, #c084fc 330deg, #ffffff 360deg)'
            : 'conic-gradient(from 0deg, transparent 0 280deg, #a1a1aa 330deg, #ffffff 360deg)'
        }}
      />

      {/* 2. Top Specular Edge Highlight Reflection */}
      <span className="absolute top-0 inset-x-5 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent z-20 pointer-events-none" />

      {/* 3. Inner Dark Glass Button Box */}
      <button
        onClick={onClick}
        className={`relative z-10 w-full inline-flex items-center justify-center rounded-full py-3 px-6 text-xs font-semibold backdrop-blur-2xl transition-all duration-200 cursor-pointer shadow-md ${
          isPopular
            ? 'bg-slate-950 text-white hover:bg-purple-950/90 shadow-purple-900/40'
            : 'bg-zinc-950 text-white hover:bg-zinc-900 shadow-zinc-900/30'
        }`}
      >
        <span className="relative z-10 flex items-center justify-center gap-2 tracking-wide font-sans">
          {children}
        </span>
      </button>
    </div>
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
          className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-xs"
        >
          <div className="flex items-center gap-2">
            <CheckmarkCircle02Icon size={18} className="text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-700 hover:text-emerald-900">
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
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
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
              className="w-full py-2.5 px-4 rounded-full border border-zinc-200 bg-zinc-100 text-zinc-500 text-xs font-medium cursor-default"
            >
              Paket Aktif (Default)
            </button>
            <p className="text-[10px] text-zinc-400 text-center mt-2 font-medium">
              Otomatis aktif untuk semua pengguna baru
            </p>
          </div>
        </div>

        {/* 2. 10K PLAN CARD (Center Card / Paling Populer - Rp 10.000 -> 4.000 Kredit) */}
        <div className="relative rounded-2xl border-2 border-purple-600 bg-white p-6 md:p-7 flex flex-col justify-between shadow-lg shadow-purple-500/10 hover:border-purple-700 transition-colors duration-200">
          {/* Top Right Popular Badge */}
          <div className="absolute -top-3.5 right-5 bg-purple-600 text-white text-[11px] font-medium px-3.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            <StarIcon size={12} className="fill-white text-white" />
            <span>Paling Populer</span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3 mt-1">
              <h3 className="text-xs font-bold tracking-wider text-purple-600 uppercase">
                Pro Artist (10k)
              </h3>
              <span className="text-xs font-medium text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-300">
                +4.000 Kredit
              </span>
            </div>
            
            <div className="mb-0.5">
              <span className="text-3xl sm:text-4xl font-semibold text-obsidian tracking-tight">Rp 10.000</span>
              <span className="text-zinc-500 text-xs font-medium"> / top-up</span>
            </div>
            <p className="text-xs text-purple-600 font-medium mb-4">Nilai terbaik (Bonus +25% ekstra saldo)</p>

            <ul className="space-y-2 text-xs text-zinc-800 mb-6 font-medium">
              <li className="flex items-center gap-2">
                <CheckmarkCircle02Icon size={15} className="text-purple-600 shrink-0" />
                <span className="font-semibold text-obsidian">4.000 Kredit tanpa kedaluwarsa</span>
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
                <span>Dukungan prioritas & QRIS GenPay instan</span>
              </li>
            </ul>
          </div>

          <div>
            <ShimmerButton
              isPopular={true}
              onClick={() => navigateToCheckout('10k')}
            >
              <span>Beli Rp 10.000</span>
              <SparklesIcon size={14} className="text-purple-300 fill-purple-300" />
            </ShimmerButton>
            <p className="text-[10px] text-purple-700 font-medium text-center mt-2">
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
              <span className="text-xs font-medium text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                +1.500 Kredit
              </span>
            </div>
            
            <div className="mb-0.5">
              <span className="text-2xl sm:text-3xl font-semibold text-obsidian tracking-tight">Rp 5.000</span>
              <span className="text-zinc-500 text-xs font-medium"> / top-up</span>
            </div>
            <p className="text-[11px] text-zinc-400 mb-4 font-medium">Pengisian saldo hemat & cepat</p>

            <ul className="space-y-2 text-xs text-zinc-700 mb-6 font-medium">
              <li className="flex items-center gap-2">
                <CheckmarkCircle02Icon size={15} className="text-purple-600 shrink-0" />
                <span>1.500 Kredit tanpa kedaluwarsa</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckmarkCircle02Icon size={15} className="text-purple-600 shrink-0" />
                <span>Buka 70+ Prompt Premium Midjourney & DALL-E</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckmarkCircle02Icon size={15} className="text-purple-600 shrink-0" />
                <span>Salin prompt 1-klik & panduan parameter</span>
              </li>
            </ul>
          </div>

          <div>
            <ShimmerButton
              isPopular={false}
              onClick={() => navigateToCheckout('5k')}
            >
              <span>Beli Rp 5.000</span>
            </ShimmerButton>
            <p className="text-[10px] text-zinc-400 text-center mt-2 font-medium">
              Cocok untuk top-up cepat sesuai kebutuhan
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function SubscriptionView({ onClose, userCredits = 0, onTopUp = () => {} }) {
  return (
    <div className="min-h-screen bg-white text-obsidian font-sans flex flex-col selection:bg-purple-100 selection:text-purple-900">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-black/5 py-4 px-6 md:px-10 flex items-center justify-between gap-4">
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

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto w-full px-6 md:px-10 py-12 flex-1 flex flex-col justify-center items-center">
        {/* Title Header */}
        <div className="text-center max-w-2xl mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-obsidian tracking-tight">
            Pilih Paket Berlangganan
          </h1>
          <p className="text-zinc-500 text-base sm:text-lg mt-3">
            Tingkatkan produktivitas tim Anda dengan akses tanpa batas ke seluruh prompt eksklusif & fitur kecerdasan buatan.
          </p>
        </div>

        {/* Reusable Subscription Cards */}
        <SubscriptionCards userCredits={userCredits} onTopUp={onTopUp} isPanel={false} />
      </main>
    </div>
  );
}
