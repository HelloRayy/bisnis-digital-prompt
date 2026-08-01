-- ========================================================
-- ADVANCED SUPABASE DATABASE SCHEMA & LOGIC FOR AI PROMPT APP
-- Features: 
-- 1. Atomic Credits & Idempotency
-- 2. Transaction Audit Logs
-- 3. One-time Unlock (User Purchases)
-- 4. Favorites & Bookmarks
-- 5. Welcome Bonus Triggers
-- ========================================================

-- DROP OLD OVERLOADED FUNCTIONS IF THEY EXIST
DROP FUNCTION IF EXISTS public.deduct_credits(INT);
DROP FUNCTION IF EXISTS public.deduct_credits(INT, TEXT, TEXT, UUID);
DROP FUNCTION IF EXISTS public.topup_credits(INT);
DROP FUNCTION IF EXISTS public.topup_credits(INT, TEXT, UUID);

-- 1. USER CREDITS TABLE
CREATE TABLE IF NOT EXISTS public.user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  credits INT NOT NULL DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_user_credits UNIQUE(user_id)
);

ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own credits" ON public.user_credits;
DROP POLICY IF EXISTS "Users can update own credits" ON public.user_credits;
DROP POLICY IF EXISTS "Users can insert own credits" ON public.user_credits;

CREATE POLICY "Users can view own credits" 
  ON public.user_credits FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own credits" 
  ON public.user_credits FOR UPDATE TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own credits" 
  ON public.user_credits FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

-- 2. USER PURCHASES / UNLOCKED PROMPTS TABLE
CREATE TABLE IF NOT EXISTS public.user_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  prompt_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_user_prompt_purchase UNIQUE(user_id, prompt_id)
);

ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own purchases" ON public.user_purchases;
DROP POLICY IF EXISTS "Users can insert own purchases" ON public.user_purchases;

CREATE POLICY "Users can view own purchases" 
  ON public.user_purchases FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own purchases" 
  ON public.user_purchases FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

-- 3. CREDIT TRANSACTIONS AUDIT LOG TABLE
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount INT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('TOPUP', 'USAGE', 'WELCOME_BONUS')),
  prompt_id TEXT,
  description TEXT,
  idempotency_key UUID UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own transactions" ON public.credit_transactions;

CREATE POLICY "Users can view own transactions" 
  ON public.credit_transactions FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

-- 4. USER FAVORITES / BOOKMARKS TABLE
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  prompt_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_user_favorite UNIQUE(user_id, prompt_id)
);

ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own favorites" ON public.user_favorites;
DROP POLICY IF EXISTS "Users can insert own favorites" ON public.user_favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON public.user_favorites;

CREATE POLICY "Users can view own favorites" 
  ON public.user_favorites FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own favorites" 
  ON public.user_favorites FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own favorites" 
  ON public.user_favorites FOR DELETE TO authenticated
  USING ((select auth.uid()) = user_id);


-- 5. AUTOMATIC WELCOME BONUS TRIGGER (50 FREE CREDITS)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Insert 50 welcome credits
  INSERT INTO public.user_credits (user_id, credits)
  VALUES (NEW.id, 50)
  ON CONFLICT (user_id) DO NOTHING;

  -- Record welcome transaction log
  INSERT INTO public.credit_transactions (user_id, amount, type, description)
  VALUES (NEW.id, 50, 'WELCOME_BONUS', 'Bonus Selamat Datang Pengguna Baru')
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 6. PUBLIC PROFILES VIEW
CREATE OR REPLACE VIEW public.profiles AS
SELECT 
  id,
  email,
  created_at,
  last_sign_in_at
FROM auth.users;

GRANT SELECT ON public.profiles TO authenticated, service_role, anon;


