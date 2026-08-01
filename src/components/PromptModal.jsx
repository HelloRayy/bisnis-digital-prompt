import React, { useState } from 'react';
import { Cancel01Icon, Copy01Icon, Tick01Icon, SparklesIcon, RefreshIcon, Link01Icon, Image01Icon, Coins01Icon, CircleUnlock01Icon, FavouriteIcon, AlertCircleIcon } from 'hugeicons-react';

export default function PromptModal({ 
  prompt, 
  onClose, 
  userCredits = 0,
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
    image,
    categories = [],
    model = 'Midjourney v6',
    source_url,
    isPremium = false,
    cost
  } = prompt;

  const promptCost = cost ?? (rawPrompt?.length >= 1533 ? 500 : 400);

  // Extract variables enclosed in {variable_name} or [VARIABLE_NAME]
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
  const [copiedImage, setCopiedImage] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Replace placeholders in prompt string safely without RegExp bracket escaping issues
  const compilePrompt = () => {
    if (!rawPrompt || typeof rawPrompt !== 'string') return '';
    let result = rawPrompt;
    Object.keys(variables).forEach(key => {
      const val = variables[key];
      result = result.replaceAll(`{${key}}`, val).replaceAll(`[${key}]`, val);
    });
    return result;
  };

  const compiledPrompt = compilePrompt();

  const handleVariableChange = (key, value) => {
    setVariables(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Helper: Robust text copying with execCommand fallback
  const fallbackCopyText = (textToCopy) => {
    if (!textToCopy) return false;
    const textArea = document.createElement('textarea');
    textArea.value = String(textToCopy);
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, 999999);
    
    let successful = false;
    try {
      successful = document.execCommand('copy');
    } catch (err) {
      console.error('execCommand copy error:', err);
    }
    document.body.removeChild(textArea);
    return successful;
  };

  // Fetch Image and convert to PNG Blob for Clipboard API
  const fetchImageBlobAsPng = async (imgUrl) => {
    try {
      const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(imgUrl)}&output=png`;
      const resp = await fetch(proxyUrl);
      if (resp.ok) {
        return await resp.blob();
      }
    } catch (e) {
      console.warn('Proxy fetch note:', e);
    }

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      const loadPromise = new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
        img.src = imgUrl;
      });
      await loadPromise;

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      return await new Promise(r => canvas.toBlob(r, 'image/png'));
    } catch (err) {
      console.warn('Canvas export note:', err);
    }

    return null;
  };

  // CTA 1: Copy Text Prompt ONLY (Guaranteed pure text copy)
  const handleCopyText = async () => {
    setErrorMsg('');

    if (isPremium && !isUnlocked && userCredits < promptCost) {
      setErrorMsg('Kredit Anda tidak mencukupi untuk membuka prompt premium ini.');
      return;
    }

    if (isPremium && !isUnlocked) {
      const result = await onDeductCredits(promptCost, prompt.id, prompt.prompt.slice(0, 30));
      if (!result?.success) {
        if (result?.reason === 'AUTH_REQUIRED') {
          setErrorMsg('Silakan masuk/daftar akun terlebih dahulu.');
        } else {
          setErrorMsg(result?.reason || 'Gagal memproses pemotongan kredit.');
        }
        return;
      }
    }

    const textToCopy = compiledPrompt || rawPrompt || '';
    let success = false;

    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function' && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        success = true;
      } catch (err) {
        console.warn('Primary clipboard writeText failed, using fallback:', err);
        success = fallbackCopyText(textToCopy);
      }
    } else {
      success = fallbackCopyText(textToCopy);
    }

    if (success) {
      setCopiedText(true);
      setErrorMsg('');
      setTimeout(() => setCopiedText(false), 2500);
    } else {
      setErrorMsg('Gagal menyalin teks. Silakan salin secara manual dari kotak di atas.');
    }
  };

  // CTA 2: Copy PNG Image ONLY
  const handleCopyImage = async () => {
    try {
      const pngBlob = await fetchImageBlobAsPng(image);
      if (pngBlob && window.ClipboardItem && navigator.clipboard?.write) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': pngBlob })
        ]);
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 2500);
      } else {
        fallbackCopyText(image);
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 2500);
      }
    } catch (e) {
      fallbackCopyText(image);
      setCopiedImage(true);
      setTimeout(() => setCopiedImage(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl glassmorphism p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Action Buttons (Close & Favorite) */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button 
            onClick={() => onToggleFavorite(prompt.id)}
            className={`p-2 rounded-full border transition-all ${
              isFavorite 
                ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
            }`}
            title={isFavorite ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
          >
            <FavouriteIcon size={20} className={isFavorite ? 'fill-red-400' : ''} />
          </button>

          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <Cancel01Icon size={20} />
          </button>
        </div>

        {/* Visual/Image Column */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <div className="relative rounded-2xl overflow-hidden bg-zinc-950 border border-white/5 flex items-center justify-center group">
            <img 
              src={image} 
              alt="Prompt visual representation" 
              className="w-full h-auto max-h-[48vh] object-contain"
            />
          </div>
          <div className="flex justify-between items-center text-xs text-zinc-400 px-1">
            <span className="flex items-center gap-1 text-purple-400 font-medium">
              <Image01Icon size={14} /> High Resolution Image
            </span>
            {source_url && (
              <a 
                href={source_url} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-purple-400 transition-colors"
              >
                View on Twitter/X <Link01Icon size={12} />
              </a>
            )}
          </div>
        </div>

        {/* Editor & Prompt Column */}
        <div className="w-full md:w-1/2 flex flex-col gap-5 justify-between">
          <div>
            <div className="flex flex-wrap gap-2 mb-3 pr-16">
              {categories.map((cat, i) => (
                <span 
                  key={i} 
                  className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20"
                >
                  {cat}
                </span>
              ))}
              <span className="text-xs px-2.5 py-1 rounded-full bg-purple-600 text-white font-semibold">
                {model}
              </span>
              {isPremium && (
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 border ${
                  isUnlocked 
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                }`}>
                  {isUnlocked ? (
                    <><CircleUnlock01Icon size={12} /> Terbuka (Gratis Salin)</>
                  ) : (
                    <><Coins01Icon size={12} /> Premium ({promptCost} Kredit)</>
                  )}
                </span>
              )}
            </div>

            <h3 className="text-xl font-bold text-white mb-4">Prompt Customizer</h3>

            {/* Variables Form */}
            {Object.keys(variables).length > 0 ? (
              <div className="flex flex-col gap-3 mb-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Edit Prompt Variables</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.keys(variables).map((key) => (
                    <div key={key} className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold text-zinc-400 capitalize">{key.replace(/_/g, ' ')}</label>
                      <input 
                        type="text" 
                        value={variables[key]}
                        onChange={(e) => handleVariableChange(key, e.target.value)}
                        placeholder={`Masukkan ${key}...`}
                        className="glassmorphism-input text-sm text-white px-3.5 py-2 rounded-xl focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-5 p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-zinc-400 flex items-center gap-2">
                <RefreshIcon size={16} className="text-purple-400" />
                Prompt ini statis (tidak memiliki variabel `[PLACEHOLDER]`).
              </div>
            )}

            {/* Prompt View */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Compiled Prompt</p>
              <div className="relative rounded-2xl bg-zinc-950 border border-white/5 p-4 font-mono text-xs leading-relaxed text-zinc-300 select-all max-h-[25vh] overflow-y-auto">
                {compiledPrompt}
              </div>
            </div>
          </div>

          {/* Actions & Alerts */}
          <div className="pt-4 border-t border-white/5 mt-4 flex flex-col gap-3">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
                <AlertCircleIcon size={16} className="shrink-0" />
                <div className="flex-1 flex justify-between items-center">
                  <span>{errorMsg}</span>
                  <button 
                    onClick={() => {
                      onClose();
                      onOpenUpgrade();
                    }}
                    className="underline text-red-300 hover:text-red-200 font-bold"
                  >
                    Isi Kredit / Masuk
                  </button>
                </div>
              </div>
            )}

            {/* Two Separate Clear CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* CTA 1: Copy Image */}
              <button 
                onClick={handleCopyImage}
                className={`py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 border ${
                  copiedImage
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-white/5 hover:bg-white/10 text-purple-300 border-purple-500/30'
                }`}
              >
                {copiedImage ? <Tick01Icon size={16} className="text-emerald-400" /> : <Image01Icon size={16} className="text-purple-400" />}
                {copiedImage ? 'File Gambar Copied!' : 'Salin File Gambar (PNG)'}
              </button>

              {/* CTA 2: Copy Text Prompt */}
              <button 
                onClick={handleCopyText}
                className={`py-3.5 px-5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all duration-300 ${
                  copiedText 
                    ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                    : 'bg-purple-600 text-white hover:bg-purple-700 shadow-purple-500/20'
                }`}
              >
                {copiedText ? (
                  <>
                    <Tick01Icon size={16} /> Text Prompt Copied!
                  </>
                ) : (
                  <>
                    <Copy01Icon size={16} /> 
                    {isPremium && !isUnlocked 
                      ? `Salin Prompt (-${promptCost} Kredit)` 
                      : 'Salin Prompt Teks'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
