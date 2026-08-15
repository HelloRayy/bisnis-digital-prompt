import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft01Icon, 
  CheckmarkCircle02Icon, 
  SparklesIcon, 
  RefreshIcon, 
  Clock01Icon, 
  CreditCardIcon,
  Copy01Icon,
  Download01Icon,
  InformationCircleIcon,
  Tick01Icon,
  AlertCircleIcon,
  StarIcon,
  Cancel01Icon,
  ArrowRight01Icon
} from 'hugeicons-react';
import { 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  Lock, 
  QrCode, 
  Check, 
  Copy, 
  Download,
  HelpCircle,
  Coins,
  ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';
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
    tag: 'Paling Populer',
    badge: 'Bonus +25% Saldo',
    desc: 'Nilai terbaik untuk kreator & desainer aktif',
    perks: [
      '4.000 Kredit Saldo Permanen',
      'Buka Semua Prompt Visual & Motion 4K',
      'Akses Prompt Customizer & Style Remix',
      'Aktivasi Instan Otomatis'
    ]
  },
  '5k': {
    id: '5k',
    name: 'Basic Top-Up (5k)',
    credits: 1500,
    priceIdr: 5000,
    tag: 'Top-Up Cepat',
    badge: 'Ekonomis',
    desc: 'Pengisian saldo hemat untuk kebutuhan harian',
    perks: [
      '1.500 Kredit Saldo Permanen',
      'Buka Prompt Gambar Pilihan',
      'Aktivasi Langsung ke Akun',
      'Tanpa Batas Waktu Kedaluwarsa'
    ]
  },
  'starter': {
    id: 'starter',
    name: 'Starter Plan',
    credits: 100,
    priceIdr: 0,
    tag: 'Gratis',
    badge: 'Uji Coba',
    desc: 'Saldo awal eksplorasi untuk pengguna baru',
    perks: [
      '100 Kredit Gratis Pendaftaran',
      'Akses Koleksi Prompt Terbuka',
      'Pencarian & Penyaring Dasar'
    ]
  }
};

