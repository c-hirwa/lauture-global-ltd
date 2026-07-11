
CREATE TABLE public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_uid text,
  event_type text,
  package_id text,
  package_title text,
  attendee_name text,
  attendee_email text,
  start_time timestamptz,
  end_time timestamptz,
  status text default 'confirmed',
  raw jsonb,
  created_at timestamptz not null default now()
);

GRANT INSERT ON public.bookings TO anon, authenticated;
GRANT ALL ON public.bookings TO service_role;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create bookings"
  ON public.bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
