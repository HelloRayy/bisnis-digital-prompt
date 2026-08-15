import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft01Icon, CheckmarkCircle02Icon, SparklesIcon, Cancel01Icon, StarIcon, Ticket01Icon } from 'hugeicons-react';
import { toast } from 'sonner';

/* High-Performance Lightweight Shimmer Button */
function ShimmerButton({ children, onClick, className = "", isPopular = false, isFree = false }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`relative inline-flex w-full items-center justify-center rounded-full p-[1.5px] transition-all duration-200 cursor-pointer active:scale-98 group ${className} ${
        isFree
          ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30'
          : isPopular
            ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 shadow-md shadow-purple-500/25 hover:shadow-purple-500/35'
            : 'bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-700'
      }`}
    >
      <span className={`relative z-10 w-full inline-flex items-center justify-center rounded-full py-3 px-6 text-xs font-bold transition-all duration-200 ${
        isFree
          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
          : isPopular
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
  const [voucherInput, setVoucherInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState('');

  const navigateToCheckout = (planSlug) => {
    const checkoutUrl = `/checkout/${planSlug}`;
    window.history.pushState({}, '', checkoutUrl);
    window.dispatchEvent(new Event('popstate'));
  };

  const handleApplyVoucher = (e) => {
    if (e) e.preventDefault();
    setVoucherError('');

    const cleanCode = voucherInput.trim().toUpperCase();
    if (!cleanCode) {
      setVoucherError('Masukkan kode voucher terlebih dahulu.');
      return;
    }

    if (cleanCode === 'KEPAL2') {
      setAppliedVoucher('KEPAL2');
      toast.success('🎉 Voucher KEPAL2 Berhasil Digunakan! Diskon 100% (Harga Menjadi Rp 0 / Gratis)');
    } else {
      setVoucherError('Kode voucher tidak valid atau telah kedaluwarsa.');
      toast.error('Kode voucher tidak valid.');
    }
  };

  const handleClaimFreeVoucher = (creditAmount = 4000) => {
    onTopUp(creditAmount);
    setSuccessMsg(`🎉 Selamat! Voucher KEPAL2 berhasil mengklaim ${creditAmount.toLocaleString('id-ID')} Kredit secara GRATIS!`);
    toast.success(`+${creditAmount.toLocaleString('id-ID')} Kredit Gratis Berhasil Ditambahkan!`);
    setAppliedVoucher(null);
    setVoucherInput('');
  };

  const isFreeVoucherActive = appliedVoucher === 'KEPAL2';

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Voucher Input Box */}
      <div className="rounded-2xl border border-purple-200/80 bg-purple-50/40 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Ticket01Icon size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-obsidian tracking-tight">Punya Kode Voucher Promo?</h4>
            <p className="text-[11px] text-zinc-500 font-medium">Gunakan kode <code className="bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-bold">KEPAL2</code> untuk mendapatkan paket gratis.</p>
          </div>
        </div>

        <form onSubmit={handleApplyVoucher} className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <input
            type="text"
            value={voucherInput}
            onChange={(e) => setVoucherInput(e.target.value)}
            placeholder="Kode Voucher (ex: KEPAL2)"
            className="h-9 px-3 text-xs bg-white text-obsidian border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 uppercase font-mono font-bold w-full sm:w-48 placeholder:normal-case placeholder:font-sans"
          />
          <button
            type="submit"
            className="h-9 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-xs active:scale-95"
          >
            Terapkan
          </button>
        </form>
      </div>

      {voucherError && (
        <p className="text-xs text-rose-600 font-semibold -mt-3 ml-1">{voucherError}</p>
      )}

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

      {/* Active Voucher Notice */}
      {isFreeVoucherActive && (
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <SparklesIcon size={16} className="fill-white" />
            <span>Voucher KEPAL2 Aktif: Semua Paket Berbayar Menjadi Rp 0 (100% FREE)!</span>
          </div>
          <button onClick={() => setAppliedVoucher(null)} className="text-emerald-100 hover:text-white underline text-[11px] cursor-pointer">
            Batalkan
          </button>
        </div>
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
        <div className={`relative rounded-2xl border-2 ${isFreeVoucherActive ? 'border-emerald-500 shadow-emerald-500/10' : 'border-purple-600 shadow-purple-500/10'} bg-white p-6 md:p-7 flex flex-col justify-between shadow-lg transition-colors duration-200`}>
          {/* Top Right Popular Badge */}
          <div className={`absolute -top-3.5 right-5 ${isFreeVoucherActive ? 'bg-emerald-600' : 'bg-purple-600'} text-white text-[11px] font-semibold px-3.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm`}>
            <StarIcon size={12} className="fill-white text-white" />
            <span>{isFreeVoucherActive ? 'Voucher KEPAL2 (100% Free)' : 'Paling Populer'}</span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3 mt-1">
              <h3 className={`text-xs font-bold tracking-wider uppercase ${isFreeVoucherActive ? 'text-emerald-700' : 'text-purple-600'}`}>
                Pro Artist (10k)
              </h3>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${isFreeVoucherActive ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-purple-100 text-purple-700 border-purple-300'}`}>
                +4.000 Kredit
              </span>
            </div>
            
            <div className="mb-0.5 flex items-baseline gap-2">
              {isFreeVoucherActive ? (
                <>
                  <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600 tracking-tight">Rp 0</span>
                  <span className="text-zinc-400 line-through text-sm font-semibold">Rp 10.000</span>
                  <span className="text-emerald-700 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded">FREE</span>
                </>
              ) : (
                <>
                  <span className="text-3xl sm:text-4xl font-semibold text-obsidian tracking-tight">Rp 10.000</span>
                  <span className="text-zinc-500 text-xs font-medium"> / top-up</span>
                </>
              )}
            </div>
            <p className="text-xs text-purple-600 font-medium mb-4">Nilai terbaik (Bonus +25% ekstra saldo)</p>

            <ul className="space-y-2 text-xs text-zinc-800 mb-6 font-medium">
              <li className="flex items-center gap-2">
                <CheckmarkCircle02Icon size={15} className={isFreeVoucherActive ? "text-emerald-600 shrink-0" : "text-purple-600 shrink-0"} />
                <span className="font-bold text-obsidian">4.000 Kredit tanpa kedaluwarsa</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckmarkCircle02Icon size={15} className={isFreeVoucherActive ? "text-emerald-600 shrink-0" : "text-purple-600 shrink-0"} />
                <span>Buka seluruh Prompt Visual, Motion & Web 4K</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckmarkCircle02Icon size={15} className={isFreeVoucherActive ? "text-emerald-600 shrink-0" : "text-purple-600 shrink-0"} />
                <span>Akses Prompt Customizer & Style Remix</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckmarkCircle02Icon size={15} className={isFreeVoucherActive ? "text-emerald-600 shrink-0" : "text-purple-600 shrink-0"} />
                <span>Dukungan prioritas & aktivasi instan</span>
              </li>
            </ul>
          </div>

          <div>
            {isFreeVoucherActive ? (
              <ShimmerButton
                isFree={true}
                onClick={() => handleClaimFreeVoucher(4000)}
              >
                <span>Klaim 4.000 Kredit Gratis (Rp 0)</span>
                <SparklesIcon size={14} className="text-white fill-white" />
              </ShimmerButton>
            ) : (
              <ShimmerButton
                isPopular={true}
                onClick={() => navigateToCheckout('10k')}
              >
                <span>Beli Rp 10.000</span>
                <SparklesIcon size={14} className="text-purple-200 fill-purple-200" />
              </ShimmerButton>
            )}
            <p className="text-[10px] text-zinc-500 font-medium text-center mt-2">
              {isFreeVoucherActive ? 'Kredit langsung ditambahkan ke akun Anda' : 'Pilihan terbaik untuk kreator & desainer aktif'}
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
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                +1.500 Kredit
              </span>
            </div>
            
            <div className="mb-0.5 flex items-baseline gap-2">
              {isFreeVoucherActive ? (
                <>
                  <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">Rp 0</span>
                  <span className="text-zinc-400 line-through text-sm font-semibold">Rp 5.000</span>
                </>
              ) : (
                <>
                  <span className="text-2xl sm:text-3xl font-semibold text-obsidian tracking-tight">Rp 5.000</span>
                  <span className="text-zinc-500 text-xs font-medium"> / top-up</span>
                </>
              )}
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
            {isFreeVoucherActive ? (
              <ShimmerButton
                isFree={true}
                onClick={() => handleClaimFreeVoucher(1500)}
              >
                <span>Klaim 1.500 Kredit Gratis (Rp 0)</span>
              </ShimmerButton>
            ) : (
              <ShimmerButton
                isPopular={false}
                onClick={() => navigateToCheckout('5k')}
              >
                <span>Beli Rp 5.000</span>
              </ShimmerButton>
            )}
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
        <div className="text-center max-w-2xl mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-obsidian tracking-tight">
            Pilih Paket Berlangganan
          </h1>
          <p className="text-zinc-500 text-base sm:text-lg mt-3">
            Tingkatkan produktivitas tim Anda dengan akses tanpa batas ke seluruh prompt eksklusif & fitur kecerdasan buatan.
          </p>
        </div>

        {/* Reusable Subscription Cards with Voucher KEPAL2 */}
        <SubscriptionCards userCredits={userCredits} onTopUp={onTopUp} isPanel={false} />
      </main>
    </div>
  );
}
