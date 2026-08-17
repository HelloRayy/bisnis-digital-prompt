import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search01Icon, Cancel01Icon } from 'hugeicons-react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Centered Spotlight Search Modal (KUMO UI Minimalist Style, No Suggestions)
 */
export default function SpotlightSearchModal({
  isOpen = false,
  onClose = () => {},
  value = "",
  onChange = () => {},
  totalResults = 0,
  debounceMs = 200
}) {
  const [localValue, setLocalValue] = useState(value);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Sync external value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Auto focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 50);
    }
  }, [isOpen]);

  // Global Escape key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleInputChange = (e) => {
    const nextVal = e.target.value;
    setLocalValue(nextVal);
    setIsSearching(true);

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      onChange(nextVal);
      setIsSearching(false);
    }, debounceMs);
  };

  const handleClear = () => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    setLocalValue('');
    setIsSearching(false);
    onChange('');
    if (inputRef.current) inputRef.current.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    onChange(localValue);
    setIsSearching(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[18vh] sm:pt-[22vh] bg-black/70 dark:bg-black/85 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -16 }}
          transition={{ type: "spring", stiffness: 450, damping: 32 }}
          className="relative w-full max-w-xl font-sans flex flex-col gap-2.5"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Main Floating Spotlight Search Input */}
          <form onSubmit={handleSubmit} className="relative flex items-center w-full">
            {/* Search Icon / Animated Spinner */}
            <div className="absolute left-4.5 flex items-center justify-center pointer-events-none text-zinc-400">
              {isSearching ? (
                <Loader2 size={20} className="animate-spin text-purple-400" />
              ) : (
                <Search01Icon size={20} className="text-zinc-400" />
              )}
            </div>

            {/* Direct Floating Glass Input without redundant white container */}
            <input
              ref={inputRef}
              type="text"
              value={localValue}
              onChange={handleInputChange}
              placeholder="Ketik kata kunci pencarian prompt..."
              className={cn(
                "w-full h-14 pl-12 pr-12 text-sm sm:text-base font-medium text-white placeholder:text-zinc-400",
                "bg-zinc-900/90 backdrop-blur-2xl rounded-2xl border border-white/15 shadow-[0_16px_48px_rgba(0,0,0,0.6)]",
                "focus:bg-zinc-900 focus:border-purple-500/80 focus:ring-4 focus:ring-purple-500/20 focus:outline-none",
                "transition-all duration-200"
              )}
            />

            {/* Clear Button */}
            {localValue && (
              <div className="absolute right-3.5 flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Hapus teks"
                >
                  <Cancel01Icon size={18} />
                </button>
              </div>
            )}
          </form>

          {/* Minimalist Floating Hint Below Input */}
          <div className="flex items-center justify-between px-2 text-xs text-zinc-300">
            <div>
              {localValue ? (
                <span className="font-semibold text-purple-300">
                  {totalResults} prompt ditemukan
                </span>
              ) : (
                <span className="text-zinc-400">Ketik nama, gaya visual, atau subjek prompt</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[11px] bg-white/10 text-zinc-300 px-2 py-0.5 rounded-md border border-white/10">
                ESC untuk tutup
              </span>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-3.5 py-1 rounded-full bg-white text-zinc-950 text-xs font-bold hover:bg-zinc-100 active:scale-95 transition-all cursor-pointer shadow-md"
              >
                Lihat Hasil
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