-- 7. ATOMIC TOP-UP FUNCTION WITH AUDIT LOG & IDEMPOTENCY
CREATE OR REPLACE FUNCTION public.topup_credits(
  add_amount INT,
  p_description TEXT DEFAULT 'Isi Ulang Kredit',
  p_idempotency_key UUID DEFAULT NULL
)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_new_bal INT;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Pengguna tidak terautentikasi.';
  END IF;

  -- 1. Check idempotency
  IF p_idempotency_key IS NOT NULL THEN
    IF EXISTS (SELECT 1 FROM public.credit_transactions WHERE idempotency_key = p_idempotency_key) THEN
      SELECT credits INTO v_new_bal FROM public.user_credits WHERE user_id = v_user_id;
      RETURN v_new_bal;
    END IF;
  END IF;

  -- 2. Update credits atomically
  INSERT INTO public.user_credits (user_id, credits)
  VALUES (v_user_id, add_amount)
  ON CONFLICT (user_id)
  DO UPDATE SET 
    credits = public.user_credits.credits + add_amount,
    updated_at = now()
  RETURNING credits INTO v_new_bal;

  -- 3. Log transaction
  INSERT INTO public.credit_transactions (user_id, amount, type, description, idempotency_key)
  VALUES (v_user_id, add_amount, 'TOPUP', p_description, p_idempotency_key);

  RETURN v_new_bal;
END;
$$;


-- 8. ATOMIC DEDUCT FUNCTION WITH ONE-TIME PURCHASES & IDEMPOTENCY
CREATE OR REPLACE FUNCTION public.deduct_credits(
  cost_amount INT,
  p_prompt_id TEXT DEFAULT NULL,
  p_description TEXT DEFAULT 'Penggunaan Prompt Premium',
  p_idempotency_key UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_current_bal INT;
  v_new_bal INT;
  v_already_purchased BOOLEAN := FALSE;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Pengguna tidak terautentikasi.';
  END IF;

  -- 1. Check idempotency
  IF p_idempotency_key IS NOT NULL THEN
    IF EXISTS (SELECT 1 FROM public.credit_transactions WHERE idempotency_key = p_idempotency_key) THEN
      SELECT credits INTO v_new_bal FROM public.user_credits WHERE user_id = v_user_id;
      RETURN jsonb_build_object(
        'credits', v_new_bal,
        'already_purchased', true,
        'deducted', 0
      );
    END IF;
  END IF;

  -- 2. Check if already purchased (One-Time Unlock Logic)
  IF p_prompt_id IS NOT NULL THEN
    IF EXISTS (SELECT 1 FROM public.user_purchases WHERE user_id = v_user_id AND prompt_id = p_prompt_id) THEN
      SELECT credits INTO v_new_bal FROM public.user_credits WHERE user_id = v_user_id;
      RETURN jsonb_build_object(
        'credits', COALESCE(v_new_bal, 0),
        'already_purchased', true,
        'deducted', 0
      );
    END IF;
  END IF;

  -- 3. Lock & check balance
  SELECT credits INTO v_current_bal 
  FROM public.user_credits 
  WHERE user_id = v_user_id 
  FOR UPDATE;

  IF v_current_bal IS NULL OR v_current_bal < cost_amount THEN
    RAISE EXCEPTION 'Kredit tidak mencukupi.';
  END IF;

  -- 4. Deduct balance
  v_new_bal := v_current_bal - cost_amount;

  UPDATE public.user_credits 
  SET credits = v_new_bal, updated_at = now() 
  WHERE user_id = v_user_id;

  -- 5. Record unlock purchase
  IF p_prompt_id IS NOT NULL THEN
    INSERT INTO public.user_purchases (user_id, prompt_id)
    VALUES (v_user_id, p_prompt_id)
    ON CONFLICT (user_id, prompt_id) DO NOTHING;
  END IF;

  -- 6. Log transaction
  INSERT INTO public.credit_transactions (user_id, amount, type, prompt_id, description, idempotency_key)
  VALUES (v_user_id, -cost_amount, 'USAGE', p_prompt_id, p_description, p_idempotency_key);

  RETURN jsonb_build_object(
    'credits', v_new_bal,
    'already_purchased', false,
    'deducted', cost_amount
  );
END;
$$;
