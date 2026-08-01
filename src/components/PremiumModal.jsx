import React, { useState } from 'react';
import { Cancel01Icon, SparklesIcon, Tick01Icon, CreditCardIcon, Shield01Icon } from 'hugeicons-react';

export default function PremiumModal({ onClose, onTopUp }) {
  const [selectedPlan, setSelectedPlan] = useState('starter'); // 'starter' | 'pro' | 'custom'
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customAmount, setCustomAmount] = useState(500);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  const getCreditsToAdd = () => {
    if (selectedPlan === 'custom') {
      return Math.max(10, Number(customAmount) || 0);
    }
    return selectedPlan === 'pro' ? 4000 : 1500;
  };

  const getPrice = () => {
    if (selectedPlan === 'custom') {
      const credits = Math.max(10, Number(customAmount) || 0);
      return Math.round(credits * 3.5);
    }
    return selectedPlan === 'pro' ? 12000 : 5000;
  };

  const handleSimulatePayment = () => {
    setIsPaying(true);
    const creditsToAdd = getCreditsToAdd();

    setTimeout(() => {
      setIsPaying(false);
      setPaymentDone(true);
      setTimeout(() => {
        onTopUp(creditsToAdd);
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div 
        className="relative w-full max-w-lg rounded-3xl glassmorphism p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
        >
          <Cancel01Icon size={20} />
        </button>

        {!paymentDone ? (
          <>
            {/* Premium Header */}
            <div className="mx-auto w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mb-4 shadow-lg shadow-purple-500/10">
              <SparklesIcon size={24} />
            </div>

            <h3 className="text-2xl font-black text-white tracking-tight">Beli Kredit / Top Up Hybrid</h3>
            <p className="text-zinc-400 text-sm mt-1.5 px-4">Pilih paket hemat atau masukkan nominal kredit custom sesuai kebutuhan.</p>

            {/* Features List */}
            <div className="my-6 text-left flex flex-col gap-2.5 max-w-sm mx-auto bg-white/3 p-4 rounded-2xl border border-white/5">
              <div className="flex items-start gap-2.5 text-sm text-zinc-300">
                <Tick01Icon size={16} className="text-purple-400 shrink-0 mt-0.5" />
                <span>Buka <strong>Prompt Premium</strong> (10 - 20 kredit per copy)</span>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-zinc-300">
                <Tick01Icon size={16} className="text-purple-400 shrink-0 mt-0.5" />
                <span><strong>Copy & Edit Variabel Dinamis</strong></span>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-zinc-300">
                <Tick01Icon size={16} className="text-purple-400 shrink-0 mt-0.5" />
                <span>Saldo kredit tersimpan selamanya (tidak hangus)</span>
              </div>
            </div>

            {/* Plans Selection */}
            <div className="flex flex-col gap-3 mb-4">
              <div 
                onClick={() => { setSelectedPlan('starter'); setShowCustomInput(false); }}
                className={`flex justify-between items-center p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                  selectedPlan === 'starter' && !showCustomInput
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-white/5 bg-white/2 hover:bg-white/5'
                }`}
              >
                <div className="text-left">
                  <p className="text-sm font-bold text-white">Paket Starter (1.500 Kredit)</p>
                  <p className="text-xs text-zinc-400">Cocok untuk pemula</p>
                </div>
                <div className="text-right">
                  <p className="text-base font-black text-white">Rp 5.000</p>
                  <p className="text-[10px] text-zinc-400">Sekali beli</p>
                </div>
              </div>

              <div 
                onClick={() => { setSelectedPlan('pro'); setShowCustomInput(false); }}
                className={`flex justify-between items-center p-4 rounded-2xl border cursor-pointer transition-all duration-200 relative ${
                  selectedPlan === 'pro' && !showCustomInput
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-white/5 bg-white/2 hover:bg-white/5'
                }`}
              >
                <span className="absolute -top-2 right-4 text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 text-black uppercase">
                  Paling Hemat
                </span>
                <div className="text-left">
                  <p className="text-sm font-bold text-white">Paket Pro (4.000 Kredit)</p>
                  <p className="text-xs text-zinc-400">Untuk kreator aktif</p>
                </div>
                <div className="text-right">
                  <p className="text-base font-black text-white">Rp 12.000</p>
                  <p className="text-[10px] text-zinc-400">Sekali beli</p>
                </div>
              </div>
            </div>

            {/* Toggle Custom Input Text Button */}
            <div className="mb-4">
              <button 
                type="button"
                onClick={() => {
                  const nextState = !showCustomInput;
                  setShowCustomInput(nextState);
                  if (nextState) setSelectedPlan('custom');
                  else setSelectedPlan('starter');
                }}
                className="text-xs text-purple-400 hover:text-purple-300 underline font-semibold transition-colors cursor-pointer"
              >
                {showCustomInput ? "← Gunakan Paket Preset" : "⚙️ Ingin Beli Nominal Custom? Klik di sini"}
              </button>
            </div>

            {/* Custom Amount Input Box */}
            {showCustomInput && (
              <div className="mb-6 p-4 rounded-2xl border border-purple-500/40 bg-purple-500/5 text-left animate-in fade-in zoom-in-95 duration-200">
                <label className="block text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">
                  Masukkan Jumlah Kredit Custom
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input 
                      type="number"
                      min="10"
                      max="100000"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(Math.max(10, parseInt(e.target.value, 10) || 0))}
                      className="w-full py-2.5 px-4 rounded-xl bg-white/10 border border-purple-500/30 text-white font-bold text-sm focus:outline-none focus:border-purple-400"
                      placeholder="Contoh: 500"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-zinc-400 font-semibold">Kredit</span>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black text-white">Rp {getPrice().toLocaleString('id-ID')}</p>
                    <p className="text-[10px] text-purple-400 font-medium">@ Rp 3,5 / kredit</p>
                  </div>
                </div>
              </div>
            )}

            {/* Simulating Payment Button */}
            <button
              onClick={handleSimulatePayment}
              disabled={isPaying}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all duration-300 active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {isPaying ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Memproses Pembayaran...
                </>
              ) : (
                <>
                  <CreditCardIcon size={18} /> Bayar Rp {getPrice().toLocaleString('id-ID')} ({getCreditsToAdd().toLocaleString('id-ID')} Kredit)
                </>
              )}
            </button>
            <p className="mt-3 text-[10px] text-zinc-500 flex items-center justify-center gap-1">
              <Shield01Icon size={12} className="text-zinc-500" /> Transaksi aman menggunakan simulasi Sandbox
            </p>
          </>
        ) : (
          <div className="py-8 flex flex-col items-center justify-center animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/25 scale-in">
              <Tick01Icon size={32} />
            </div>
            <h3 className="text-2xl font-black text-white">Pembayaran Sukses!</h3>
            <p className="text-zinc-400 text-sm mt-1">Kredit baru Anda telah ditambahkan ke akun.</p>
            <p className="text-xs text-purple-400 mt-4 animate-pulse">Menutup halaman...</p>
          </div>
        )}
      </div>
    </div>
  );
}
