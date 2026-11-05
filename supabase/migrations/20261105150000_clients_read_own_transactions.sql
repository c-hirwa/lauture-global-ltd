-- Let signed-in clients see their own payments in the client portal.
-- Matches on email, like the existing clients/bookings/documents policies. That is only
-- safe while Supabase Auth requires email confirmation (otherwise anyone could sign up
-- with someone else's email); keep "Confirm email" enabled in Auth settings.

DROP POLICY IF EXISTS "Clients can view their own transactions" ON public.transactions;
CREATE POLICY "Clients can view their own transactions"
  ON public.transactions FOR SELECT
  TO authenticated
  USING (lower(email) = lower((auth.jwt() ->> 'email')));
