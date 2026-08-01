import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import promptsData from './data/prompts.json';
import PromptCard from './components/PromptCard';
import PromptModal from './components/PromptModal';
import PromptDetailView from './components/PromptDetailView';
import PremiumModal from './components/PremiumModal';
import SubscriptionView, { SubscriptionCards } from './components/SubscriptionView';
import CheckoutView from './components/CheckoutView';
import AuthModal from './components/AuthModal';
import FigmaPortfolioPreview from './components/FigmaPortfolioPreview';
import { getCleanShortSlug } from './utils/slug';
import { Agentation } from 'agentation';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { Toaster } from '@/components/ui/sonner';
import { Search01Icon, SparklesIcon, Database01Icon, GridIcon, Coins01Icon, CloudIcon, UserIcon, Logout01Icon, Login01Icon, FavouriteIcon, Bookmark01Icon, Clock01Icon, ViewIcon } from 'hugeicons-react';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [userCredits, setUserCredits] = useState(0);
  const [userRole, setUserRole] = useState('Starter Plan');
  const [currentUser, setCurrentUser] = useState(null);
  const [activePrompt, setActivePrompt] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // User state: Purchased prompts, Favorite prompts, Transactions Audit Trail
  const [purchasedPromptIds, setPurchasedPromptIds] = useState([]);
  const [favoritePromptIds, setFavoritePromptIds] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const lastScrollY = useRef(0);

  // Helper untuk membuka prompt dengan URL dynamic route /view/:slug
  const handleOpenPrompt = (prompt, customPath = null) => {
    lastScrollY.current = window.scrollY || document.documentElement.scrollTop || 0;
    setActivePrompt(prompt);
    const targetPath = customPath || getCleanShortSlug(prompt);
    window.history.pushState({}, '', targetPath);
    setCurrentPath(targetPath);
  };

  const handleClosePrompt = () => {
    setActivePrompt(null);
    if (window.location.pathname.startsWith('/view/')) {
      window.history.pushState({}, '', '/');
      setCurrentPath('/');
    }
    const targetY = lastScrollY.current;
    requestAnimationFrame(() => {
      window.scrollTo({ top: targetY, behavior: 'instant' });
    });
  };

  // Listen to browser path changes (/preview, /view/:slug, /subscription, /checkout/:planId routes)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentPath(path);
      if (path.startsWith('/view/')) {
        const parts = path.split('-');
        const promptId = parts[parts.length - 1];
        let found = promptsData.find(p => String(p.id) === String(promptId));
        if (!found) {
          const rawSlug = path.replace('/view/', '').toLowerCase();
          found = promptsData.find(p => (p.title || p.prompt || '').toLowerCase().includes(rawSlug.slice(0, 15)));
        }
        setActivePrompt(found || promptsData[0]);
      } else {
        setActivePrompt(null);
      }
    };

    // Check initial path on load
    const initialPath = window.location.pathname;
    setCurrentPath(initialPath);
    if (initialPath.startsWith('/view/')) {
      const parts = initialPath.split('-');
      const promptId = parts[parts.length - 1];
      let found = promptsData.find(p => String(p.id) === String(promptId));
      if (!found) {
        const rawSlug = initialPath.replace('/view/', '').toLowerCase();
        found = promptsData.find(p => (p.title || p.prompt || '').toLowerCase().includes(rawSlug.slice(0, 15)));
      }
      setActivePrompt(found || promptsData[0]);
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Fetch all user state (Credits, Purchases, Favorites, Transactions)
  // Helper to sync credits to Supabase DB and Auth Metadata
  const syncCreditsToDB = async (userId, userEmail, newBal) => {
    if (!supabase || !userId) return;

    // 1. Sync directly to Supabase Auth User Metadata (Bypasses RLS issues)
    try {
      await supabase.auth.updateUser({
        data: { credits: newBal }
      });
    } catch (e) {}

    // 2. Sync to user_credits table
    try {
      const { error: err1 } = await supabase.from('user_credits').update({ credits: newBal }).eq('user_id', userId);
      if (err1) {
        await supabase.from('user_credits').update({ credits: newBal }).eq('id', userId);
        if (userEmail) await supabase.from('user_credits').update({ credits: newBal }).eq('email', userEmail);
      }
    } catch (e) {}

    // 3. Sync to profiles table
    try {
      const { error: err2 } = await supabase.from('profiles').update({ credits: newBal }).eq('user_id', userId);
      if (err2) {
        await supabase.from('profiles').update({ credits: newBal }).eq('id', userId);
        if (userEmail) await supabase.from('profiles').update({ credits: newBal }).eq('email', userEmail);
      }
    } catch (e) {}
  };

  // Fetch User Data from Supabase DB
  const fetchUserData = async (user) => {
    if (!user || !supabase) return;

    let cachedPurchases = [];
    let cachedFavs = [];
    try {
      const pStr = localStorage.getItem(`purchased_prompts_${user.id}`);
      if (pStr) cachedPurchases = JSON.parse(pStr);
      const fStr = localStorage.getItem(`favorite_prompts_${user.id}`);
      if (fStr) cachedFavs = JSON.parse(fStr);
    } catch (e) {}

    if (cachedPurchases.length > 0) setPurchasedPromptIds(cachedPurchases);
    if (cachedFavs.length > 0) setFavoritePromptIds(cachedFavs);

    try {
      // 1. Fetch Profile Role & Credits (DB Tables FIRST -> Auth Metadata -> LocalCache)
      let fetchedCredits = null;
      let fetchedRole = null;

      // Primary Source 1: Check user_credits DB table
      try {
        const { data: c1 } = await supabase.from('user_credits').select('*').eq('user_id', user.id).maybeSingle();
        if (c1) {
          if (typeof c1.credits === 'number' && c1.credits !== null) fetchedCredits = c1.credits;
          if (c1.role) fetchedRole = c1.role;
        }
      } catch (e) {}

      if (fetchedCredits === null) {
        try {
          const { data: c2 } = await supabase.from('user_credits').select('*').eq('id', user.id).maybeSingle();
          if (c2) {
            if (typeof c2.credits === 'number' && c2.credits !== null) fetchedCredits = c2.credits;
            if (c2.role) fetchedRole = fetchedRole || c2.role;
          }
        } catch (e) {}
      }

      if (fetchedCredits === null && user.email) {
        try {
          const { data: c3 } = await supabase.from('user_credits').select('*').eq('email', user.email).maybeSingle();
          if (c3) {
            if (typeof c3.credits === 'number' && c3.credits !== null) fetchedCredits = c3.credits;
            if (c3.role) fetchedRole = fetchedRole || c3.role;
          }
        } catch (e) {}
      }

      // Primary Source 2: Check profiles DB table
      if (fetchedCredits === null) {
        try {
          const { data: p1 } = await supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle();
          if (p1) {
            if (typeof p1.credits === 'number' && p1.credits !== null) fetchedCredits = p1.credits;
            if (p1.role || p1.plan_tier) fetchedRole = fetchedRole || p1.role || p1.plan_tier;
          }
        } catch (e) {}
      }

      if (fetchedCredits === null) {
        try {
          const { data: p2 } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
          if (p2) {
            if (typeof p2.credits === 'number' && p2.credits !== null) fetchedCredits = p2.credits;
            if (p2.role || p2.plan_tier) fetchedRole = fetchedRole || p2.role || p2.plan_tier;
          }
        } catch (e) {}
      }

      if (fetchedCredits === null && user.email) {
        try {
          const { data: p3 } = await supabase.from('profiles').select('*').eq('email', user.email).maybeSingle();
          if (p3) {
            if (typeof p3.credits === 'number' && p3.credits !== null) fetchedCredits = p3.credits;
            if (p3.role || p3.plan_tier) fetchedRole = fetchedRole || p3.role || p3.plan_tier;
          }
        } catch (e) {}
      }

      // Fallback Source 3: Check Auth user_metadata
      if (fetchedCredits === null && user.user_metadata) {
        if (typeof user.user_metadata.credits === 'number' && user.user_metadata.credits !== null) {
          fetchedCredits = user.user_metadata.credits;
        }
        if (!fetchedRole && (user.user_metadata.role || user.user_metadata.plan_tier)) {
          fetchedRole = user.user_metadata.role || user.user_metadata.plan_tier;
        }
      }

      // Apply DB credits (DB edits take 100% priority)
      if (fetchedCredits !== null) {
        setUserCredits(fetchedCredits);
        localStorage.setItem(`user_credits_${user.id}`, fetchedCredits.toString());
      } else {
        const cachedStr = localStorage.getItem(`user_credits_${user.id}`);
        const parsedCache = cachedStr !== null ? parseInt(cachedStr, 10) : 0;

        if (parsedCache > 0) {
          setUserCredits(parsedCache);
        } else {
          setUserCredits(1500);
          localStorage.setItem(`user_credits_${user.id}`, '1500');
        }
      }

      if (fetchedRole) {
        setUserRole(fetchedRole);
      }

      // 2. Fetch User Unlocked Purchases from Supabase DB & Auth Metadata
      let dbPurchased = [];
      try {
        const { data: purchaseData } = await supabase
          .from('user_purchases')
          .select('prompt_id')
          .eq('user_id', user.id);

        if (purchaseData) {
          dbPurchased = purchaseData.map(p => String(p.prompt_id));
        }
      } catch (e) {}

      const metaPurchased = user.user_metadata?.purchased_prompts || [];
      const metaPurchasedStr = metaPurchased.map(p => String(p));

      const mergedPurchased = Array.from(new Set([...cachedPurchases, ...dbPurchased, ...metaPurchasedStr]));
      if (mergedPurchased.length > 0) {
        setPurchasedPromptIds(mergedPurchased);
        localStorage.setItem(`purchased_prompts_${user.id}`, JSON.stringify(mergedPurchased));
      }

      // 3. Fetch User Favorites from Supabase DB & Auth Metadata
      let dbFavs = [];
      try {
        const { data: favData } = await supabase
          .from('user_favorites')
          .select('prompt_id')
          .eq('user_id', user.id);

        if (favData) {
          dbFavs = favData.map(f => String(f.prompt_id));
        }
      } catch (e) {}

      const metaFavs = user.user_metadata?.favorite_prompts || [];
      const metaFavsStr = metaFavs.map(f => String(f));

      const mergedFavs = Array.from(new Set([...cachedFavs, ...dbFavs, ...metaFavsStr]));
      if (mergedFavs.length > 0) {
        setFavoritePromptIds(mergedFavs);
        localStorage.setItem(`favorite_prompts_${user.id}`, JSON.stringify(mergedFavs));
      }

      // 4. Fetch Credit Transactions Log
      const { data: txData } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (txData) {
        setTransactions(txData);
      }
    } catch (e) {
      console.warn('Non-blocking notice loading user state from Supabase:', e);
    }
  };

  // Listen to Supabase Auth State
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        const user = session?.user || null;
        setCurrentUser(user);
        fetchUserData(user);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        const user = session?.user || null;
        setCurrentUser(user);
        fetchUserData(user);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  // Toggle Favorite logic
  const handleToggleFavorite = async (promptId) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    const strPromptId = String(promptId);
    const isFav = favoritePromptIds.includes(strPromptId);
    let updatedFavs = [];

    if (isFav) {
      updatedFavs = favoritePromptIds.filter(id => id !== strPromptId);
      setFavoritePromptIds(updatedFavs);
      localStorage.setItem(`favorite_prompts_${currentUser.id}`, JSON.stringify(updatedFavs));
      if (supabase) {
        try {
          await supabase.auth.updateUser({ data: { favorite_prompts: updatedFavs } });
          await supabase
            .from('user_favorites')
            .delete()
            .eq('user_id', currentUser.id)
            .eq('prompt_id', strPromptId);
        } catch (e) {}
      }
    } else {
      updatedFavs = Array.from(new Set([...favoritePromptIds, strPromptId]));
      setFavoritePromptIds(updatedFavs);
      localStorage.setItem(`favorite_prompts_${currentUser.id}`, JSON.stringify(updatedFavs));
      if (supabase) {
        try {
          await supabase.auth.updateUser({ data: { favorite_prompts: updatedFavs } });
          await supabase
            .from('user_favorites')
            .upsert({ user_id: currentUser.id, prompt_id: strPromptId }, { onConflict: 'user_id,prompt_id' });
        } catch (e) {}
      }
    }
  };

  // Top Up function
  const handleTopUp = async (amount) => {
    const newBal = (userCredits || 0) + amount;
    setUserCredits(newBal);

    if (currentUser) {
      localStorage.setItem(`user_credits_${currentUser.id}`, newBal.toString());
      await syncCreditsToDB(currentUser.id, currentUser.email, newBal);
    }

    setShowUpgradeModal(false);
  };

  // Persist purchase helper
  const persistPurchaseRecord = async (user, promptId) => {
    const strId = String(promptId);
    let nextPurchases = [];
    setPurchasedPromptIds(prev => {
      nextPurchases = Array.from(new Set([...prev, strId]));
      localStorage.setItem(`purchased_prompts_${user.id}`, JSON.stringify(nextPurchases));
      return nextPurchases;
    });

    if (supabase && user) {
      // 1. Sync directly to Supabase Auth User Metadata (Bypasses RLS issues & survives relogins)
      try {
        await supabase.auth.updateUser({
          data: { purchased_prompts: nextPurchases }
        });
      } catch (err) {}

      // 2. Sync to user_purchases DB Table using upsert
      try {
        await supabase
          .from('user_purchases')
          .upsert({ user_id: user.id, prompt_id: strId }, { onConflict: 'user_id,prompt_id' });
      } catch (err) {
        console.warn('Notice upserting into user_purchases DB:', err);
      }
    }
  };

  // Deduct Credits function
  const handleDeductCredits = async (costAmount, promptId, promptTitle) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return { success: false, reason: 'AUTH_REQUIRED' };
    }

    const strPromptId = String(promptId);

    if (purchasedPromptIds.includes(strPromptId)) {
      return { success: true, alreadyPurchased: true };
    }

    if (userCredits < costAmount) {
      return { success: false, reason: 'Kredit Anda tidak mencukupi.' };
    }

    const newBal = Math.max(0, userCredits - costAmount);
    setUserCredits(newBal);
    localStorage.setItem(`user_credits_${currentUser.id}`, newBal.toString());
    await persistPurchaseRecord(currentUser, strPromptId);
    await syncCreditsToDB(currentUser.id, currentUser.email, newBal);

    return { success: true };
  };

  const handleSignOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
    setUserCredits(0);
    setPurchasedPromptIds([]);
    setFavoritePromptIds([]);
    setTransactions([]);
  };

  // Categories
  const categories = ['All', 'Favorites', 'UI & Graphic', 'Product & Brand', 'Photography', 'Illustration & 3D', 'Poster Design', 'Food & Drink'];

  // Filtered prompts
  const filteredPrompts = promptsData.filter(prompt => {
    const strId = String(prompt.id);
    const matchesSearch = prompt.prompt.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          prompt.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCategory === 'Favorites') {
      return matchesSearch && favoritePromptIds.includes(strId);
    }

    const matchesCategory = selectedCategory === 'All' || prompt.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      {/* Agentation Visual DevTools Overlay */}
      <Agentation />

      {/* TOP-LEVEL DEDICATED ROUTER */}
      {currentPath.startsWith('/checkout/') ? (
        /* ROUTE -1: Dedicated 2-Column Checkout Page (/checkout/:planId) */
        <CheckoutView 
          planId={currentPath.replace('/checkout/', '') || '10k'}
          userCredits={userCredits}
          currentUser={currentUser}
          onNavigate={(path) => navigateTo(path)}
          onPaymentSuccess={(credits) => {
            handleTopUp(credits);
          }}
        />
      ) : currentPath === '/subscription' || currentPath === '/pricing' || currentPath === '/subs' ? (
        /* ROUTE 0: Dedicated Subscription & Top-up Page (/subscription) */
        <SubscriptionView 
          userCredits={userCredits}
          onClose={() => navigateTo('/')}
          onTopUp={handleTopUp}
        />
      ) : currentPath.startsWith('/view/') ? (
        /* ROUTE 1: Dedicated Editorial View (/view/:slug) */
        <PromptDetailView 
          prompt={activePrompt || promptsData[0]} 
          onClose={handleClosePrompt} 
          userCredits={userCredits}
          currentUser={currentUser}
          onOpenAuth={() => setShowAuthModal(true)}
          onSignOut={handleSignOut}
          isUnlocked={purchasedPromptIds.includes(String((activePrompt || promptsData[0]).id))}
          isFavorite={favoritePromptIds.includes(String((activePrompt || promptsData[0]).id))}
          onToggleFavorite={handleToggleFavorite}
          onDeductCredits={handleDeductCredits}
          onOpenUpgrade={() => navigateTo('/subscription')}
        />
      ) : currentPath === '/dashboard' ? (
        /* ROUTE 2: /dashboard (Galeri Lama) */
        <div className="min-h-screen bg-dark-bg text-zinc-100 flex flex-col">
          {/* Header / Navbar */}
          <header className="sticky top-0 z-40 w-full glassmorphism border-b border-white/5 py-4 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="rounded-xl bg-purple-600 p-2 shadow-lg shadow-purple-500/20">
                <SparklesIcon size={20} className="text-white fill-white" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-white m-0">Lorem <span className="text-purple-500">Ipsum</span></h1>
                <p className="text-[10px] text-zinc-500 font-medium flex items-center gap-1">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CloudIcon size={14} /> Supabase DB Persisted
                  </span>
                </p>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full max-w-md">
              <Search01Icon size={16} className="absolute left-3 top-2.5 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Cari prompt, kategori, atau pembuat..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full glassmorphism-input pl-9 pr-4 py-2 text-sm text-white rounded-xl focus:outline-none"
              />
            </div>

            {/* User Account & Credits Balance */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigateTo('/preview')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-purple-300 transition-all"
                title="Buka Preview Figma Portfolio (Node 18:54 - 50 Real Items)"
              >
                <ViewIcon size={14} /> Preview Figma (50 Items)
              </button>

              <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 px-3.5 py-1.5 rounded-xl text-purple-300 text-xs font-bold shadow-lg shadow-purple-500/5">
                <Coins01Icon size={16} className="text-purple-400" />
                <span>Saldo: {userCredits.toLocaleString()} Kredit</span>
              </div>

              {currentUser ? (
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-xs">
                  <UserIcon size={14} className="text-purple-400" />
                  <span className="max-w-[120px] truncate text-zinc-300">{currentUser.email}</span>
                  <button 
                    onClick={() => setShowHistoryModal(true)}
                    title="Lihat Riwayat Transaksi Audit Log"
                    className="ml-1 text-zinc-400 hover:text-purple-300 transition-colors"
                  >
                    <Clock01Icon size={14} />
                  </button>
                  <button 
                    onClick={handleSignOut}
                    title="Keluar / Logout"
                    className="ml-1 text-zinc-400 hover:text-red-400 transition-colors"
                  >
                    <Logout01Icon size={14} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 transition-all"
                >
                  <Login01Icon size={14} /> Masuk / Daftar
                </button>
              )}
              
              <button 
                onClick={() => {
                  if (!currentUser) {
                    setShowAuthModal(true);
                  } else {
                    setShowUpgradeModal(true);
                  }
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-500/10 transition-all duration-300 active:scale-95"
              >
                <SparklesIcon size={14} className="fill-white" /> Isi Kredit
              </button>
            </div>
          </header>

          {/* Hero Dashboard Stats */}
          <section className="px-6 md:px-12 py-8 max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
              <div className="p-5 rounded-2xl glassmorphism flex items-center gap-4">
                <div className="rounded-xl bg-purple-500/10 p-3 text-purple-400 border border-purple-500/20">
                  <Database01Icon size={24} />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Total Prompts</p>
                  <p className="text-2xl font-black text-white">{promptsData.length}+</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl glassmorphism flex items-center gap-4">
                <div className="rounded-xl bg-amber-500/10 p-3 text-amber-400 border border-amber-500/20">
                  <SparklesIcon size={24} />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Unlocked Prompts</p>
                  <p className="text-2xl font-black text-white">{purchasedPromptIds.length} Terbuka</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl glassmorphism flex items-center gap-4">
                <div className="rounded-xl bg-red-500/10 p-3 text-red-400 border border-red-500/20">
                  <FavouriteIcon size={24} />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Favorit Saya</p>
                  <p className="text-2xl font-black text-white">{favoritePromptIds.length} Prompt</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl glassmorphism flex items-center gap-4">
                <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400 border border-blue-500/20">
                  <GridIcon size={24} />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Kategori</p>
                  <p className="text-2xl font-black text-white">{categories.length - 2} Topik</p>
                </div>
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 border flex items-center gap-1.5 ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-500/10'
                      : 'bg-white/2 hover:bg-white/5 text-zinc-400 border-white/5'
                  }`}
                >
                  {cat === 'Favorites' && <Bookmark01Icon size={14} className="text-red-400 fill-red-400" />}
                  {cat}
                </button>
              ))}
            </div>

            {/* Prompts Gallery Grid */}
            {filteredPrompts.length > 0 ? (
              <div className="pinterest-grid mt-6">
                {filteredPrompts.map((prompt) => (
                  <PromptCard 
                    key={prompt.id} 
                    prompt={prompt} 
                    onOpenDetail={handleOpenPrompt}
                    isFavorite={favoritePromptIds.includes(String(prompt.id))}
                    isUnlocked={purchasedPromptIds.includes(String(prompt.id))}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 glassmorphism rounded-3xl mt-6">
                <p className="text-zinc-500 text-sm">Tidak menemukan prompt yang cocok dengan kriteria Anda.</p>
              </div>
            )}
          </section>

          {/* Footer */}
          <footer className="mt-auto py-6 border-t border-white/5 text-center text-xs text-zinc-600">
            <p>© 2026 Lorem Ipsum Platform. Persistent Architecture Verified.</p>
            <div className="mt-2">
              <button 
                onClick={() => navigateTo('/')} 
                className="text-purple-400 hover:underline font-bold"
              >
                Lihat Portfolio Utama
              </button>
            </div>
          </footer>
        </div>
      ) : (
        /* ROUTE 3: BASE ROUTE (/) Figma Portfolio Preview (Utama) */
        <FigmaPortfolioPreview 
          onOpenDetail={handleOpenPrompt}
          onNavigateHome={() => navigateTo('/')}
          favoritePromptIds={favoritePromptIds}
          purchasedPromptIds={purchasedPromptIds}
          userCredits={userCredits}
          userRole={userRole}
          currentUser={currentUser}
          onOpenAuth={() => setShowAuthModal(true)}
          onOpenUpgrade={() => navigateTo('/subscription')}
          onSignOut={handleSignOut}
        />
      )}



      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={(user) => {
            setCurrentUser(user);
            setShowAuthModal(false);
            fetchUserData(user);
          }}
        />
      )}

      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl glassmorphism p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock01Icon size={20} className="text-purple-400" /> Riwayat & Audit Log Transaksi
              </h3>
              <button 
                onClick={() => setShowHistoryModal(false)}
                className="text-zinc-400 hover:text-white text-xs px-2 py-1 bg-white/5 rounded-lg"
              >
                Tutup
              </button>
            </div>

            {transactions.length > 0 ? (
              <div className="flex flex-col gap-2">
                {transactions.map((tx) => (
                  <div key={tx.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-white">{tx.description || tx.type}</p>
                      <p className="text-[10px] text-zinc-500">{new Date(tx.created_at).toLocaleString()}</p>
                    </div>
                    <span className={`font-mono font-bold text-sm ${tx.amount > 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {tx.amount > 0 ? `+${tx.amount}` : tx.amount} Kredit
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 text-center py-8">Belum ada riwayat transaksi.</p>
            )}
          </div>
        </div>
      )}
      <Toaster position="bottom-right" />
    </>
  );
}

export default App;
