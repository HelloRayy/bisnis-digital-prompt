import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Coins } from 'lucide-react';
import { toast } from 'sonner';
import { Dock } from '@/components/ui/dock-two';
import { AnimatedNumber } from '@/components/ui/animated-counter';
import SpecularElectricButton from '@/components/ui/SpecularElectricButton';
import { SubscriptionCards } from './SubscriptionView';
import PromptParameterCustomizer from './prompt-detail/PromptParameterCustomizer';
import PromptImageGallery from './prompt-detail/PromptImageGallery';
import { getOptimizedImageUrl } from '@/utils/image-optimizer';
import { 
  Cancel01Icon, 
  Copy01Icon, 
  Tick01Icon,
  CheckmarkCircle02Icon,
  Coins01Icon, 
  FavouriteIcon, 
  AlertCircleIcon, 
  Share01Icon,
  SparklesIcon,
  ArrowDown01Icon,
  Image01Icon,
  InformationCircleIcon,
  ArrowUpRight01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon
} from 'hugeicons-react';

/* High-craft SVG Unlock Icon */
const UnlockIconSVG = ({ size = 32, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
  </svg>
);
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function PromptDetailView({
  prompt,
  onClose,
  userCredits = 0,
  currentUser = null,
  onOpenAuth = () => {},
  onSignOut = () => {},
  isUnlocked = false,
  isFavorite = false,
  onToggleFavorite = () => {},
  onDeductCredits = () => {},
  onOpenUpgrade = () => {}
}) {
  if (!prompt) return null;

  const {
    prompt: rawPrompt,
    author,
    author_name,
    image,
    images = [],
    categories = [],
    model = 'Midjourney v6',
    source_url,
    isPremium = false,
    cost,
    likes = 0,
    views = 0
  } = prompt;

  const promptCost = cost ?? (prompt?.prompt?.length >= 1533 ? 500 : 400);
  const allImages = images && images.length > 0 ? images : [image];
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const activeImage = allImages[selectedImgIndex] || image;

  // Selalu mulai dari Tampilan Cover (Stage 1) terlebih dahulu saat membuka detail
  const [showProjectInfo, setShowProjectInfo] = useState(false);

  // Variable customizer
  const extractVariables = (text) => {
    if (!text || typeof text !== 'string') return {};
    const matches = text.match(/\{([^}]+)\}|\[([^\]]+)\]/g) || [];
    const vars = {};
    matches.forEach(m => {
      const cleanKey = m.replace(/[{}[\]]/g, '');
      vars[cleanKey] = cleanKey;
    });
    return vars;
  };

  const [variables, setVariables] = useState(() => extractVariables(rawPrompt));
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);

  React.useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setSelectedImgIndex(prev => (prev > 0 ? prev - 1 : allImages.length - 1));
      } else if (e.key === 'ArrowRight') {
        setSelectedImgIndex(prev => (prev < allImages.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, allImages.length]);

  const containerRef = useRef(null);

  const compilePrompt = () => {
    if (!rawPrompt || typeof rawPrompt !== 'string') return '';
    let result = rawPrompt;
    Object.keys(variables).forEach(key => {
      const val = variables[key];
      result = result.replace(new RegExp(`\\{${key}\\}|\\[${key}\\]`, 'g'), val);
    });
    return result;
  };

  const compiledPrompt = compilePrompt();
  const variableKeys = Object.keys(variables);

  const handleVariableChange = (key, value) => {
    setVariables(prev => ({ ...prev, [key]: value }));
  };

  const fallbackCopyText = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    let successful = false;
    try {
      successful = document.execCommand('copy');
    } catch (err) {}
    document.body.removeChild(textArea);
    return successful;
  };

  const copyPromptToClipboard = async () => {
    const textToCopy = compiledPrompt || rawPrompt || '';
    let success = false;
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function' && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        success = true;
      } catch (err) {
        success = fallbackCopyText(textToCopy);
      }
    } else {
      success = fallbackCopyText(textToCopy);
    }

    if (success) {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
      toast.success('Teks prompt berhasil disalin ke clipboard!');
    } else {
      setErrorMsg('Gagal menyalin teks. Silakan salin secara manual.');
      toast.error('Gagal menyalin teks.');
    }
  };

  const handleCopyText = async () => {
    setErrorMsg('');
    if (isPremium && !isUnlocked && userCredits < promptCost) {
      setErrorMsg('Kredit Anda tidak mencukupi untuk membuka prompt premium ini.');
      return;
    }

    if (isPremium && !isUnlocked) {
      setShowConfirmModal(true);
      return;
    }

    await copyPromptToClipboard();
  };

  const executeUnlock = async () => {
    setErrorMsg('');

    const unlockTask = new Promise(async (resolve, reject) => {
      try {
        if (isPremium && !isUnlocked) {
          const result = await onDeductCredits(promptCost, prompt.id, prompt.prompt.slice(0, 30));
          if (!result?.success) {
            const reason = result?.reason === 'AUTH_REQUIRED'
              ? 'Silakan masuk/daftar akun terlebih dahulu.'
              : (result?.reason || 'Gagal memproses pemotongan kredit.');
            setErrorMsg(reason);
            return reject(new Error(reason));
          }
        }

        setShowProjectInfo(true);
        resolve('Prompt berhasil dibeli & dibuka!');
      } catch (err) {
        reject(err);
      }
    });

    toast.promise(unlockTask, {
      loading: 'Memproses pembelian prompt...',
      success: (msg) => msg || 'Prompt berhasil dibeli & dibuka!',
      error: (err) => err?.message || 'Gagal memproses pembelian prompt.'
    });
  };

  const handleShareLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Clean title & tags snippet matching Figma format
  const title = prompt.title || rawPrompt.split('\n')[0].replace(/[{}[\]]/g, '').slice(0, 45) || 'Not good at doing normal things';
  const categoryTagsStr = categories.map(c => `#${c.toLowerCase().replace(/[^a-z0-9]/g, '')}`).join(' ');
  const creatorHandle = author ? (author.startsWith('@') ? author : `@${author}`) : '@creator';

  // Hardware accelerated 60fps spring transition
  const smoothPhysics = { type: 'spring', stiffness: 180, damping: 24, mass: 0.8 };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-white text-obsidian overflow-y-auto font-sans flex flex-col justify-between selection:bg-purple-100 selection:text-purple-900 pb-24"
    >
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-black/5 py-4 px-6 md:px-10 flex items-center justify-between gap-4">
        {/* Brand Name */}
        <div 
          onClick={onClose}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 rounded-full bg-[#f2f2f2] border border-black/5 flex items-center justify-center font-bold text-xs">
            {author ? author.slice(0, 2).toUpperCase() : 'DT'}
          </div>
          <span className="font-sans text-base font-bold text-obsidian tracking-tight group-hover:text-purple-600 transition-colors">
            {author || "Daniel Triendl"}
          </span>
        </div>

        {/* Action Controls: Credits, Share, Close */}
        <div className="flex items-center gap-3">
          <SpecularElectricButton 
            onClick={() => setShowSubscription(true)} 
            credits={userCredits} 
          />

          <button
            onClick={handleShareLink}
            className="p-2 rounded-full bg-[#f2f2f2] hover:bg-black/5 text-black transition-all cursor-pointer border border-black/5"
            title="Bagikan Tautan"
          >
            {copiedLink ? <CheckmarkCircle02Icon size={16} className="text-emerald-600" /> : <Share01Icon size={16} />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto w-full px-6 md:px-10 py-6 sm:py-8 flex-1 flex flex-col justify-center my-auto relative">
        {/* Top Left Close Button inside Main Container */}
        <div className="mb-6 sm:mb-8 flex items-center justify-start">
          <button 
            onClick={onClose}
            className="inline-flex items-center gap-2.5 text-obsidian text-xs font-semibold hover:text-purple-600 transition-colors cursor-pointer group"
            title="Tutup Preview"
          >
            <div className="w-8 h-8 rounded-full bg-[#f2f2f2] group-hover:bg-purple-100 border border-black/5 text-obsidian group-hover:text-purple-600 flex items-center justify-center transition-colors shadow-2xs">
              <Cancel01Icon size={16} className="group-hover:rotate-90 transition-transform duration-200" />
            </div>
            <span>Tutup</span>
          </button>
        </div>
        <AnimatePresence mode="wait">
          {!showProjectInfo ? (
            /* STAGE 1: Visual Cover View */
            <motion.div 
              key="stage-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
            >
              {/* Left Image Showcase */}
              <div className="lg:col-span-6 flex flex-col gap-4 sticky lg:top-24">
                <div className="w-full flex items-center justify-center overflow-hidden [contain:paint]">
                  <img 
                    src={getOptimizedImageUrl(activeImage, 1200, 80)} 
                    alt={title} 
                    decoding="async"
                    onClick={() => setIsLightboxOpen(true)}
                    className="w-full h-auto max-h-[70vh] object-contain rounded-2xl cursor-pointer shadow-sm hover:scale-[1.01] transition-transform duration-200"
                    title="Klik untuk memperbesar gambar"
                  />
                </div>
              </div>

                {/* Right Details & CTA OR Subscription Panel */}
                {showSubscription ? (
                  <div className="lg:col-span-6 flex flex-col gap-5 max-h-[75vh] overflow-y-auto pr-1.5 scrollbar-thin animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between border-b border-black/5 pb-3">
                      <div>
                        <h2 className="text-lg font-bold text-obsidian tracking-tight">Paket Berlangganan</h2>
                        <p className="text-xs text-ash-gray">Isi ulang kredit instan untuk membuka seluruh prompt premium.</p>
                      </div>
                      <button 
                        onClick={() => setShowSubscription(false)} 
                        className="text-xs font-semibold text-zinc-500 hover:text-black bg-zinc-100 hover:bg-zinc-200 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                      >
                        Tutup
                      </button>
                    </div>

                    <SubscriptionCards 
                      userCredits={userCredits} 
                      onTopUp={(credits) => {
                        onDeductCredits(credits);
                      }} 
                      isPanel={true} 
                    />
                  </div>
                ) : (
                  <div className="lg:col-span-6 flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                      <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-obsidian tracking-tight leading-tight">
                        {title}
                      </h1>
                      <p className="font-sans text-ash-gray font-normal text-lg flex items-center flex-wrap gap-x-2">
                        <span>{categoryTagsStr}</span>
                        <span className="text-obsidian font-semibold">{creatorHandle}</span>
                      </p>
                    </div>

                    {/* Metadata Pills */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-ash-gray font-sans">
                      <span className="bg-[#f2f2f2] text-obsidian px-3 py-1 rounded-full font-semibold">
                        Model: {model}
                      </span>
                      <span className="bg-[#f2f2f2] text-obsidian px-3 py-1 rounded-full font-semibold">
                        Author: @{author || 'Daniel Triendl'}
                      </span>
                      {isPremium && (
                        <span className={`px-3 py-1 rounded-full font-bold ${
                          isUnlocked ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {isUnlocked ? 'Unlocked' : `Premium (${promptCost} Kredit)`}
                        </span>
                      )}
                    </div>

                    {/* CTA Buy / Unlock Button */}
                    <div className="pt-4 flex items-center justify-between border-t border-black/5 mt-2">
                      <button 
                        onClick={() => setShowProjectInfo(true)}
                        className="flex items-center gap-2.5 text-sm font-semibold text-obsidian hover:text-purple-600 transition-colors duration-200 group cursor-pointer"
                      >
                        <span>{isPremium && !isUnlocked ? `Buka Prompt & Customize (${promptCost} Kredit)` : 'Lihat Prompt & Customize'}</span>
                        <span className="relative w-7 h-7 rounded-full bg-[#f2f2f2] group-hover:bg-purple-100 text-black group-hover:text-purple-600 flex items-center justify-center transition-colors duration-200 overflow-hidden shrink-0">
                          <ArrowDown01Icon size={14} className="transition-transform duration-250 ease-out group-hover:translate-y-6" />
                          <ArrowDown01Icon size={14} className="absolute transition-transform duration-250 ease-out -translate-y-6 group-hover:translate-y-0 text-purple-600" />
                        </span>
                      </button>

                      <button
                        onClick={() => onToggleFavorite(prompt.id)}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full border transition-all cursor-pointer ${
                          isFavorite ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-black border-black/10 hover:bg-black/5'
                        }`}
                      >
                        <FavouriteIcon size={14} className={isFavorite ? 'fill-red-600' : ''} />
                        <span>{likes + (isFavorite ? 1 : 0)}</span>
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              /* STAGE 2: Unlocked / Purchased Editorial View (Pure High-Craft Editorial Layout) */
              <motion.div 
                key="stage-editorial"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-10 max-w-4xl"
              >
                {/* 1. Small Top Thumbnails (Clickable to select and open Fullscreen Lightbox Overlay) */}
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {allImages.map((imgUrl, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => {
                        setSelectedImgIndex(idx);
                        setIsLightboxOpen(true);
                      }}
                      className={`max-h-36 max-w-[240px] shrink-0 overflow-hidden cursor-pointer group/thumb rounded-xl border-2 transition-all ${
                        selectedImgIndex === idx 
                          ? 'border-purple-600 shadow-md ring-2 ring-purple-500/20' 
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                      title={`Klik untuk memperbesar gambar ${idx + 1}`}
                    >
                      <img 
                        src={getOptimizedImageUrl(imgUrl, 240, 75)} 
                        alt={`Thumbnail ${idx}`} 
                        decoding="async"
                        className="h-auto max-h-36 w-auto object-contain rounded-lg group-hover/thumb:scale-105 transition-transform duration-300" 
                      />
                    </div>
                  ))}
                </div>

                {/* 2. Title & Hashtags */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="flex flex-col gap-2"
                >
                  <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-obsidian tracking-tight leading-tight">
                    {title} <span className="font-sans text-ash-gray font-normal text-lg sm:text-xl">{categoryTagsStr} <span className="text-obsidian font-semibold">{creatorHandle}</span></span>
                  </h1>

                  {/* Tag Pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-ash-gray font-sans">
                    <span className="bg-[#f2f2f2] text-obsidian px-3 py-1 rounded-full font-semibold">
                      Client: {author || 'Monocle Magazine'}
                    </span>
                    <span className="bg-[#f2f2f2] text-obsidian px-3 py-1 rounded-full font-semibold">
                      Model: {model}
                    </span>
                    {isPremium && (
                      <span className={`px-3 py-1 rounded-full font-bold ${
                        isUnlocked ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {isUnlocked ? 'Unlocked' : `Premium (${promptCost} Kredit)`}
                      </span>
                    )}
                  </div>
                </motion.div>

                {/* Tutorial Cara Menggunakan Prompt (Collapsible Dropdown - Column Layout) */}
                {(isUnlocked || !isPremium) && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.11 }}
                    className="rounded-xl border border-purple-200/60 bg-purple-50/40 text-obsidian overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setIsTutorialOpen(!isTutorialOpen)}
                      className="w-full px-4 py-3 flex items-center justify-between font-semibold text-purple-950 text-sm hover:bg-purple-100/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <InformationCircleIcon size={18} className="text-purple-600 shrink-0" />
                        <span>Cara Menggunakan Prompt Ini</span>
                      </div>
                      <motion.span 
                        animate={{ rotate: isTutorialOpen ? 180 : 0 }} 
                        transition={{ duration: 0.2 }}
                        className="text-purple-600 shrink-0"
                      >
                        <ArrowDown01Icon size={16} />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isTutorialOpen && (
                        <motion.div
                          key="tutorial-content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <ol className="flex flex-col gap-2.5 px-4 pb-4 pt-2 text-xs text-obsidian/85 border-t border-purple-200/50">
                            <li className="flex items-start gap-2.5">
                              <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                              <span>{variableKeys.length > 0 ? 'Kustomisasi nilai parameter pada kolom di bawah sesuai kebutuhan Anda.' : 'Periksa detail teks prompt pada tampilan di bawah.'}</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                              <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                              <span>Hasil teks prompt akan otomatis ter-update dan siap disalin di tombol bagian bawah.</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                              <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                              <span>Tempel (*paste*) teks prompt ke generator AI pilihan Anda ({model || 'Midjourney'}).</span>
                            </li>
                          </ol>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* 3. Parameter Customizer Box (SHADCN BASE UI CARD DESIGN) */}
                {variableKeys.length > 0 && (isUnlocked || !isPremium) && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.12 }}
                    className="rounded-xl border border-black/10 bg-white text-obsidian shadow-2xs p-5 flex flex-col gap-4"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <SparklesIcon size={16} className="text-purple-600 shrink-0" />
                        <h3 className="text-sm font-semibold leading-none tracking-tight text-obsidian">Kustomisasi Parameter Prompt</h3>
                      </div>
                      <p className="text-xs text-ash-gray pl-6">
                        Ubah nilai variabel di bawah untuk menyesuaikan hasil teks prompt secara otomatis.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                      {variableKeys.map((vKey) => (
                        <div key={vKey} className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium text-obsidian flex items-center justify-between">
                            <span className="capitalize">{vKey}</span>
                            <span className="text-[11px] text-purple-600 font-mono">{`{${vKey}}`}</span>
                          </label>
                          <input 
                            type="text" 
                            value={variables[vKey]}
                            onChange={(e) => handleVariableChange(vKey, e.target.value)}
                            className="h-9 w-full rounded-md border border-black/15 bg-white px-3 py-1 text-sm shadow-2xs transition-colors focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600 font-normal text-obsidian"
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* 4. Pure High-Craft Editorial Typography Display */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="flex flex-col gap-6"
                >
                  <div className="relative">
                    {/* Micro-interaction Quick Copy Button in Top-Right Corner */}
                    {(isUnlocked || !isPremium) && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCopyText}
                        className={`absolute top-0 right-0 z-10 p-3 rounded-full border transition-all cursor-pointer shadow-sm flex items-center justify-center ${
                          copiedText 
                            ? 'bg-emerald-500 border-emerald-400 text-white scale-110 shadow-emerald-500/30' 
                            : 'bg-white/90 backdrop-blur-md border-black/10 text-obsidian hover:bg-obsidian hover:text-white'
                        }`}
                        title="Salin Cepat Teks Prompt"
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          {copiedText ? (
                            <motion.div
                              key="check"
                              initial={{ scale: 0, rotate: -60 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0, rotate: 60 }}
                              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                            >
                              <Check size={18} className="text-white stroke-[2.5]" />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="copy"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={{ duration: 0.15 }}
                            >
                              <Copy01Icon size={18} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    )}

                    <div className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-obsidian leading-[1.3] tracking-tight transition-all duration-500 ${!isUnlocked && isPremium ? 'blur-xs select-none opacity-40 min-h-[200px] sm:min-h-[220px] max-h-64 overflow-hidden py-4' : 'pr-16 py-3 sm:py-4'}`}>
                      "{compiledPrompt}"
                    </div>

                    {/* Lock Overlay for Premium Items */}
                    {!isUnlocked && isPremium && (
                      <div className="absolute inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center gap-4 rounded-2xl border border-zinc-200 pointer-events-none my-auto">
                        <div className="flex flex-col items-center">
                          <h3 className="text-lg sm:text-xl font-bold text-obsidian tracking-tight">Prompt Premium Terkunci</h3>
                          <p className="text-xs sm:text-sm text-ash-gray mt-1.5 leading-relaxed max-w-md">Gunakan {promptCost} kredit untuk membuka dan menyalin teks prompt ini.</p>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.93, y: 1 }}
                          transition={{ type: 'spring', stiffness: 600, damping: 22 }}
                          onClick={handleCopyText}
                          className="group relative inline-flex items-center justify-between pl-6 sm:pl-7 pr-2 py-2 rounded-full bg-black hover:bg-white text-white hover:text-obsidian text-sm font-semibold border border-black hover:border-zinc-300 shadow-md hover:shadow-xl active:shadow-xs transition-all duration-300 cursor-pointer pointer-events-auto overflow-hidden select-none"
                        >
                          <span className="relative inline-flex items-center justify-center overflow-hidden">
                            {/* Default Text (Locks button width, slides UP & out on hover) */}
                            <span className="transition-all duration-300 group-hover:-translate-y-8 group-hover:opacity-0 group-active:scale-95 font-semibold">
                              Buka Prompt ({Number(promptCost).toLocaleString('id-ID')} Kredit)
                            </span>
                            {/* Hover Text (Slides IN from bottom on hover, without altering button width) */}
                            <span className="absolute inset-0 flex items-center justify-center transition-all duration-300 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 font-semibold whitespace-nowrap group-active:scale-95">
                              Buka & Salin Sekarang
                            </span>
                          </span>

                          <div className="w-9 h-9 rounded-full bg-white text-obsidian group-hover:bg-obsidian group-hover:text-white group-active:scale-85 flex items-center justify-center shrink-0 ml-4 relative overflow-hidden transition-all duration-300">
                            {/* Primary Arrow sliding up & out on hover */}
                            <ArrowUpRight01Icon 
                              size={18} 
                              className="text-obsidian group-hover:text-white stroke-[2.5] transition-all duration-300 group-hover:-translate-y-6 group-hover:translate-x-6" 
                            />
                            {/* Secondary Duplicate Arrow sliding in from bottom-left on hover */}
                            <ArrowUpRight01Icon 
                              size={18} 
                              className="text-obsidian group-hover:text-white stroke-[2.5] absolute transition-all duration-300 translate-y-6 -translate-x-6 group-hover:translate-y-0 group-hover:translate-x-0" 
                            />
                          </div>
                        </motion.button>
                      </div>
                    )}
                  </div>

                  {/* Primary CTA Action Toolbar (HIG Compliant - Single Primary CTA) */}
                  {(isUnlocked || !isPremium) && (
                    <div className="flex items-center gap-4 pt-4 border-t border-black/5">
                      <button
                        onClick={handleCopyText}
                        className={`h-12 px-8 rounded-full font-bold text-sm flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer active:scale-95 ${
                          copiedText
                            ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                            : 'bg-obsidian hover:bg-purple-600 text-white shadow-obsidian/20'
                        }`}
                      >
                        {copiedText ? <Check size={18} className="text-white stroke-[2.5]" /> : <Copy01Icon size={18} />}
                        <span>{copiedText ? 'Teks Prompt Berhasil Disalin!' : 'Salin Teks Prompt'}</span>
                      </button>

                      {errorMsg && (
                        <span className="text-xs text-red-500 flex items-center gap-1 font-medium">
                          <AlertCircleIcon size={14} /> {errorMsg}
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Lightweight Floating Navigation Dock Component */}
        <Dock 
          items={[
            {
              icon: Image01Icon,
              label: 'Cover',
              isActive: !showProjectInfo,
              onClick: () => setShowProjectInfo(false)
            },
            {
              icon: InformationCircleIcon,
              label: 'Prompt Info',
              isActive: showProjectInfo,
              onClick: () => setShowProjectInfo(true)
            },
            { isSeparator: true },
            {
              icon: FavouriteIcon,
              label: isFavorite ? 'Disukai' : 'Suka',
              isActive: isFavorite,
              onClick: () => onToggleFavorite(prompt.id),
              className: isFavorite ? 'text-red-500 fill-red-500' : ''
            },
            {
              icon: FavouriteIcon,
              label: isBookmarked ? 'Tersimpan' : 'Bookmark',
              isActive: isBookmarked,
              onClick: () => setIsBookmarked(!isBookmarked),
              className: isBookmarked ? 'text-amber-500 fill-amber-500' : ''
            }
          ]} 
        />

        {/* Pure Native Shadcn AlertDialog with Compact Copy */}
        <AlertDialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-medium text-base">Buka Prompt ini?</AlertDialogTitle>
              <AlertDialogDescription className="text-sm font-normal text-ash-gray">
                Gunakan {Number(promptCost).toLocaleString('id-ID')} kredit untuk membuka prompt ini. <span className="text-purple-600 font-medium">Sisa kredit Anda: {Number(userCredits).toLocaleString('id-ID')}.</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowConfirmModal(false)}>
                Batal
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  setShowConfirmModal(false);
                  await executeUnlock();
                }}
              >
                Setuju & Buka
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Fullscreen Image Lightbox Modal with Blurred Backdrop */}
        <AnimatePresence>
          {isLightboxOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsLightboxOpen(false)}
              className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-between p-4 md:p-8 cursor-pointer select-none"
            >
              {/* Top Close Control */}
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-6 right-6 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer backdrop-blur-md border border-white/10"
                title="Tutup Preview (Esc)"
              >
                <Cancel01Icon size={20} />
              </button>

              {/* Prev Button (if multiple images) */}
              {allImages.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImgIndex(prev => (prev > 0 ? prev - 1 : allImages.length - 1));
                  }}
                  className="z-10 p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer backdrop-blur-md border border-white/10 hover:scale-110 active:scale-95"
                  title="Gambar Sebelumnya (←)"
                >
                  <ArrowLeft01Icon size={24} />
                </button>
              )}

              {/* Expanded Image & Counter */}
              <div className="flex flex-col items-center gap-4 max-w-full max-h-full mx-auto" onClick={(e) => e.stopPropagation()}>
                <img
                  key={selectedImgIndex}
                  src={getOptimizedImageUrl(activeImage, 1600, 85)}
                  alt={title}
                  decoding="async"
                  className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                />
                {allImages.length > 1 && (
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-white text-xs font-semibold">
                    <span>{selectedImgIndex + 1} / {allImages.length}</span>
                  </div>
                )}
              </div>

              {/* Next Button (if multiple images) */}
              {allImages.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImgIndex(prev => (prev < allImages.length - 1 ? prev + 1 : 0));
                  }}
                  className="z-10 p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer backdrop-blur-md border border-white/10 hover:scale-110 active:scale-95"
                  title="Gambar Selanjutnya (→)"
                >
                  <ArrowRight01Icon size={24} />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
}
