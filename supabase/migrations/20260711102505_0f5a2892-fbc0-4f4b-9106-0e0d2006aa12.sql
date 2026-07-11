CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country_from TEXT,
  travelers TEXT,
  children_count INTEGER,
  purpose TEXT,
  lifestyle TEXT,
  timeline TEXT,
  package_id TEXT,
  package_title TEXT,
  package_price NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.clients TO anon, authenticated;
GRANT ALL ON public.clients TO service_role;

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit intake form"
  ON public.clients FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);