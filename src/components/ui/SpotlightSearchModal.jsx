import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search01Icon, Cancel01Icon, Clock01Icon, FireIcon, ArrowRight01Icon } from 'hugeicons-react';
import { Loader2, Sparkles, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  POPULAR_SEARCH_TAGS, 
  searchPrompts, 
  getRecentSearches, 
  saveRecentSearch, 
  clearRecentSearches 
} from '@/utils/search-engine';
import { getShortTitle, getOptimizedImageUrl, getPromptCost } from '@/utils/prompt-helpers';

/**
 * Intelligent Spotlight Search Modal (Raycast / Apple Spotlight / KUMO UI Experience)
 */
export default function SpotlightSearchModal({
  isOpen = false,
  onClose = () => {},
  value = "",
  onChange = () => {},
  onSelectPrompt = null,
  prompts = [],
  totalResults = 0,
  debounceMs = 150
}) {
  const [localValue, setLocalValue] = useState(value);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Sync external value & load recent searches on open
  useEffect(() => {
    setLocalValue(value);
    if (isOpen) {
      setRecentSearches(getRecentSearches());
      setSelectedIndex(-1);
    }
  }, [value, isOpen]);

  // Instant live matched results (top 5 most relevant items)
  const instantResults = useMemo(() => {
    if (!localValue || !localValue.trim() || !Array.isArray(prompts)) return [];
    return searchPrompts(prompts, localValue).slice(0, 5);
  }, [localValue, prompts]);

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

  // Global Keyboard Navigation (ArrowUp, ArrowDown, Enter, Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (instantResults.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev < instantResults.length - 1 ? prev + 1 : 0));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : instantResults.length - 1));
        } else if (e.key === 'Enter' && selectedIndex >= 0 && selectedIndex < instantResults.length) {
          e.preventDefault();
          handleSelectPromptItem(instantResults[selectedIndex]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, instantResults, selectedIndex]);

  const handleInputChange = (e) => {
    const nextVal = e.target.value;
    setLocalValue(nextVal);
    setIsSearching(true);
    setSelectedIndex(-1);

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
    setSelectedIndex(-1);
    onChange('');
    if (inputRef.current) inputRef.current.focus();
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    
    if (localValue.trim()) {
      saveRecentSearch(localValue.trim());
      setRecentSearches(getRecentSearches());
    }

    onChange(localValue);
    setIsSearching(false);
    onClose();
  };

  const handleTagClick = (tagQuery) => {
    setLocalValue(tagQuery);
    saveRecentSearch(tagQuery);
    setRecentSearches(getRecentSearches());
    onChange(tagQuery);
    onClose();
  };

  const handleSelectPromptItem = (promptItem) => {
    if (localValue.trim()) {
      saveRecentSearch(localValue.trim());
    }
    if (onSelectPrompt) {
      onSelectPrompt(promptItem);
    } else {
      onChange(localValue);
      onClose();
    }
  };

  const handleClearHistory = (e) => {
    e.stopPropagation();
    clearRecentSearches();
    setRecentSearches([]);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 pt-[12vh] sm:pt-[15vh] bg-black/50 backdrop-blur-md overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -14 }}
          transition={{ type: "spring", stiffness: 450, damping: 32 }}
          className="relative w-full max-w-2xl font-sans flex flex-col gap-2.5 my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Main Floating Spotlight Search Box (High Elevation Shadow) */}
          <div className="w-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-black/10 dark:border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.22),0_4px_16px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col">
            
            {/* Input Form Header */}
            <form onSubmit={handleSubmit} className="relative flex items-center w-full border-b border-black/5 dark:border-white/5">
              {/* Search Icon / Animated Spinner */}
              <div className="absolute left-4.5 flex items-center justify-center pointer-events-none text-zinc-400 dark:text-zinc-500">
                {isSearching ? (
                  <Loader2 size={20} className="animate-spin text-purple-600 dark:text-purple-400" />
                ) : (
                  <Search01Icon size={20} className="text-zinc-500 dark:text-zinc-400" />
                )}
              </div>

              {/* Direct Floating Input */}
              <input
                ref={inputRef}
                type="text"
                value={localValue}
                onChange={handleInputChange}
                placeholder="Cari prompt, gaya, model AI, atau creator..."
                className={cn(
                  "w-full h-15 pl-12 pr-12 text-base font-medium text-obsidian dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
                  "bg-transparent border-0 focus:outline-none focus:ring-0",
                  "transition-all duration-200"
                )}
              />

              {/* Clear Button */}
              {localValue && (
                <div className="absolute right-3.5 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="w-8 h-8 rounded-full text-zinc-400 hover:text-obsidian dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center"
                    title="Hapus teks"
                  >
                    <Cancel01Icon size={16} />
                  </button>
                </div>
              )}
            </form>

            {/* Modal Body: Live Matches OR Recent Searches / Popular Tags */}
            <div className="max-h-[60vh] overflow-y-auto p-3 sm:p-4 flex flex-col gap-4 scrollbar-thin">
              
              {/* STATE 1: Live Matched Instant Results when typing */}
              {localValue.trim() ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between px-1 text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="font-semibold uppercase tracking-wider text-[11px] text-zinc-400 dark:text-zinc-500">
                      Hasil Instan
                    </span>
                    <span className="font-medium">
                      {totalResults} prompt ditemukan
                    </span>
                  </div>

                  {instantResults.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {instantResults.map((item, idx) => {
                        const isSelected = selectedIndex === idx;
                        const cost = getPromptCost(item);
                        const shortTitle = getShortTitle(item);

                        return (
                          <div
                            key={item.id || idx}
                            onClick={() => handleSelectPromptItem(item)}
                            className={cn(
                              "group flex items-center justify-between gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-150",
                              isSelected 
                                ? "bg-purple-50 dark:bg-purple-950/50 ring-1 ring-purple-400/50 shadow-xs" 
                                : "hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60"
                            )}
                          >
                            {/* Thumbnail & Title Info */}
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={getOptimizedImageUrl(item.image, 96, 75)}
                                alt={shortTitle}
                                className="w-11 h-11 rounded-lg object-cover bg-zinc-100 dark:bg-zinc-800 border border-black/5 dark:border-white/10 shrink-0"
                              />
                              <div className="flex flex-col min-w-0">
                                <h4 className="text-xs sm:text-sm font-semibold text-obsidian dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                  {shortTitle}
                                </h4>
                                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 truncate">
                                  <span>@{item.author || 'Creator'}</span>
                                  <span>•</span>
                                  <span className="capitalize">{item.model || 'gptimage'}</span>
                                  {item.categories && item.categories.length > 0 && (
                                    <>
                                      <span>•</span>
                                      <span className="text-zinc-400 dark:text-zinc-500 truncate">{item.categories[0]}</span>
                                    </>
                                  )}
                                </p>
                              </div>
                            </div>

                            {/* Right Badge & Arrow */}
                            <div className="flex items-center gap-2 shrink-0">
                              {item.isPremium ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/50">
                                  {cost} Kredit
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50">
                                  Gratis
                                </span>
                              )}
                              <ArrowUpRight size={15} className="text-zinc-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
                      Tidak ada hasil instan untuk "{localValue}". Tekan Enter untuk menyaring galeri.
                    </div>
                  )}
                </div>
              ) : (
                /* STATE 2: Empty Query Default (Recent Searches & Popular Tags) */
                <div className="flex flex-col gap-4">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between px-1 text-xs text-zinc-500 dark:text-zinc-400">
                        <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500">
                          <Clock01Icon size={13} />
                          Pencarian Terakhir
                        </span>
                        <button
                          type="button"
                          onClick={handleClearHistory}
                          className="text-[11px] text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          Hapus Riwayat
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {recentSearches.map((recQuery, rIdx) => (
                          <button
                            key={rIdx}
                            type="button"
                            onClick={() => handleTagClick(recQuery)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-purple-50 dark:hover:bg-purple-950/50 text-zinc-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-300 border border-black/5 dark:border-white/5 text-xs font-medium transition-colors cursor-pointer active:scale-95"
                          >
                            <span>{recQuery}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Exploration Tags */}
                  <div className="flex flex-col gap-2">
                    <div className="px-1 text-xs text-zinc-500 dark:text-zinc-400">
                      <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500">
                        <FireIcon size={13} className="text-amber-500" />
                        Jelajahi Gaya & Kategori Populer
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {POPULAR_SEARCH_TAGS.map((tag, tIdx) => (
                        <button
                          key={tIdx}
                          type="button"
                          onClick={() => handleTagClick(tag.query)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-purple-50 dark:hover:bg-purple-950/50 text-zinc-800 dark:text-zinc-200 hover:text-purple-600 dark:hover:text-purple-300 border border-black/5 dark:border-white/5 text-xs font-medium transition-colors cursor-pointer active:scale-95"
                        >
                          <span>{tag.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-50/80 dark:bg-zinc-850/80 border-t border-black/5 dark:border-white/5 text-[11px] text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 font-mono text-[10px]">↑↓</kbd> Navigasi
                </span>
                <span className="hidden sm:inline-flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 font-mono text-[10px]">↵</kbd> Buka Prompt
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 font-mono text-[10px]">ESC</kbd> Tutup
                </span>
              </div>

              <Button
                type="button"
                onClick={handleSubmit}
                variant="secondary"
                size="sm"
                className="rounded-full px-3.5 h-7 text-xs font-semibold shadow-2xs cursor-pointer"
              >
                {localValue ? `Tampilkan ${totalResults} Prompt` : 'Tutup'}
              </Button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
