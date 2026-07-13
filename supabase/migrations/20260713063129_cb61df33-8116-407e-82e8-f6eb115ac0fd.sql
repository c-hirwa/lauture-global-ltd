
-- 1. Extend clients
ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS stage text NOT NULL DEFAULT 'enquiry_received',
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pending';

-- 2. Documents shared with clients
CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_email text NOT NULL,
  title text NOT NULL,
  description text,
  category text,
  file_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.documents TO authenticated;
GRANT ALL ON public.documents TO service_role;

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view their own documents"
  ON public.documents FOR SELECT
  TO authenticated
  USING (lower(client_email) = lower((auth.jwt() ->> 'email')));

-- 3. Read policies for clients + bookings (owner = matching email)
GRANT SELECT ON public.clients TO authenticated;
GRANT SELECT ON public.bookings TO authenticated;

CREATE POLICY "Clients can view their own record"
  ON public.clients FOR SELECT
  TO authenticated
  USING (lower(email) = lower((auth.jwt() ->> 'email')));

CREATE POLICY "Clients can view their own bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (lower(attendee_email) = lower((auth.jwt() ->> 'email')));
