-- Security fix (2026-11-05)
--
-- 1. Earlier migrations (20260827182449, 20260827184106) made every new signup an
--    admin and promoted every existing user. Sign-up is public at /login, so anyone
--    could create an account and open /admin. New users now always get 'client'
--    (the role is no longer read from user metadata either, since the signer-up
--    controls that), and every existing admin is demoted.
--
--    AFTER APPLYING: re-promote your real staff by hand, e.g.
--      UPDATE public.profiles SET role = 'admin', updated_at = now()
--      WHERE email IN ('staff1@example.com', 'staff2@example.com');
--
-- 2. public.transactions was created without row-level security. Supabase grants
--    anon/authenticated access to public tables by default, so customer names,
--    emails, phones and payment status were readable (and writable) with the
--    public anon key. RLS is now on, client roles lose direct access, and only
--    admins can read. The server code uses the service role, which bypasses RLS.

-- 1. Signup trigger: always 'client'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1)),
    'client'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;

UPDATE public.profiles
SET role = 'client', updated_at = now()
WHERE role = 'admin';

-- 2. Lock down transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.transactions FROM anon, authenticated;
GRANT SELECT ON public.transactions TO authenticated;
GRANT ALL ON public.transactions TO service_role;

DROP POLICY IF EXISTS "Admins can view transactions" ON public.transactions;
CREATE POLICY "Admins can view transactions"
  ON public.transactions FOR SELECT
  TO authenticated
  USING (public.is_admin());
