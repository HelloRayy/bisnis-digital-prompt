import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search01Icon, Cancel01Icon } from 'hugeicons-react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
        className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[18vh] sm:pt-[22vh] bg-black/40 backdrop-blur-md"
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
          {/* Main Floating Spotlight Search Input (Clean Light Theme) */}
          <form onSubmit={handleSubmit} className="relative flex items-center w-full">
            {/* Search Icon / Animated Spinner */}
            <div className="absolute left-4.5 flex items-center justify-center pointer-events-none text-zinc-500">
              {isSearching ? (
                <Loader2 size={20} className="animate-spin text-purple-600" />
              ) : (
                <Search01Icon size={20} className="text-zinc-500" />
              )}
            </div>

            {/* Direct Floating Light Glass Input */}
            <input
              ref={inputRef}
              type="text"
              value={localValue}
              onChange={handleInputChange}
              placeholder="Ketik kata kunci pencarian prompt..."
              className={cn(
                "w-full h-14 pl-12 pr-12 text-sm sm:text-base font-medium text-obsidian placeholder:text-zinc-400",
                "bg-white/95 backdrop-blur-2xl rounded-2xl border border-black/10 shadow-[0_16px_48px_rgba(0,0,0,0.18),0_2px_6px_rgba(0,0,0,0.06)]",
                "focus:bg-white focus:border-purple-600/80 focus:ring-4 focus:ring-purple-600/15 focus:outline-none",
                "transition-all duration-200"
              )}
            />

            {/* Clear Button */}
            {localValue && (
              <div className="absolute right-3.5 flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 rounded-full text-zinc-400 hover:text-obsidian hover:bg-black/5 transition-colors cursor-pointer"
                  title="Hapus teks"
                >
                  <Cancel01Icon size={18} />
                </button>
              </div>
            )}
          </form>

          {/* Minimalist Floating Hint Below Input */}
          <div className="flex items-center justify-between px-2 text-xs">
            <div>
              {localValue ? (
                <span className="font-bold text-white drop-shadow-sm bg-purple-600/90 px-2.5 py-0.5 rounded-full text-[11px]">
                  {totalResults} prompt ditemukan
                </span>
              ) : (
                <span className="text-white/90 font-medium drop-shadow-sm">Ketik nama, gaya visual, atau subjek prompt</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[11px] bg-white/80 text-zinc-700 px-2 py-0.5 rounded-md border border-black/10 shadow-2xs">
                ESC untuk tutup
              </span>
              <Button
                type="button"
                onClick={handleSubmit}
                variant="secondary"
                size="sm"
                className="rounded-full px-3.5 h-7 text-xs font-semibold shadow-2xs"
              >
                Lihat Hasil
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
