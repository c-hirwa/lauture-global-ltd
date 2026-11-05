import {
  PACKAGE_NAMES,
  PACKAGE_PRICES,
  getSupabaseAdmin,
  required,
  submitOrder,
  type ApiRequest,
  type ApiResponse,
} from "../server/pesapal.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (value: unknown, max: number) => String(value ?? "").trim().slice(0, max);

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const body = req.body ?? {};
  const packageType = clean(body.packageType, 32);
  const fullName = clean(body.fullName, 120);
  const email = clean(body.email, 254).toLowerCase();
  const phone = clean(body.phone, 32);
  const amount = PACKAGE_PRICES[packageType];

  if (!amount) return res.status(400).json({ error: "Please choose a valid package." });
  if (!fullName || !EMAIL_RE.test(email) || !phone) {
    return res.status(400).json({ error: "Full name, a valid email and a phone number are required." });
  }

  let supabase: ReturnType<typeof getSupabaseAdmin>;
  let siteUrl: string;
  let ipnId: string;
  try {
    supabase = getSupabaseAdmin();
    siteUrl = required("SITE_URL").replace(/\/$/, "");
    ipnId = required("PESAPAL_IPN_ID");
  } catch (error) {
    console.error("Pesapal configuration error", error);
    return res.status(500).json({ error: "Payments are temporarily unavailable. Please contact support." });
  }

  const merchantReference = `LG-${packageType}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  // Record the order first, so a payment can never arrive for an order we don't know about.
  const { error: insertError } = await supabase.from("transactions").insert({
    merchant_reference: merchantReference,
    package_type: packageType,
    amount,
    currency: "USD",
    status: "pending",
    payment_method: "Pesapal",
    full_name: fullName,
    email,
    phone,
  });
  if (insertError) {
    console.error("Could not record transaction", insertError);
    return res.status(500).json({ error: "Unable to start payment. Please try again." });
  }

  try {
    const [firstName, ...rest] = fullName.split(/\s+/);
    const order = await submitOrder({
      id: merchantReference,
      currency: "USD",
      amount,
      description: `Lauture Global - ${PACKAGE_NAMES[packageType]}`.slice(0, 100),
      callback_url: `${siteUrl}/payment-success`,
      cancellation_url: `${siteUrl}/payment-failed`,
      notification_id: ipnId,
      billing_address: {
        email_address: email,
        phone_number: phone,
        first_name: firstName,
        last_name: rest.join(" ") || firstName,
      },
    });

    if (order.order_tracking_id) {
      await supabase
        .from("transactions")
        .update({ order_tracking_id: order.order_tracking_id, updated_at: new Date().toISOString() })
        .eq("merchant_reference", merchantReference);
    }

    return res.status(200).json({ redirect_url: order.redirect_url });
  } catch (error) {
    console.error("Pesapal order submission failed", error);
    await supabase
      .from("transactions")
      .update({ status: "failed", updated_at: new Date().toISOString() })
      .eq("merchant_reference", merchantReference);
    return res.status(502).json({ error: "Unable to start payment with Pesapal. Please try again." });
  }
}
