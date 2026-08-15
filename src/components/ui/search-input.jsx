import React, { useState, useEffect, useRef } from 'react';
import { Search01Icon, Mic01Icon, Cancel01Icon } from 'hugeicons-react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SearchInputWithLoader({
  value = "",
  onChange = () => {},
  onClear = () => {},
  placeholder = "Search...",
  className = "",
  debounceMs = 250
}) {
  const [localValue, setLocalValue] = useState(value);
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimerRef = useRef(null);

  // Sync external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

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
    onClear();
  };

  return (
    <div className={cn("relative flex items-center w-full min-w-0", className)}>
      {/* Left Icon Area */}
      <div className="absolute left-3.5 flex items-center justify-center pointer-events-none">
        {isSearching ? (
          <Loader2 size={16} className="animate-spin text-purple-600 shrink-0" />
        ) : (
          <Search01Icon size={16} className="text-zinc-400 shrink-0" />
        )}
      </div>

      {/* Input Field */}
      <input
        type="text"
        value={localValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={cn(
          "w-full h-9 pl-9 pr-9 text-xs font-sans text-obsidian placeholder:text-zinc-400",
          "bg-white border border-zinc-200 rounded-xl shadow-2xs",
          "focus:bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 focus:outline-none",
          "transition-colors duration-150"
        )}
      />

      {/* Right Area: Clear Button */}
      {localValue && (
        <div className="absolute right-2.5 flex items-center justify-center">
          <button
            type="button"
            onClick={handleClear}
            className="text-zinc-400 hover:text-obsidian transition-colors p-1 rounded-full hover:bg-zinc-100 cursor-pointer"
            title="Hapus kata kunci"
          >
            <Cancel01Icon size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
