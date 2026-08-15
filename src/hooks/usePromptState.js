import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { findPromptBySlugOrId, getPromptsData } from '../lib/prompts-service';
import { getCleanShortSlug } from '../utils/slug';

export function usePromptState(currentUser) {
  const [purchasedPromptIds, setPurchasedPromptIds] = useState([]);
  const [favoritePromptIds, setFavoritePromptIds] = useState([]);
  const [activePrompt, setActivePrompt] = useState(null);
  const [currentPath, setCurrentPath] = useState(typeof window !== 'undefined' ? window.location.pathname : '/');

  // Load cached purchases & favorites from localStorage or Supabase
  useEffect(() => {
    if (currentUser) {
      try {
        const pStr = localStorage.getItem(`purchased_prompts_${currentUser.id}`);
        if (pStr) setPurchasedPromptIds(JSON.parse(pStr));
        const fStr = localStorage.getItem(`favorite_prompts_${currentUser.id}`);
        if (fStr) setFavoritePromptIds(JSON.parse(fStr));
      } catch (e) {}

      // Optionally sync from Supabase purchases table
      if (supabase) {
        supabase.from('purchases').select('prompt_id').eq('user_id', currentUser.id).then(({ data }) => {
          if (data && data.length > 0) {
            const dbIds = data.map(d => String(d.prompt_id));
            setPurchasedPromptIds(prev => Array.from(new Set([...prev, ...dbIds])));
          }
        }).catch(() => {});
      }
    } else {
      setPurchasedPromptIds([]);
      setFavoritePromptIds([]);
    }
  }, [currentUser]);

  // Route & popstate listener for /view/:slug
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentPath(path);
      if (path.startsWith('/view/')) {
        const found = findPromptBySlugOrId(path);
        setActivePrompt(found || getPromptsData()[0]);
      } else {
        setActivePrompt(null);
      }
    };

    const initialPath = window.location.pathname;
    setCurrentPath(initialPath);
    if (initialPath.startsWith('/view/')) {
      const found = findPromptBySlugOrId(initialPath);
      setActivePrompt(found || getPromptsData()[0]);
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleOpenPrompt = useCallback((prompt, customPath = null) => {
    setActivePrompt(prompt);
    const targetPath = customPath || getCleanShortSlug(prompt);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', targetPath);
      setCurrentPath(targetPath);
    }
  }, []);

  const handleClosePrompt = useCallback(() => {
    setActivePrompt(null);
    if (typeof window !== 'undefined') {
      if (window.location.pathname.startsWith('/view/')) {
        window.history.pushState({}, '', '/');
        setCurrentPath('/');
      }
    }
  }, []);

  const toggleFavorite = useCallback((promptId) => {
    const pIdStr = String(promptId);
    setFavoritePromptIds(prev => {
      const isFav = prev.includes(pIdStr);
      const updated = isFav ? prev.filter(id => id !== pIdStr) : [...prev, pIdStr];
      if (currentUser) {
        localStorage.setItem(`favorite_prompts_${currentUser.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  }, [currentUser]);

  const addPurchasedPrompt = useCallback((promptId) => {
    const pIdStr = String(promptId);
    setPurchasedPromptIds(prev => {
      if (prev.includes(pIdStr)) return prev;
      const updated = [...prev, pIdStr];
      if (currentUser) {
        localStorage.setItem(`purchased_prompts_${currentUser.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  }, [currentUser]);

  return {
    purchasedPromptIds,
    setPurchasedPromptIds,
    favoritePromptIds,
    setFavoritePromptIds,
    activePrompt,
    setActivePrompt,
    currentPath,
    setCurrentPath,
    handleOpenPrompt,
    handleClosePrompt,
    toggleFavorite,
    addPurchasedPrompt
  };
}
