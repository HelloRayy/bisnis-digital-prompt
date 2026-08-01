import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cancel01Icon, CheckmarkCircle02Icon, SparklesIcon, RefreshIcon, Clock01Icon } from 'hugeicons-react';
import { checkGenPayTransactionStatus } from '@/lib/genpay';

export default function QrisPaymentModal({
  isOpen,
  onClose,
  planName = 'Starter Plan',
  amountIdr = 750000,
  creditsToAdd = 1500,
  qrisData,
  onPaymentSuccess = () => {}
}) {
  const [status, setStatus] = useState('pending'); // 'pending' | 'checking' | 'paid' | 'expired'
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [lastCheckTime, setLastCheckTime] = useState(null);
  const pollingRef = useRef(null);
  const timerRef = useRef(null);

  // Timer countdown
  useEffect(() => {
    if (!isOpen) return;
    setTimeLeft(15 * 60);
    setStatus('pending');

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
  }, [isOpen]);

  // Real-time 3-second Auto-Polling loop (GET /transactions/:id)
  useEffect(() => {
    if (!isOpen || !qrisData?.transactionId || status === 'paid' || status === 'expired') {
      return;
    }

    const pollStatus = async () => {
      setLastCheckTime(new Date().toLocaleTimeString());
      const res = await checkGenPayTransactionStatus(qrisData.transactionId);
      if (res.isPaid) {
        setStatus('paid');
        clearInterval(pollingRef.current);
        onPaymentSuccess(creditsToAdd);
      }
    };

    // Initial check
    pollStatus();

    // Auto-polling interval every 3 seconds
    pollingRef.current = setInterval(pollStatus, 3000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [isOpen, qrisData, status]);

  if (!isOpen || !qrisData) return null;

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Simulate payment completion for seamless local testing
  const handleSimulateLocalPayment = () => {
    setStatus('paid');
    if (pollingRef.current) clearInterval(pollingRef.current);
    setTimeout(() => {
      onPaymentSuccess(creditsToAdd);
    }, 800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md rounded-3xl bg-white text-obsidian p-6 md:p-8 shadow-2xl overflow-hidden font-sans border border-black/10 text-center"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Tutup modal pembayaran"
            className="absolute top-4 right-4 p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-obsidian transition-colors cursor-pointer"
          >
            <Cancel01Icon size={18} />
          </button>

          {status === 'paid' ? (
            /* PAYMENT SUCCESS VIEW */
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-8 flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckmarkCircle02Icon size={36} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-obsidian tracking-tight">Pembayaran Berhasil!</h3>
                <p className="text-xs text-ash-gray mt-1">
                  Transaksi GenPay terverifikasi. Saldo <strong className="text-purple-600">+{creditsToAdd.toLocaleString('id-ID')} Kredit</strong> telah ditambahkan ke akun Anda.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 rounded-full bg-obsidian text-white text-xs font-bold hover:bg-black transition-all cursor-pointer"
              >
                Tutup & Mulai Gunakan
              </button>
            </motion.div>
          ) : status === 'expired' ? (
            /* EXPIRED VIEW */
            <div className="py-8 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                <Clock01Icon size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-obsidian">Waktu Pembayaran Habis</h3>
                <p className="text-xs text-ash-gray mt-1">Kode QRIS ini telah kedaluwarsa. Silakan buat transaksi baru.</p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-obsidian text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          ) : (
            /* ACTIVE QRIS DISPLAY VIEW */
            <>
              {/* Header */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  GenPay QRIS Official
                </span>
              </div>

              <h3 className="text-xl font-black text-obsidian tracking-tight">
                Paket {planName}
              </h3>
              <p className="text-xs text-ash-gray mt-0.5">
                Scan kode QRIS di bawah menggunakan GoPay, OVO, ShopeePay, BCA, atau Mobile Banking apa saja.
              </p>

              {/* Total Amount */}
              <div className="my-4 p-3 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between px-5">
                <span className="text-xs text-ash-gray font-medium">Total Tagihan:</span>
                <span className="text-xl font-black text-purple-700 font-mono">
                  Rp {amountIdr.toLocaleString('id-ID')}
                </span>
              </div>

              {/* QRIS Code Image Box */}
              <div className="relative mx-auto w-56 h-56 bg-white p-3 rounded-2xl border-2 border-zinc-900 shadow-md flex items-center justify-center my-4 group">
                <img
                  src={qrisData.qrisUrl}
                  alt="GenPay QRIS Code"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>

              {/* Timer & Polling Status */}
              <div className="flex flex-col gap-2 text-center text-xs">
                <div className="flex items-center justify-center gap-2 text-zinc-500 font-semibold">
                  <Clock01Icon size={14} className="text-amber-500" />
                  <span>Batas waktu bayar: <strong className="text-obsidian font-mono">{formatTimer(timeLeft)}</strong></span>
                </div>

                <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-[11px] font-semibold mx-auto border border-purple-200">
                  <RefreshIcon size={12} className="animate-spin text-purple-600" />
                  <span>Auto-polling GenPay (`GET /transactions` - 3s) {lastCheckTime && `• ${lastCheckTime}`}</span>
                </div>
              </div>

              {/* Developer Test Fast-Track Button */}
              <div className="mt-5 pt-3 border-t border-zinc-100">
                <button
                  onClick={handleSimulateLocalPayment}
                  className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-98"
                >
                  ⚡ Simulasi Bayar Lunas Instan (GenPay Local)
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
