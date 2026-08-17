import React, { useState, useEffect, useRef } from 'react';
import promptsData from './data/prompts.json';
import PromptDetailView from './components/PromptDetailView';
import SubscriptionView from './components/SubscriptionView';
import CheckoutView from './components/CheckoutView';
import AuthModal from './components/AuthModal';
import FigmaPortfolioPreview from './components/FigmaPortfolioPreview';
import { getCleanShortSlug } from './utils/slug';
import { findPromptById, findPromptBySlugOrId } from './lib/prompts-service';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { Toaster } from '@/components/ui/sonner';
import { Clock01Icon } from 'hugeicons-react';
import MobileBottomDock from './components/ui/MobileBottomDock';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
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

  const homeScrollY = useRef(0);

  // Set manual scroll restoration on mount
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Helper untuk membuka prompt dengan URL dynamic route /view/:slug
  const handleOpenPrompt = (prompt, customPath = null) => {
    homeScrollY.current = window.scrollY || document.documentElement.scrollTop || 0;
    setActivePrompt(prompt);
    const targetPath = customPath || getCleanShortSlug(prompt);
    window.history.pushState({}, '', targetPath);
    setCurrentPath(targetPath);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  };

  const handleClosePrompt = () => {
    setActivePrompt(null);
    if (window.location.pathname.startsWith('/view/')) {
      window.history.pushState({}, '', '/');
      setCurrentPath('/');
    }
    const targetY = homeScrollY.current;
    requestAnimationFrame(() => {
      window.scrollTo({ top: targetY, behavior: 'instant' });
    });
  };

  const navigateTo = (path) => {
    if (currentPath === '/' || currentPath === '') {
      homeScrollY.current = window.scrollY || document.documentElement.scrollTop || 0;
    }

    window.history.pushState({}, '', path);
    setCurrentPath(path);

    // HANYA route subscription / checkout yang reset scroll ke posisi atas (0)
    if (path === '/subscription' || path === '/pricing' || path === '/subs' || path.startsWith('/checkout/')) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      });
    } else if (path === '/' || path === '') {
      // Kembali ke home feed -> pulihkan posisi scroll sebelumnya
      const targetY = homeScrollY.current;
      requestAnimationFrame(() => {
        window.scrollTo({ top: targetY, behavior: 'instant' });
      });
    }
  };

  // Listen to browser path changes (/view/:slug, /subscription, /checkout/:planId routes)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentPath(path);
      if (path.startsWith('/view/')) {
        const found = findPromptBySlugOrId(path.replace('/view/', ''));
        setActivePrompt(found || promptsData[0]);
        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, behavior: 'instant' });
        });
      } else {
        setActivePrompt(null);
        // HANYA route subscription / checkout yang reset scroll ke atas
        if (path === '/subscription' || path === '/pricing' || path === '/subs' || path.startsWith('/checkout/')) {
          requestAnimationFrame(() => {
            window.scrollTo({ top: 0, behavior: 'instant' });
          });
        } else if (path === '/' || path === '') {
          const targetY = homeScrollY.current;
          requestAnimationFrame(() => {
            window.scrollTo({ top: targetY, behavior: 'instant' });
          });
        }
      }
    };

    // Check initial path on load
    const initialPath = window.location.pathname;
    setCurrentPath(initialPath);
    if (initialPath.startsWith('/view/')) {
      const found = findPromptBySlugOrId(initialPath.replace('/view/', ''));
      setActivePrompt(found || promptsData[0]);
    } else if (initialPath === '/subscription' || initialPath === '/pricing' || initialPath === '/subs' || initialPath.startsWith('/checkout/')) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      });
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Helper to sync credits to Supabase DB and Auth Metadata
  const syncCreditsToDB = async (userId, userEmail, newBal) => {
    if (!supabase || !userId) return;

    try {
      await supabase.auth.updateUser({
        data: { credits: newBal }
      });
    } catch (e) {}

    try {
      const { error: err1 } = await supabase.from('user_credits').update({ credits: newBal }).eq('user_id', userId);
      if (err1) {
        await supabase.from('user_credits').update({ credits: newBal }).eq('id', userId);
        if (userEmail) await supabase.from('user_credits').update({ credits: newBal }).eq('email', userEmail);
      }
    } catch (e) {}

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
      let fetchedCredits = null;
      let fetchedRole = null;

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

      if (fetchedCredits === null) {
        try {
          const { data: p1 } = await supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle();
          if (p1) {
            if (typeof p1.credits === 'number' && p1.credits !== null) fetchedCredits = p1.credits;
            if (p1.role || p1.plan_tier) fetchedRole = fetchedRole || p1.role || p1.plan_tier;
          }
        } catch (e) {}
      }

      if (fetchedCredits === null && user.user_metadata) {
        if (typeof user.user_metadata.credits === 'number' && user.user_metadata.credits !== null) {
          fetchedCredits = user.user_metadata.credits;
        }
        if (!fetchedRole && (user.user_metadata.role || user.user_metadata.plan_tier)) {
          fetchedRole = user.user_metadata.role || user.user_metadata.plan_tier;
        }
      }

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

      // Fetch User Unlocked Purchases
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

      // Fetch User Favorites
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

      // Fetch Transactions Log
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
      try {
        supabase.auth.getSession().then((res) => {
          const session = res?.data?.session;
          const user = session?.user || null;
          setCurrentUser(user);
          if (user) fetchUserData(user);
        }).catch((err) => {
          console.warn('[Supabase Auth Offline / 521]', err?.message || err);
        });

        const authListener = supabase.auth.onAuthStateChange((_event, session) => {
          const user = session?.user || null;
          setCurrentUser(user);
          if (user) fetchUserData(user);
        });

        const subscription = authListener?.data?.subscription;
        return () => {
          if (subscription?.unsubscribe) subscription.unsubscribe();
        };
      } catch (err) {
        console.warn('[Supabase Auth Error Handled]', err);
      }
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
      try {
        await supabase.auth.updateUser({
          data: { purchased_prompts: nextPurchases }
        });
      } catch (err) {}

      try {
        await supabase
          .from('user_purchases')
          .upsert({ user_id: user.id, prompt_id: strId }, { onConflict: 'user_id,prompt_id' });
      } catch (err) {
        console.warn('Notice upserting into user_purchases DB:', err);
      }
    }
  };

  // Deduct Credits function (Optimistic UI Update 0ms)
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

    // 1. Optimistic Real-Time UI state update
    const newBal = Math.max(0, userCredits - costAmount);
    setUserCredits(newBal);
    setPurchasedPromptIds(prev => Array.from(new Set([...prev, strPromptId])));

    // 2. Immediate Local Storage Sync
    try {
      localStorage.setItem(`user_credits_${currentUser.id}`, newBal.toString());
      const existing = JSON.parse(localStorage.getItem(`purchased_prompts_${currentUser.id}`) || '[]');
      const nextPurchases = Array.from(new Set([...existing, strPromptId]));
      localStorage.setItem(`purchased_prompts_${currentUser.id}`, JSON.stringify(nextPurchases));
    } catch (e) {}

    // 3. Background async database sync
    persistPurchaseRecord(currentUser, strPromptId).catch(() => {});
    syncCreditsToDB(currentUser.id, currentUser.email, newBal).catch(() => {});

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

  return (
    <>
      {/* HIGH-PERFORMANCE DEDICATED ROUTER */}
      {currentPath.startsWith('/checkout') ? (
        /* ROUTE -1: Dedicated 2-Column Checkout Page (/checkout or /checkout/:planId) */
        <CheckoutView 
          planId={currentPath.replace(/^\/checkout\/?/, '') || '10k'}
          userCredits={userCredits}
          currentUser={currentUser}
          onNavigate={(path) => navigateTo(path)}
          onPaymentSuccess={(credits) => {
            handleTopUp(credits);
          }}
        />
      ) : currentPath === '/subscription' || currentPath === '/pricing' || currentPath === '/subs' ? (
        <SubscriptionView 
          userCredits={userCredits}
          userRole={userRole}
          currentUser={currentUser}
          favoritePromptIds={favoritePromptIds}
          purchasedPromptIds={purchasedPromptIds}
          onClose={() => navigateTo('/')}
          onNavigate={(path) => navigateTo(path)}
          onTopUp={handleTopUp}
          onOpenAuth={() => setShowAuthModal(true)}
          onSignOut={handleSignOut}
        />
      ) : currentPath.startsWith('/view/') ? (
        <PromptDetailView 
          prompt={activePrompt || promptsData[0]} 
          onClose={handleClosePrompt} 
          userCredits={userCredits}
          userRole={userRole}
          currentUser={currentUser}
          favoritePromptIds={favoritePromptIds}
          purchasedPromptIds={purchasedPromptIds}
          onOpenAuth={() => setShowAuthModal(true)}
          onSignOut={handleSignOut}
          isUnlocked={purchasedPromptIds.includes(String((activePrompt || promptsData[0]).id))}
          isFavorite={favoritePromptIds.includes(String((activePrompt || promptsData[0]).id))}
          onToggleFavorite={handleToggleFavorite}
          onDeductCredits={handleDeductCredits}
          onOpenUpgrade={() => navigateTo('/subscription')}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            handleClosePrompt();
          }}
        />
      ) : (
        <FigmaPortfolioPreview 
          onOpenDetail={handleOpenPrompt}
          onNavigateHome={() => navigateTo('/')}
          favoritePromptIds={favoritePromptIds}
          purchasedPromptIds={purchasedPromptIds}
          userCredits={userCredits}
          userRole={userRole}
          currentUser={currentUser}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenAuth={() => setShowAuthModal(true)}
          onOpenUpgrade={() => navigateTo('/subscription')}
          onSignOut={handleSignOut}
        />
      )}

      {/* Mobile Bottom Dock Floating Navigation */}
      {!currentPath.startsWith('/checkout') && (
        <MobileBottomDock 
          currentPath={currentPath}
          activeCategory={activeCategory}
          favoriteCount={favoritePromptIds.length}
          onNavigate={(path) => navigateTo(path)}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            if (currentPath !== '/') {
              navigateTo('/');
            }
          }}
          onOpenSearch={() => {
            if (currentPath !== '/') {
              navigateTo('/');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenUpgrade={() => navigateTo('/subscription')}
          onOpenHistory={() => setShowHistoryModal(true)}
          onOpenAuth={() => setShowAuthModal(true)}
          currentUser={currentUser}
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
      <Toaster position="top-right" offset="24px" />
    </>
  );
}

export default App;