const SUPPORTED_PAYMENTS = [
  { name: 'GoPay', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800' },
  { name: 'OVO', color: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-800' },
  { name: 'DANA', color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800' },
  { name: 'ShopeePay', color: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800' },
  { name: 'BCA Mobile', color: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-800' },
  { name: 'Mandiri Livin', color: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-800' },
  { name: 'BRImo', color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800' },
  { name: 'QRIS Semua Bank', color: 'bg-zinc-100 text-zinc-800 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700' }
];

export default function CheckoutView({
  planId = '10k',
  userCredits = 0,
  currentUser = null,
  onNavigate = () => {},
  onPaymentSuccess = () => {}
}) {
  // Selected Plan state (allows switching right inside checkout)
  const [selectedPlanId, setSelectedPlanId] = useState(PLANS_MAP[planId] ? planId : '10k');
  const plan = PLANS_MAP[selectedPlanId] || PLANS_MAP['10k'];

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

  // Voucher Promo State
  const [voucherCode, setVoucherCode] = useState('');
  const [isVoucherApplied, setIsVoucherApplied] = useState(false);
  const [voucherError, setVoucherError] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  // Interactive UI State
  const [showHowToPay, setShowHowToPay] = useState(false);
  const [copiedTrx, setCopiedTrx] = useState(false);
  const [copiedQr, setCopiedQr] = useState(false);
  
  const pollingRef = useRef(null);
  const timerRef = useRef(null);

  // Synchronize when parent prop planId changes
  useEffect(() => {
    if (PLANS_MAP[planId] && planId !== selectedPlanId) {
      setSelectedPlanId(planId);
    }
  }, [planId]);

  // Initialize or Regenerate GenPay QRIS transaction
  const initQrisTransaction = async (activePlan) => {
    setIsGenerating(true);
    setStatus('pending');
    setTimeLeft(15 * 60);
    const orderId = `ORD-GP-${Date.now()}`;
    const description = `Checkout Paket ${activePlan.name} (${activePlan.credits.toLocaleString('id-ID')} Kredit)`;
    
    try {
      const res = await createGenPayQris({
        amount: isVoucherApplied ? 0 : (activePlan.priceIdr || 5000),
        orderId,
        description
      });
      setQrisData(res);
    } catch (e) {
      console.warn('Error generating QRIS:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    initQrisTransaction(plan);
    return () => { isMounted = false; };
  }, [selectedPlanId, isVoucherApplied]);

  // Timer countdown
  useEffect(() => {
    setTimeLeft(15 * 60);
    if (timerRef.current) clearInterval(timerRef.current);

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
  }, [selectedPlanId]);

  // Real-time 3-second Auto-Polling loop (GET /transactions/:id)
  useEffect(() => {
    if (!qrisData?.transactionId || status === 'paid' || status === 'expired') {
      return;
    }

    const pollStatus = async () => {
      const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastCheckTime(nowStr);
      const res = await checkGenPayTransactionStatus(qrisData.transactionId);
      if (res.isPaid) {
        setStatus('paid');
        clearInterval(pollingRef.current);
        onPaymentSuccess(plan.credits);
        toast.success(`Pembayaran Sukses! +${plan.credits.toLocaleString('id-ID')} Kredit berhasil ditambahkan.`);
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

  const handlePlanChange = (newPlanId) => {
    if (newPlanId === selectedPlanId) return;
    setSelectedPlanId(newPlanId);
    window.history.pushState({}, '', `/checkout/${newPlanId}`);
  };

  const handleCopy = (text, type = 'trx') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === 'trx') {
      setCopiedTrx(true);
      setTimeout(() => setCopiedTrx(false), 2000);
      toast.success('Kode Transaksi berhasil disalin ke clipboard');
    } else {
      setCopiedQr(true);
      setTimeout(() => setCopiedQr(false), 2000);
      toast.success('Link QRIS berhasil disalin');
    }
  };

  const handleDownloadQr = () => {
    if (!qrisData?.qrisUrl) return;
    const link = document.createElement('a');
    link.href = qrisData.qrisUrl;
    link.download = `QRIS-GenPay-${plan.name.replace(/\s+/g, '-')}-${Date.now()}.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Mengunduh kode QRIS...');
  };

  const handleSimulatePayment = () => {
    setStatus('paid');
    if (pollingRef.current) clearInterval(pollingRef.current);
    onPaymentSuccess(plan.credits);
    toast.success(`Simulasi Sukses! +${plan.credits.toLocaleString('id-ID')} Kredit telah ditambahkan.`);
  };

  const handleApplyVoucher = (e) => {
    if (e) e.preventDefault();
    setVoucherError('');
    const code = voucherCode.trim().toUpperCase();
    if (code === 'KEPAL2') {
      setIsVoucherApplied(true);
      setAppliedDiscount(plan.priceIdr);
      toast.success('Voucher KEPAL2 berhasil dipasang! Diskon 100% (Gratis)');
    } else if (code === 'DISKON50') {
      setIsVoucherApplied(true);
      setAppliedDiscount(Math.round(plan.priceIdr * 0.5));
      toast.success('Voucher DISKON50 berhasil dipasang! Diskon 50%');
    } else {
      setVoucherError('Kode voucher tidak ditemukan atau sudah kedaluwarsa.');
      toast.error('Kode voucher tidak valid.');
    }
  };

  const handleRemoveVoucher = () => {
    setIsVoucherApplied(false);
    setAppliedDiscount(0);
    setVoucherCode('');
    setVoucherError('');
    toast.info('Voucher promo dihapus.');
  };

  const handleClaimFree = () => {
    setStatus('paid');
    if (pollingRef.current) clearInterval(pollingRef.current);
    onPaymentSuccess(plan.credits);
    toast.success(`Selamat! +${plan.credits.toLocaleString('id-ID')} Kredit berhasil diklaim secara gratis.`);
  };

  const currentFinalPrice = isVoucherApplied 
    ? Math.max(0, plan.priceIdr - appliedDiscount) 
    : plan.priceIdr;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 text-obsidian dark:text-zinc-100 font-sans flex flex-col selection:bg-purple-100 selection:text-purple-900 pb-16">
      
      {/* 1. TOP NAVIGATION & TRUST HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-black/5 dark:border-white/10 py-3.5 px-4 sm:px-6 md:px-10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/subscription')}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f4f4f5] dark:bg-zinc-800 hover:bg-black/5 dark:hover:bg-zinc-700 text-obsidian dark:text-zinc-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft01Icon size={16} />
            <span className="hidden sm:inline">Pilihan Paket</span>
            <span className="sm:hidden">Kembali</span>
          </button>

          <div className="hidden md:flex items-center gap-2 text-xs text-zinc-400 font-medium">
            <span>/</span>
            <span className="text-zinc-600 dark:text-zinc-300 font-semibold">Checkout QRIS</span>
          </div>
        </div>

        {/* Center: Security Badge */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          <Lock size={13} className="text-emerald-600 dark:text-emerald-400" />
          <span>Enkripsi 256-Bit SSL • Transaksi Aman GenPay</span>
        </div>

        {/* Right: Current Balance Badge */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/50 border border-purple-200/80 dark:border-purple-800/80 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <SparklesIcon size={14} className="text-purple-600 dark:text-purple-400 fill-purple-200 dark:fill-purple-900" />
            <span>Kredit Anda: <strong className="font-mono">{Number(userCredits).toLocaleString('id-ID')}</strong></span>
          </div>
        </div>
      </header>

      {/* 2. MAIN CHECKOUT CONTAINER */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 md:px-8 py-8 md:py-12 flex-1">
        
        {status === 'paid' ? (
          /* ============================================================
             CELEBRATORY PAYMENT SUCCESS RECEIPT SCREEN
             ============================================================ */
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col items-center text-center"
          >
            {/* Animated Success Checkmark */}
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckmarkCircle02Icon size={46} />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-white text-[10px] font-black">
                ✨
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800 mb-2">
              <SparklesIcon size={13} />
              <span>Transaksi Terkonfirmasi Lunas</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-obsidian dark:text-white tracking-tight mb-2">
              Pembayaran Berhasil!
            </h1>
            
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mb-6 max-w-md">
              Terima kasih! Saldo sebesar <strong className="text-purple-600 dark:text-purple-400 font-bold">+{plan.credits.toLocaleString('id-ID')} Kredit</strong> telah langsung masuk dan aktif di akun Anda.
            </p>

            {/* Official E-Receipt Box */}
            <div className="w-full bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 text-xs text-left mb-6 font-mono">
              <div className="flex justify-between items-center pb-2.5 border-b border-zinc-200 dark:border-zinc-800 font-sans">
                <span className="font-bold text-obsidian dark:text-zinc-200 text-sm">Bukti Transaksi E-Receipt</span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-100/50 dark:bg-emerald-900/30 px-2 py-0.5 rounded">SUKSES</span>
              </div>

              <div className="flex justify-between items-center text-zinc-600 dark:text-zinc-400">
                <span>No. Transaksi</span>
                <span className="text-obsidian dark:text-zinc-200 font-bold">{qrisData?.transactionId || `TRX-${Date.now()}`}</span>
              </div>

              <div className="flex justify-between items-center text-zinc-600 dark:text-zinc-400">
                <span>Paket Layanan</span>
                <span className="text-obsidian dark:text-zinc-200 font-semibold">{plan.name}</span>
              </div>

              <div className="flex justify-between items-center text-zinc-600 dark:text-zinc-400">
                <span>Kredit Didapat</span>
                <span className="text-purple-600 dark:text-purple-400 font-bold">+{plan.credits.toLocaleString('id-ID')} Kredit</span>
              </div>

              <div className="flex justify-between items-center text-zinc-600 dark:text-zinc-400">
                <span>Metode Pembayaran</span>
                <span className="text-obsidian dark:text-zinc-200 font-medium">QRIS GenPay Instant</span>
              </div>

              <div className="flex justify-between items-center text-zinc-600 dark:text-zinc-400">
                <span>Waktu Pembayaran</span>
                <span className="text-obsidian dark:text-zinc-200">{new Date().toLocaleString('id-ID')}</span>
              </div>

              <div className="flex justify-between items-center pt-2.5 border-t border-zinc-200 dark:border-zinc-800 text-sm font-bold font-sans">
                <span className="text-obsidian dark:text-white">Total Terbayar</span>
                <span className="text-purple-600 dark:text-purple-400 font-mono">
                  Rp {currentFinalPrice.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              <button
                onClick={() => navigateToHome()}
                className="w-full py-3 rounded-full bg-gradient-to-b from-zinc-800 to-zinc-950 text-white border border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22),0_2px_4px_0_rgba(0,0,0,0.4)] hover:from-zinc-750 hover:to-zinc-900 text-xs sm:text-sm font-bold cursor-pointer transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <span>Mulai Jelajahi & Buka Prompt</span>
                <ArrowRight01Icon size={16} />
              </button>

              <button
                onClick={() => onNavigate('/subscription')}
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-750 text-obsidian dark:text-zinc-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                Kembali ke Paket
              </button>
            </div>
          </motion.div>
        ) : (
          /* ============================================================
             ACTIVE CHECKOUT 2-COLUMN LAYOUT
             ============================================================ */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* ------------------------------------------------------------
                LEFT COLUMN: Plan Switcher, Contact Info, & QRIS Terminal (7 Cols)
               ------------------------------------------------------------ */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* STEP 1: INTERACTIVE PLAN SWITCHER (Pilih / Konfirmasi Paket) */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center justify-center">
                      1
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-obsidian dark:text-white tracking-tight">
                      Pilihan Paket Kredit
                    </h2>
                  </div>
                  <span className="text-xs text-zinc-400 font-medium">Bisa diganti langsung</span>
                </div>

                {/* Plan Toggle Selector Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Option 1: 10K Plan (Pro Artist - Recommended) */}
                  <div
                    onClick={() => handlePlanChange('10k')}
                    className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                      selectedPlanId === '10k'
                        ? 'border-purple-600 bg-purple-50/20 dark:bg-purple-950/20 ring-2 ring-purple-500/20 shadow-sm'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                            Pro Artist (10k)
                          </h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                            Bonus +25%
                          </span>
                        </div>
                        <div className="text-lg font-bold text-obsidian dark:text-white font-mono">
                          Rp 10.000
                        </div>
                      </div>

                      {selectedPlanId === '10k' ? (
                        <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-zinc-300 dark:border-zinc-700 shrink-0" />
                      )}
                    </div>

                    <div className="text-xs font-semibold text-purple-700 dark:text-purple-300 flex items-center gap-1">
                      <SparklesIcon size={13} className="fill-purple-300 dark:fill-purple-800" />
                      <span>+4.000 Kredit Saldo</span>
                    </div>
                  </div>

                  {/* Option 2: 5K Plan (Basic Top-Up) */}
                  <div
                    onClick={() => handlePlanChange('5k')}
                    className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                      selectedPlanId === '5k'
                        ? 'border-purple-600 bg-purple-50/20 dark:bg-purple-950/20 ring-2 ring-purple-500/20 shadow-sm'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                            Basic Top-Up (5k)
                          </h3>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                            Hemat
                          </span>
                        </div>
                        <div className="text-lg font-bold text-obsidian dark:text-white font-mono">
                          Rp 5.000
                        </div>
                      </div>

                      {selectedPlanId === '5k' ? (
                        <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-zinc-300 dark:border-zinc-700 shrink-0" />
                      )}
                    </div>

                    <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                      <Coins size={13} className="text-purple-600 dark:text-purple-400" />
                      <span>+1.500 Kredit Saldo</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* STEP 2: INFORMASI KONTAK & E-RECEIPT */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-xs flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center justify-center">
                      2
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-obsidian dark:text-white tracking-tight">
                      Informasi Kontak
                    </h2>
                  </div>
                  <span className="text-[11px] text-zinc-400">Untuk bukti e-receipt & notifikasi</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Email Akun <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="h-11 rounded-xl border-zinc-300 dark:border-zinc-700 text-sm font-medium px-4 focus-visible:border-purple-600 focus-visible:ring-2 focus-visible:ring-purple-500/20 bg-white dark:bg-zinc-950"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Nama Lengkap
                    </label>
                    <Input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nama Lengkap Anda"
                      className="h-11 rounded-xl border-zinc-300 dark:border-zinc-700 text-sm font-medium px-4 focus-visible:border-purple-600 focus-visible:ring-2 focus-visible:ring-purple-500/20 bg-white dark:bg-zinc-950"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      No. WhatsApp (Opsional)
                    </label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0812xxxxxxxx"
                      className="h-11 rounded-xl border-zinc-300 dark:border-zinc-700 text-sm font-medium px-4 focus-visible:border-purple-600 focus-visible:ring-2 focus-visible:ring-purple-500/20 bg-white dark:bg-zinc-950"
                    />
                  </div>
                </div>
              </div>

              {/* STEP 3: QRIS GENPAY PAYMENT TERMINAL */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-xs flex flex-col gap-5">
                
                {/* Section Header with Supported Logos */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center justify-center">
                      3
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-obsidian dark:text-white tracking-tight flex items-center gap-2">
                      <CreditCardIcon size={18} className="text-purple-600 dark:text-purple-400" />
                      <span>Pembayaran QRIS GenPay</span>
                    </h2>
                  </div>

                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto">
                    Verifikasi Otomatis
                  </span>
                </div>

                {isGenerating ? (
                  <div className="py-16 px-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 flex flex-col items-center justify-center gap-3 text-center">
                    <RefreshIcon size={28} className="animate-spin text-purple-600 dark:text-purple-400" />
                    <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Menghubungkan ke Gateway GenPay & Menyiapkan QRIS...
                    </p>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Harap tunggu beberapa detik</span>
                  </div>
                ) : status === 'expired' ? (
                  <div className="py-12 px-6 rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20 flex flex-col items-center justify-center gap-3 text-center">
                    <AlertCircleIcon size={36} className="text-rose-500" />
                    <h3 className="text-base font-bold text-rose-800 dark:text-rose-300">Waktu Pembayaran Habis</h3>
                    <p className="text-xs text-rose-600 dark:text-rose-400 max-w-sm">
                      Sesi transaksi 15 menit telah kedaluwarsa. Silakan klik tombol di bawah untuk membuat kode QRIS baru.
                    </p>
                    <Button
                      onClick={() => initQrisTransaction(plan)}
                      className="mt-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-6 py-2 cursor-pointer"
                    >
                      <RefreshIcon size={14} className="mr-1.5" />
                      <span>Buat Kode QRIS Baru</span>
                    </Button>
                  </div>
                ) : qrisData ? (
                  <div className="flex flex-col items-center gap-6">
                    
                    {/* Live Timer & Heartbeat Polling Banner */}
                    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 p-3 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-800/40 text-xs">
                      <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-medium">
                        <Clock01Icon size={16} className={`shrink-0 ${timeLeft < 120 ? 'text-rose-500 animate-pulse' : 'text-amber-500'}`} />
                        <span>Selesaikan sebelum: <strong className="font-mono font-bold text-obsidian dark:text-white text-sm">{formatTimer(timeLeft)}</strong></span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-700 dark:text-purple-300">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span>Auto-polling (3s){lastCheckTime && ` • Cek ${lastCheckTime}`}</span>
                      </div>
                    </div>

                    {/* QR Code Presentation Box */}
                    <div className="flex flex-col items-center gap-4">
                      
                      {/* High-Craft QR Frame */}
                      <div className="relative p-4 bg-white rounded-3xl border-2 border-zinc-900 dark:border-zinc-200 shadow-md flex flex-col items-center">
                        
                        {/* Top QRIS Banner */}
                        <div className="w-full flex items-center justify-between border-b border-zinc-200 pb-2 mb-3 px-1">
                          <div className="flex items-center gap-1">
                            <span className="font-black text-xs text-obsidian tracking-tighter">QRIS</span>
                            <span className="text-[9px] font-bold text-red-600 bg-red-50 px-1 py-0.2 rounded">NASIONAL</span>
                          </div>
                          <span className="text-xs text-zinc-500 font-mono">GenPay Gateway</span>
                        </div>

                        {/* Actual QR Image Container */}
                        <div className="relative w-56 h-56 sm:w-64 sm:h-64 bg-white flex items-center justify-center p-2 rounded-xl">
                          <img
                            src={qrisData.qrisUrl}
                            alt="QRIS Payment Code"
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {/* Bottom Total Pill */}
                        <div className="w-full pt-2.5 mt-2 border-t border-zinc-200 flex items-center justify-between px-1">
                          <span className="text-[11px] text-zinc-500 font-medium">Nominal Pas:</span>
                          <span className="text-sm font-black text-obsidian font-mono">
                            Rp {currentFinalPrice.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>

                      {/* QR Quick Actions: Copy Trx & Download QR */}
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopy(qrisData.transactionId, 'trx')}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-755 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                        >
                          {copiedTrx ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                          <span>{copiedTrx ? 'ID Disalin' : 'Salin No. Transaksi'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleDownloadQr}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-755 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                        >
                          <Download size={13} />
                          <span>Unduh Gambar QR</span>
                        </button>
                      </div>
                    </div>

                    {/* Supported Payment Brands Pills */}
                    <div className="w-full flex flex-col gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                      <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 text-center">
                        Dapat dibayar menggunakan semua aplikasi perbankan & dompet digital:
                      </span>
                      <div className="flex flex-wrap justify-center items-center gap-1.5">
                        {SUPPORTED_PAYMENTS.map((brand, idx) => (
                          <span
                            key={idx}
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${brand.color}`}
                          >
                            {brand.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* How to Pay Accordion */}
                    <div className="w-full border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-zinc-50/50 dark:bg-zinc-950/30">
                      <button
                        type="button"
                        onClick={() => setShowHowToPay(!showHowToPay)}
                        className="w-full p-3.5 flex items-center justify-between text-xs font-bold text-obsidian dark:text-zinc-200 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer text-left"
                      >
                        <span className="flex items-center gap-2">
                          <HelpCircle size={15} className="text-purple-600 dark:text-purple-400" />
                          <span>Panduan Cara Bayar via QRIS (3 Langkah Mudah)</span>
                        </span>
                        {showHowToPay ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      </button>

                      <AnimatePresence>
                        {showHowToPay && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-4 pb-4 text-xs text-zinc-600 dark:text-zinc-400 space-y-2.5 font-medium border-t border-zinc-200 dark:border-zinc-800 pt-3"
                          >
                            <div className="flex items-start gap-2">
                              <span className="w-4 h-4 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                1
                              </span>
                              <p>Buka aplikasi E-Wallet (GoPay, OVO, DANA, ShopeePay) atau Mobile Banking (BCA, Mandiri, BRI, dll) di ponsel Anda.</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="w-4 h-4 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                2
                              </span>
                              <p>Pilih menu <strong>Scan / Bayar QRIS</strong> dan arahkan kamera ke kode QR di atas atau unggah tangkapan layar.</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="w-4 h-4 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                3
                              </span>
                              <p>Periksa nominal dan selesaikan pembayaran. Saldo kredit akan <strong>langsung bertambah otomatis dalam hitungan detik</strong> tanpa perlu konfirmasi manual.</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Developer / Sandbox Fast-Track Simulation Button */}
                    <div className="w-full pt-4 border-t border-zinc-100 dark:border-zinc-800">
                      <button
                        type="button"
                        onClick={handleSimulatePayment}
                        className="w-full py-3 px-4 rounded-2xl bg-gradient-to-b from-zinc-800 to-zinc-950 text-white border border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22),0_2px_4px_0_rgba(0,0,0,0.4)] hover:from-zinc-750 hover:to-zinc-900 text-xs font-bold transition-all duration-200 cursor-pointer active:scale-98 flex items-center justify-center gap-2 group"
                      >
                        <Zap size={14} className="text-amber-400 group-hover:scale-110 transition-transform" />
                        <span>⚡ Simulasi Bayar Lunas Instan (GenPay Local Test)</span>
                      </button>
                      <p className="text-[10px] text-zinc-400 text-center mt-2">
                        Fitur simulasi langsung memverifikasi transaksi untuk pengujian tanpa memotong saldo bank asli
                      </p>
                    </div>

                  </div>
                ) : null}

              </div>

            </div>

            {/* ------------------------------------------------------------
                RIGHT COLUMN: Order Summary, Voucher Promo & Trust Card (5 Cols Sticky)
               ------------------------------------------------------------ */}
            <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-20">
              
              {/* Card 1: Order Summary & Pricing Details */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-xs flex flex-col justify-between gap-5">
                
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                    <h3 className="text-base font-bold text-obsidian dark:text-white tracking-tight">
                      Ringkasan Pesanan
                    </h3>
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                      IDR (Rupiah)
                    </span>
                  </div>

                  {/* Selected Package Highlight Card */}
                  <div className="mt-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200/80 dark:border-zinc-800 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm shadow-purple-500/20">
                          <SparklesIcon size={22} className="fill-purple-200 text-purple-200" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-obsidian dark:text-white">{plan.name}</h4>
                          <p className="text-xs text-purple-600 dark:text-purple-400 font-bold">
                            +{plan.credits.toLocaleString('id-ID')} Kredit Saldo
                          </p>
                        </div>
                      </div>

                      <span className="text-sm font-black text-obsidian dark:text-white font-mono">
                        Rp {plan.priceIdr.toLocaleString('id-ID')}
                      </span>
                    </div>

                    {/* Included Perks List */}
                    <div className="pt-3 border-t border-zinc-200/60 dark:border-zinc-800 flex flex-col gap-1.5">
                      {plan.perks?.slice(0, 3).map((perk, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                          <CheckmarkCircle02Icon size={14} className="text-purple-600 dark:text-purple-400 shrink-0" />
                          <span>{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Breakdown Calculation */}
                  <div className="mt-5 flex flex-col gap-2.5 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                    <div className="flex justify-between items-center">
                      <span>Subtotal Produk</span>
                      <span className="font-mono text-obsidian dark:text-zinc-200 font-bold">
                        Rp {plan.priceIdr.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Biaya Transaksi QRIS</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                        Rp 0 (Gratis)
                      </span>
                    </div>

                    {isVoucherApplied && (
                      <div className="flex justify-between items-center text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                        <div className="flex items-center gap-1.5">
                          <Tick01Icon size={14} />
                          <span>Voucher ({voucherCode.toUpperCase()})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">- Rp {appliedDiscount.toLocaleString('id-ID')}</span>
                          <button
                            type="button"
                            onClick={handleRemoveVoucher}
                            className="text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Hapus Voucher"
                          >
                            <Cancel01Icon size={13} />
                          </button>
                        </div>
                      </div>
                    )}

                    <Separator className="my-1.5 bg-zinc-200 dark:bg-zinc-800" />

                    <div className="flex justify-between items-center text-sm pt-1 font-bold">
                      <span className="text-obsidian dark:text-white">Total Pembayaran</span>
                      <span className={`text-xl font-mono font-black ${isVoucherApplied && currentFinalPrice === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-purple-700 dark:text-purple-400'}`}>
                        Rp {currentFinalPrice.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  {/* Voucher Promo Input Form */}
                  <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-2">
                    <label className="text-xs font-bold text-obsidian dark:text-zinc-200">
                      Punya Kode Voucher Promo?
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                        placeholder="Contoh: KEPAL2"
                        className="h-9 px-3 text-xs bg-white dark:bg-zinc-950 text-obsidian dark:text-white border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 uppercase font-mono font-bold flex-1"
                      />
                      <button
                        type="button"
                        onClick={handleApplyVoucher}
                        className="h-9 px-4 rounded-xl bg-gradient-to-b from-zinc-800 to-zinc-950 text-white border border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22),0_1px_2px_rgba(0,0,0,0.4)] hover:from-zinc-750 hover:to-zinc-900 text-xs font-bold transition-all cursor-pointer shrink-0 active:scale-95"
                      >
                        Terapkan
                      </button>
                    </div>
                    {voucherError && (
                      <span className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">{voucherError}</span>
                    )}

                    {/* Free Claim Button when voucher makes total 0 IDR */}
                    {isVoucherApplied && currentFinalPrice === 0 && (
                      <button
                        type="button"
                        onClick={handleClaimFree}
                        className="w-full mt-3 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>🎉 Klaim +{plan.credits.toLocaleString('id-ID')} Kredit Gratis (Rp 0)</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Security and Instant Delivery Guarantee Badges */}
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-2.5">
                  <div className="flex items-center gap-2.5 text-xs text-zinc-600 dark:text-zinc-400">
                    <Zap size={15} className="text-amber-500 shrink-0" />
                    <span><strong>Proses Instan:</strong> Saldo langsung masuk dalam hitungan detik.</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-xs text-zinc-600 dark:text-zinc-400">
                    <ShieldCheck size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span><strong>Permanen:</strong> Kredit berlaku seumur hidup tanpa masa kedaluwarsa.</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-xs text-zinc-600 dark:text-zinc-400">
                    <Lock size={14} className="text-purple-600 dark:text-purple-400 shrink-0" />
                    <span><strong>Jaminan Aman:</strong> Terverifikasi gateway resmi QRIS Nasional.</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}
      </main>
    </div>
  );
}
