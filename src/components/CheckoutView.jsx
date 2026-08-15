import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft01Icon, CheckmarkCircle02Icon, SparklesIcon, RefreshIcon, Clock01Icon, CreditCardIcon } from 'hugeicons-react';
import { createGenPayQris, checkGenPayTransactionStatus } from '@/lib/genpay';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const PLANS_MAP = {
  '10k': {
    id: '10k',
    name: 'Pro Artist (10k)',
    credits: 4000,
    priceIdr: 10000,
    priceUsd: 0.67,
    tag: 'Paling Populer',
    desc: 'Bonus +25% Ekstra Saldo'
  },
  '5k': {
    id: '5k',
    name: 'Basic Top-Up (5k)',
    credits: 1500,
    priceIdr: 5000,
    priceUsd: 0.33,
    tag: 'Top-Up Cepat',
    desc: 'Pengisian saldo hemat'
  },
  'starter': {
    id: 'starter',
    name: 'Starter Plan',
    credits: 100,
    priceIdr: 0,
    priceUsd: 0,
    tag: 'Gratis',
    desc: 'Saldo awal gratis'
  }
};

export default function CheckoutView({
  planId = '10k',
  userCredits = 0,
  currentUser = null,
  onNavigate = () => {},
  onPaymentSuccess = () => {}
}) {
  const plan = PLANS_MAP[planId] || PLANS_MAP['10k'];

  // Form State
  const [email, setEmail] = useState(currentUser?.email || '');
  const [fullName, setFullName] = useState(currentUser?.user_metadata?.full_name || '');
  const [phone, setPhone] = useState('');

  // Payment & QRIS State
  const [isGenerating, setIsGenerating] = useState(true);
  const [qrisData, setQrisData] = useState(null);
  const [status, setStatus] = useState('pending'); // 'pending' | 'paid' | 'expired'
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [lastCheckTime, setLastCheckTime] = useState(null);
  const [voucherCode, setVoucherCode] = useState('');
  const [isVoucherApplied, setIsVoucherApplied] = useState(false);
  const [voucherError, setVoucherError] = useState('');
  
  const pollingRef = useRef(null);
  const timerRef = useRef(null);

  // Initialize GenPay QRIS transaction
  useEffect(() => {
    let isMounted = true;
    async function initQris() {
      setIsGenerating(true);
      const orderId = `ORD-GP-${Date.now()}`;
      const description = `Checkout Paket ${plan.name} (${plan.credits.toLocaleString('id-ID')} Kredit)`;
      
      const res = await createGenPayQris({
        amount: plan.priceIdr || 5000,
        orderId,
        description
      });

      if (isMounted) {
        setQrisData(res);
        setIsGenerating(false);
      }
    }

    initQris();
    return () => { isMounted = false; };
  }, [planId]);

  // Timer countdown
  useEffect(() => {
    setTimeLeft(15 * 60);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setStatus('expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [planId]);

  // Real-time 3-second Auto-Polling loop (GET /transactions/:id)
  useEffect(() => {
    if (!qrisData?.transactionId || status === 'paid' || status === 'expired') {
      return;
    }

    const pollStatus = async () => {
      setLastCheckTime(new Date().toLocaleTimeString());
      const res = await checkGenPayTransactionStatus(qrisData.transactionId);
      if (res.isPaid) {
        setStatus('paid');
        clearInterval(pollingRef.current);
        onPaymentSuccess(plan.credits);
      }
    };

    pollStatus();
    pollingRef.current = setInterval(pollStatus, 3000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [qrisData, status, plan.credits]);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSimulatePayment = () => {
    setStatus('paid');
    if (pollingRef.current) clearInterval(pollingRef.current);
    onPaymentSuccess(plan.credits);
  };

  const handleApplyVoucher = (e) => {
    if (e) e.preventDefault();
    setVoucherError('');
    if (voucherCode.trim().toUpperCase() === 'KEPAL2') {
      setIsVoucherApplied(true);
    } else {
      setVoucherError('Kode voucher tidak valid.');
    }
  };

  const handleClaimFree = () => {
    setStatus('paid');
    if (pollingRef.current) clearInterval(pollingRef.current);
    onPaymentSuccess(plan.credits);
  };

  return (
    <div className="min-h-screen bg-white text-obsidian font-sans flex flex-col selection:bg-purple-100 selection:text-purple-900">
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-black/5 py-4 px-6 md:px-10 flex items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('/subscription')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f4f4f5] hover:bg-black/5 text-obsidian text-sm font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft01Icon size={18} />
          <span>Kembali ke Pilihan Paket</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold flex items-center gap-1.5">
            <SparklesIcon size={14} className="text-purple-600 fill-purple-200" />
            <span>Kredit Anda: {Number(userCredits).toLocaleString('id-ID')}</span>
          </div>
        </div>
      </header>

      {/* Main 2-Column Checkout Layout */}
      <main className="max-w-6xl mx-auto w-full px-6 md:px-10 py-8 md:py-12 flex-1">
        {status === 'paid' ? (
          /* PAYMENT SUCCESS FULL VIEW */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto py-16 text-center flex flex-col items-center gap-4 bg-zinc-50 border border-zinc-200 rounded-3xl p-8 shadow-sm"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckmarkCircle02Icon size={44} />
            </div>
            <h2 className="text-3xl font-black text-obsidian tracking-tight">Pembayaran Sukses!</h2>
            <p className="text-sm text-zinc-600">
              Transaksi GenPay terkonfirmasi. Saldo <strong className="text-purple-600">+{plan.credits.toLocaleString('id-ID')} Kredit</strong> telah ditambahkan ke akun Anda.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <Button
                onClick={() => onNavigate('/')}
                className="rounded-full bg-obsidian hover:bg-black text-white text-xs font-bold px-6 py-2.5 cursor-pointer"
              >
                Mulai Gunakan Prompt
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* LEFT COLUMN (Form & QRIS Payment - 7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              
              {/* Section 1: Contact & User Information */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-baseline">
                  <h2 className="text-lg font-bold text-obsidian tracking-tight">Informasi Kontak</h2>
                  <span className="text-xs text-zinc-400">Notifikasi e-receipt & kredit</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-zinc-700">Email Utama</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="h-11 sm:h-12 rounded-xl border-zinc-300 text-sm font-medium px-4 focus-visible:border-purple-600 focus-visible:ring-2 focus-visible:ring-purple-500/20"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-zinc-700">Nama Lengkap</label>
                    <Input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nama Anda"
                      className="h-11 sm:h-12 rounded-xl border-zinc-300 text-sm font-medium px-4 focus-visible:border-purple-600 focus-visible:ring-2 focus-visible:ring-purple-500/20"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-zinc-700">No. WhatsApp (Opsional)</label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0812xxxx"
                      className="h-11 sm:h-12 rounded-xl border-zinc-300 text-sm font-medium px-4 focus-visible:border-purple-600 focus-visible:ring-2 focus-visible:ring-purple-500/20"
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-zinc-100" />

              {/* Section 2: GenPay QRIS Payment Box */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-obsidian tracking-tight flex items-center gap-2">
                    <CreditCardIcon size={20} className="text-purple-600" />
                    <span>Pembayaran QRIS GenPay</span>
                  </h2>
                  <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                    GoPay / OVO / ShopeePay / Bank
                  </span>
                </div>

                {isGenerating ? (
                  <div className="p-12 rounded-2xl border border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center gap-3 text-center">
                    <RefreshIcon size={24} className="animate-spin text-purple-600" />
                    <p className="text-xs font-medium text-zinc-600">Menyiapkan Kode QRIS GenPay Resmi...</p>
                  </div>
                ) : qrisData ? (
                  <div className="p-6 rounded-2xl border border-zinc-200 bg-white flex flex-col items-center text-center shadow-xs">
                    {/* QR Code Container */}
                    <div className="relative w-56 h-56 bg-white p-3 rounded-2xl border-2 border-zinc-900 shadow-md flex items-center justify-center mb-4">
                      <img
                        src={qrisData.qrisUrl}
                        alt="GenPay QRIS Code"
                        className="w-full h-full object-contain rounded-xl"
                      />
                    </div>

                    {/* Timer & Polling */}
                    <div className="flex flex-col gap-2 items-center text-xs">
                      <div className="flex items-center gap-1.5 text-zinc-600 font-medium">
                        <Clock01Icon size={14} className="text-amber-500" />
                        <span>Selesaikan pembayaran dalam: <strong className="text-obsidian font-mono">{formatTimer(timeLeft)}</strong></span>
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-[11px] font-semibold border border-purple-200">
                        <RefreshIcon size={12} className="animate-spin text-purple-600" />
                        <span>Auto-polling GenPay (`GET /transactions` - 3s) {lastCheckTime && `• ${lastCheckTime}`}</span>
                      </div>
                    </div>

                    {/* Fast-track test button */}
                    <div className="w-full mt-6 pt-4 border-t border-zinc-100">
                      <Button
                        onClick={handleSimulatePayment}
                        className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
                      >
                        ⚡ Simulasi Bayar Lunas Instan (GenPay Local)
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>

            </div>

            {/* RIGHT COLUMN (Order Summary Sidebar - 5 Cols) */}
            <div className="lg:col-span-5 bg-zinc-50/90 border border-zinc-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-xs sticky top-24">
              
              <div>
                <h3 className="text-base font-bold text-obsidian mb-4 pb-3 border-b border-zinc-200 flex items-center justify-between">
                  <span>Ringkasan Pesanan</span>
                  <span className="text-xs font-semibold text-purple-600">IDR</span>
                </h3>

                {/* Selected Item Detail Card */}
                <div className="p-4 rounded-2xl bg-white border border-zinc-200 flex items-center justify-between gap-3 mb-6 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                      <SparklesIcon size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-obsidian">{plan.name}</h4>
                      <p className="text-xs text-purple-600 font-medium">+{plan.credits.toLocaleString('id-ID')} Kredit Saldo</p>
                    </div>
                  </div>

                  <span className="text-sm font-bold text-obsidian font-mono">
                    Rp {plan.priceIdr.toLocaleString('id-ID')}
                  </span>
                </div>

                {/* Price Breakdown */}
                <div className="flex flex-col gap-3 text-xs text-zinc-600 font-medium">
                  <div className="flex justify-between items-center">
                    <span>Subtotal Produk</span>
                    <span className="font-mono text-obsidian font-semibold">Rp {plan.priceIdr.toLocaleString('id-ID')}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Biaya Penanganan QRIS</span>
                    <span className="text-emerald-600 font-semibold">Rp 0 (Gratis)</span>
                  </div>

                  {isVoucherApplied && (
                    <div className="flex justify-between items-center text-emerald-600 font-bold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                      <span>Voucher KEPAL2 (100% Free)</span>
                      <span>- Rp {plan.priceIdr.toLocaleString('id-ID')}</span>
                    </div>
                  )}

                  <Separator className="my-1 bg-zinc-200" />

                  <div className="flex justify-between items-center text-sm pt-1">
                    <span className="font-bold text-obsidian">Total Pembayaran</span>
                    <span className={`font-bold text-lg font-mono ${isVoucherApplied ? 'text-emerald-600' : 'text-purple-700'}`}>
                      Rp {isVoucherApplied ? '0' : plan.priceIdr.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Voucher Input Form in Checkout */}
                <div className="mt-5 pt-4 border-t border-zinc-200 flex flex-col gap-2">
                  <span className="text-xs font-bold text-obsidian">Kode Voucher Promo</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      placeholder="Masukkan kode (ex: KEPAL2)"
                      className="h-8 px-3 text-xs bg-white text-obsidian border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/30 uppercase font-mono font-bold flex-1"
                    />
                    <button
                      type="button"
                      onClick={handleApplyVoucher}
                      className="h-8 px-3 rounded-lg bg-zinc-900 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
                    >
                      Terapkan
                    </button>
                  </div>
                  {voucherError && <span className="text-[11px] text-rose-600 font-semibold">{voucherError}</span>}
                  {isVoucherApplied && (
                    <button
                      type="button"
                      onClick={handleClaimFree}
                      className="w-full mt-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                    >
                      🎉 Klaim +{plan.credits.toLocaleString('id-ID')} Kredit Gratis (Rp 0)
                    </button>
                  )}
                </div>
              </div>

              {/* Order Metadata & Security Badge */}
              <div className="pt-4 border-t border-zinc-200 flex flex-col gap-3">
                {qrisData?.transactionId && (
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                    <span>Kode Transaksi:</span>
                    <span className="font-semibold text-zinc-700">{qrisData.transactionId}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-[11px] text-zinc-500 bg-white p-3 rounded-xl border border-zinc-200">
                  <CheckmarkCircle02Icon size={16} className="text-emerald-600 shrink-0" />
                  <span>Pembayaran 100% Terverifikasi Otomatis via GenPay QRIS</span>
                </div>
              </div>

            </div>

          </div>
        )}
      </main>
    </div>
  );
}
