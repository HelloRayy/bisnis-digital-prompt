import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    // Check active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
    });

    // Listen to Auth State Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
  };

  return {
    currentUser,
    setCurrentUser,
    handleSignOut,
    isSupabaseConfigured
  };
}
