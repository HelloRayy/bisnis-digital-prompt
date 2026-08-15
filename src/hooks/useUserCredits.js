import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useUserCredits(currentUser) {
  const [userCredits, setUserCredits] = useState(0);
  const [userRole, setUserRole] = useState('Starter Plan');
  const [transactions, setTransactions] = useState([]);

  // Sync credits to DB & Auth User Metadata
  const syncCreditsToDB = useCallback(async (userId, userEmail, newBal) => {
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
  }, []);

  // Fetch User Data from Supabase
  const fetchUserData = useCallback(async (user) => {
    if (!user || !supabase) return;

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

      const metaCredits = user.user_metadata?.credits;
      const metaRole = user.user_metadata?.role || user.user_metadata?.plan_tier;

      let finalCredits = 0;
      if (fetchedCredits !== null) {
        finalCredits = fetchedCredits;
      } else if (typeof metaCredits === 'number' && metaCredits !== null) {
        finalCredits = metaCredits;
      } else {
        const cachedCred = localStorage.getItem(`user_credits_${user.id}`);
        if (cachedCred !== null) finalCredits = parseInt(cachedCred, 10);
      }

      setUserCredits(finalCredits);

      let finalRole = "Starter Plan";
      if (fetchedRole) {
        finalRole = fetchedRole;
      } else if (metaRole) {
        finalRole = metaRole;
      } else {
        const cachedRole = localStorage.getItem(`user_role_${user.id}`);
        if (cachedRole) finalRole = cachedRole;
      }
      setUserRole(finalRole);

      // Fetch Transaction Audit Trail
      try {
        const { data: txList } = await supabase.from('transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
        if (txList) setTransactions(txList);
      } catch (e) {}

    } catch (err) {
      console.error("Error in fetchUserData:", err);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchUserData(currentUser);
    } else {
      setUserCredits(0);
      setUserRole('Starter Plan');
      setTransactions([]);
    }
  }, [currentUser, fetchUserData]);

  return {
    userCredits,
    setUserCredits,
    userRole,
    setUserRole,
    transactions,
    setTransactions,
    syncCreditsToDB,
    fetchUserData
  };
}
