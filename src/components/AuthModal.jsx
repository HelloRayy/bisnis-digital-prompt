import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cancel01Icon, AlertCircleIcon } from 'hugeicons-react';
import { supabase } from '../lib/supabase';

export default function AuthModal({ onClose, onAuthSuccess }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err) {
      setErrorMsg(err.message || 'Gagal masuk dengan Google. Silakan coba lagi.');
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 6 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="relative w-full max-w-[400px] rounded-[28px] bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xl shadow-black/10 p-7 sm:p-9 text-center flex flex-col items-center font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          title="Tutup"
          aria-label="Tutup modal"
        >
          <Cancel01Icon size={16} />
        </button>

        {/* Title & Subtitle */}
        <h3 className="text-2xl font-bold text-obsidian dark:text-white tracking-tight mt-2">
          Welcome to Prompt Hub!
        </h3>
        
        <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-[13px] mt-2 mb-7 px-1 font-normal leading-relaxed">
          Discover the world's best AI prompt collection & visual creative assets
        </p>

        {/* Error Alert */}
        {errorMsg && (
          <div className="w-full mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs font-medium text-rose-600 dark:text-rose-400 flex items-center gap-2 text-left">
            <AlertCircleIcon size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Clean Google Log in Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-2xl bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-750 text-obsidian dark:text-zinc-100 font-bold text-sm border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 shadow-xs hover:shadow-sm flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer active:scale-98 disabled:opacity-50 group"
        >
          {loading ? (
            <div className="h-5 w-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Log in with Google</span>
            </>
          )}
        </button>

        {/* Minimal Legal Note */}
        <p className="mt-6 text-[11px] text-zinc-400 font-normal leading-relaxed">
          By continuing, you agree to our Terms of Service & Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}
