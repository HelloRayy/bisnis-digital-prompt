import React, { useState, useEffect } from 'react';
import { Search01Icon, Mic01Icon, Cancel01Icon } from 'hugeicons-react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SearchInputWithLoader({
  value = "",
  onChange = () => {},
  onClear = () => {},
  placeholder = "Search...",
  className = "",
  debounceMs = 300
}) {
  const [isSearching, setIsSearching] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Debounce loading indicator simulation when typing
  useEffect(() => {
    if (value) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, debounceMs);
      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
    }
  }, [value, debounceMs]);

  // Voice Mic click handler (Simulate Speech Recognition)
  const handleMicClick = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'id-ID';
      
      setIsListening(true);
      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onChange(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      alert("Browser Anda belum mendukung input suara langsung. Ketik kata kunci secara manual.");
    }
  };

  return (
    <div className={cn("relative flex items-center w-full min-w-0 transition-all duration-300", className)}>
      {/* Left Icon Area: Replaces Search Icon with Spinning Loader when typing */}
      <div className="absolute left-3.5 flex items-center justify-center pointer-events-none">
        {isSearching ? (
          <Loader2 size={18} className="animate-spin text-purple-600 shrink-0" />
        ) : (
          <Search01Icon size={18} className="text-zinc-400 shrink-0" />
        )}
      </div>

      {/* Input Field (Matching Screenshot UI Style: rounded-xl, light border, clean placeholder) */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full h-10 pl-10 pr-10 text-xs font-sans text-obsidian placeholder:text-zinc-400",
          "bg-white border border-zinc-200 rounded-xl shadow-2xs",
          "focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none",
          "transition-all duration-200"
        )}
      />

      {/* Right Area: Clear Button (when value present) OR Mic Icon (Matching Screenshot) */}
      <div className="absolute right-3.5 flex items-center justify-center">
        {value ? (
          /* Clear 'X' Button when query is present */
          <button
            type="button"
            onClick={onClear}
            className="text-zinc-400 hover:text-obsidian transition-colors p-0.5 rounded-full hover:bg-zinc-100 cursor-pointer"
            title="Hapus kata kunci"
          >
            <Cancel01Icon size={14} />
          </button>
        ) : (
          /* Mic Icon (Matching Screenshot) */
          <button
            type="button"
            onClick={handleMicClick}
            className={cn(
              "text-zinc-400 hover:text-obsidian transition-colors cursor-pointer p-0.5 rounded-full",
              isListening && "text-purple-600 animate-pulse bg-purple-50"
            )}
            title="Pencarian Suara (Voice Search)"
          >
            <Mic01Icon size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
