// Shared Pesapal API 3.0 (JSON) helpers.
// Docs: https://developer.pesapal.com/how-to-integrate/e-commerce/api-30-json/api-reference

import { createClient } from "jsr:@supabase/supabase-js@2";

const BASE_URL =
  Deno.env.get("PESAPAL_ENV") === "live"
    ? "https://pay.pesapal.com/v3"
    : "https://cybqa.pesapal.com/pesapalv3";

function pesapalKeys() {
  const consumerKey = Deno.env.get("PESAPAL_CONSUMER_KEY");
  const consumerSecret = Deno.env.get("PESAPAL_CONSUMER_SECRET");
  if (!consumerKey || !consumerSecret) {
    throw new Error("Pesapal credentials are not configured yet.");
  }
  return { consumerKey, consumerSecret };
}

// Token lasts ~5 minutes — fetch a fresh one per request.
export async function getToken(): Promise<string> {
  const { consumerKey, consumerSecret } = pesapalKeys();
  const res = await fetch(`${BASE_URL}/api/Auth/RequestToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.token) {
    throw new Error(`Pesapal authentication failed (${res.status}).`);
  }
  return data.token as string;
}

export async function submitOrder(
  token: string,
  body: Record<string, unknown>,
): Promise<{ redirect_url: string; order_tracking_id: string }> {
  const res = await fetch(`${BASE_URL}/api/Transactions/SubmitOrderRequest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.redirect_url) {
    throw new Error(
      data?.error?.message || `Pesapal order submission failed (${res.status}).`,
    );
  }
  return data;
}

export type TransactionStatus = {
  merchant_reference: string;
  order_tracking_id: string;
  status: string;
  payment_method: string | null;
  confirmation_code: string | null;
};

// The callback and IPN carry no payment status — always verify via GetTransactionStatus.
export async function syncTransaction(
  orderTrackingId: string,
): Promise<TransactionStatus> {
  const token = await getToken();
  const res = await fetch(
    `${BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${encodeURIComponent(orderTrackingId)}`,
    { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } },
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Pesapal status check failed (${res.status}).`);
  }

  const rawStatus = (data.payment_status_description || "").toLowerCase();
  const status =
    rawStatus === "completed"
      ? "completed"
      : rawStatus === "failed" || rawStatus === "reversed"
        ? "failed"
        : "pending";

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const merchantReference = data.merchant_reference as string | undefined;
  if (!merchantReference) {
    throw new Error("Pesapal did not return a merchant reference.");
  }

  // Only update rows not already completed.
  const { data: row, error: readError } = await supabase
    .from("transactions")
    .select("id, status, email, full_name, package_type, amount, currency")
    .eq("merchant_reference", merchantReference)
    .maybeSingle();
  if (readError) throw readError;

  if (row && row.status !== "completed") {
    const { error: updateError } = await supabase
      .from("transactions")
      .update({
        status,
        order_tracking_id: orderTrackingId,
        payment_method: data.payment_method ?? null,
        confirmation_code: data.confirmation_code ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("merchant_reference", merchantReference);
    if (updateError) throw updateError;

    // Send the confirmation email once, when the payment first completes.
    if (status === "completed") {
      await sendConfirmationEmail(row, data.confirmation_code).catch((e) =>
        console.error("Confirmation email failed:", e),
      );
    }
  }

  return {
    merchant_reference: merchantReference,
    order_tracking_id: orderTrackingId,
    status,
    payment_method: data.payment_method ?? null,
    confirmation_code: data.confirmation_code ?? null,
  };
}

async function sendConfirmationEmail(
  row: {
    email: string;
    full_name: string;
    package_type: string;
    amount: number;
    currency: string;
  },
  confirmationCode: string | null,
) {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) {
    console.log("RESEND_API_KEY not set — skipping confirmation email.");
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendKey}`,
    },
    body: JSON.stringify({
      from: "Lauture Global <onboarding@resend.dev>",
      to: [row.email],
      subject: "Payment confirmed — Lauture Global LTD",
      html: `
        <div style="font-family: sans-serif; color: #0A1128;">
          <h2 style="color: #0D1B5E;">Thank you, ${row.full_name}!</h2>
          <p>Your payment of <strong>${row.currency} ${row.amount}</strong> for the
          <strong>${row.package_type}</strong> package has been confirmed.</p>
          ${confirmationCode ? `<p>Confirmation code: <strong>${confirmationCode}</strong></p>` : ""}
          <p>Our team will be in touch shortly to begin your journey.</p>
          <p style="color: #D4AF37;">— Lauture Global LTD</p>
        </div>`,
    }),
  });
  if (!res.ok) {
    throw new Error(`Resend failed (${res.status}): ${await res.text()}`);
  }
}

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};
