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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: -12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: -12 }}
          transition={{ type: "spring", stiffness: 450, damping: 32 }}
          className="relative w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-2xl overflow-hidden font-sans p-4 sm:p-5"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Main Search Input Form */}
          <form onSubmit={handleSubmit} className="relative flex items-center w-full">
            {/* Search Icon / Animated Spinner */}
            <div className="absolute left-4 flex items-center justify-center pointer-events-none text-zinc-400">
              {isSearching ? (
                <Loader2 size={22} className="animate-spin text-purple-600 dark:text-purple-400" />
              ) : (
                <Search01Icon size={22} className="text-zinc-500 dark:text-zinc-400" />
              )}
            </div>

            {/* Input Element */}
            <input
              ref={inputRef}
              type="text"
              value={localValue}
              onChange={handleInputChange}
              placeholder="Ketik kata kunci pencarian prompt..."
              className={cn(
                "w-full h-14 pl-12 pr-12 text-sm sm:text-base font-medium text-obsidian dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
                "bg-zinc-100/80 dark:bg-zinc-800/80 rounded-2xl border border-transparent",
                "focus:bg-white dark:focus:bg-zinc-800 focus:border-purple-500/80 focus:ring-4 focus:ring-purple-500/15 focus:outline-none",
                "transition-all duration-200"
              )}
            />

            {/* Clear Button */}
            {localValue && (
              <div className="absolute right-3.5 flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 rounded-full text-zinc-400 hover:text-obsidian dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                  title="Hapus teks"
                >
                  <Cancel01Icon size={18} />
                </button>
              </div>
            )}
          </form>

          {/* Footer Metadata & Keyboard Hints */}
          <div className="flex items-center justify-between mt-3 px-2 text-xs text-zinc-500 dark:text-zinc-400">
            <div>
              {localValue ? (
                <span className="font-semibold text-purple-600 dark:text-purple-400">
                  {totalResults} prompt ditemukan
                </span>
              ) : (
                <span>Ketik nama, gaya visual, atau subjek prompt</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[11px] bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md border border-black/5 dark:border-white/10">
                ESC untuk tutup
              </span>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-3 py-1 rounded-full bg-obsidian dark:bg-white text-white dark:text-obsidian text-xs font-bold hover:opacity-90 active:scale-95 transition-all cursor-pointer"
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
