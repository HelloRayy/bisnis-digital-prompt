-- ========================================================
-- MIGRATION: INIT USER CREDITS TABLE & FUNCTIONS
-- ========================================================

-- 1. Create user_credits table
CREATE TABLE IF NOT EXISTS public.user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  credits INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_user_credits UNIQUE(user_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

-- 2. RLS Policies
CREATE POLICY "Users can view own credits" 
  ON public.user_credits 
  FOR SELECT 
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own credits" 
  ON public.user_credits 
  FOR UPDATE 
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own credits" 
  ON public.user_credits 
  FOR INSERT 
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

-- 3. Atomic Credit Deduction Function
CREATE OR REPLACE FUNCTION public.deduct_credits(cost_amount INT)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_bal INT;
  new_bal INT;
BEGIN
  SELECT credits INTO current_bal 
  FROM public.user_credits 
  WHERE user_id = auth.uid() 
  FOR UPDATE;

  IF current_bal IS NULL OR current_bal < cost_amount THEN
    RAISE EXCEPTION 'Kredit tidak mencukupi.';
  END IF;

  new_bal := current_bal - cost_amount;

  UPDATE public.user_credits 
  SET credits = new_bal, updated_at = now() 
  WHERE user_id = auth.uid();

  RETURN new_bal;
END;
$$;

-- 4. Atomic Credit Top-Up Function
CREATE OR REPLACE FUNCTION public.topup_credits(add_amount INT)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_bal INT;
BEGIN
  INSERT INTO public.user_credits (user_id, credits)
  VALUES (auth.uid(), add_amount)
  ON CONFLICT (user_id)
  DO UPDATE SET 
    credits = public.user_credits.credits + add_amount,
    updated_at = now()
  RETURNING credits INTO new_bal;

  RETURN new_bal;
END;
$$;
