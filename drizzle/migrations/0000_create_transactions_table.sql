CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_reference text NOT NULL UNIQUE,
  package_type text NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  status text NOT NULL DEFAULT 'pending',
  order_tracking_id text,
  payment_method text,
  confirmation_code text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.transactions TO authenticated;
GRANT ALL ON public.transactions TO service_role;

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view transactions"
ON public.transactions
FOR SELECT
TO authenticated
USING (is_admin());