CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  merchant_reference TEXT NOT NULL UNIQUE,
  order_tracking_id TEXT UNIQUE,
  package_type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  confirmation_code TEXT,
  confirmation_email_sent_at TIMESTAMPTZ,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS transactions_order_tracking_id_idx
  ON public.transactions(order_tracking_id);

GRANT ALL ON public.transactions TO service_role;
