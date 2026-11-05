import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders, getToken, submitOrder } from "../_shared/pesapal.ts";

// Server-side price map — never trust the client.
const PRICES: Record<string, number> = {
  basic: 525,
  comprehensive: 1260,
  premium: 2100,
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const { packageType, fullName, email, phone } = await req.json();

    const amount = PRICES[packageType];
    if (!amount) return json({ error: "Unknown package." }, 400);
    if (!fullName || !email) {
      return json({ error: "Name and email are required." }, 400);
    }

    const siteUrl = Deno.env.get("SITE_URL") || new URL(req.url).origin;
    const ipnId = Deno.env.get("PESAPAL_IPN_ID");
    if (!ipnId) throw new Error("PESAPAL_IPN_ID is not configured yet.");

    const merchantReference = `LG-${packageType}-${Date.now()}`;
    const [firstName, ...rest] = String(fullName).trim().split(" ");

    const token = await getToken();
    const order = await submitOrder(token, {
      id: merchantReference,
      currency: "USD",
      amount,
      description: `Lauture Global — ${packageType} package`,
      callback_url: `${siteUrl}/payment-success`,
      cancellation_url: `${siteUrl}/payment-failed`,
      notification_id: ipnId,
      billing_address: {
        email_address: email,
        phone_number: phone || undefined,
        first_name: firstName,
        last_name: rest.join(" ") || firstName,
        country_code: "RW",
      },
    });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { error } = await supabase.from("transactions").insert({
      merchant_reference: merchantReference,
      package_type: packageType,
      full_name: fullName,
      email,
      phone: phone || null,
      amount,
      currency: "USD",
      status: "pending",
      order_tracking_id: order.order_tracking_id ?? null,
    });
    if (error) throw error;

    return json({ redirect_url: order.redirect_url });
  } catch (err) {
    console.error("pesapal-create-order failed:", err);
    const message =
      err instanceof Error
        ? err.message
        : "Unable to start Mobile Money payment right now.";
    return json({ error: message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
