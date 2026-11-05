// Pesapal API 3.0 (JSON) helpers shared by the Vercel functions in /api.
// Docs: https://developer.pesapal.com/how-to-integrate/e-commerce/api-30-json/api-reference
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// Minimal request/response shapes for Vercel Node functions.
export type ApiRequest = {
  method?: string;
  body?: Record<string, unknown> | null;
  query?: Record<string, string | string[] | undefined>;
};
export type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => unknown;
};

// Server-side price list (USD). Never trust prices sent by the browser.
export const PACKAGE_PRICES: Record<string, number> = {
  basic: 525,
  comprehensive: 1260,
  premium: 2100,
};

export const PACKAGE_NAMES: Record<string, string> = {
  basic: "Basic Relocation Guidance",
  comprehensive: "Comprehensive Strategy & Assistance",
  premium: "Full Premium Service",
};

export type PaymentStatus = "pending" | "completed" | "failed" | "reversed" | "amount_mismatch";

const getBaseUrl = () =>
  process.env.PESAPAL_ENV === "live" ? "https://pay.pesapal.com/v3" : "https://cybqa.pesapal.com/pesapalv3";

export const required = (name: string) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
};

export const getSupabaseAdmin = (): SupabaseClient =>
  createClient(required("SUPABASE_URL"), required("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false },
  });

export const firstParam = (value: unknown): string | undefined => {
  const v = Array.isArray(value) ? value[0] : value;
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
};

const escapeHtml = (value: unknown) =>
  String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

// Tokens last ~5 minutes; fetch a fresh one per request.
async function getToken(): Promise<string> {
  const response = await fetch(`${getBaseUrl()}/api/Auth/RequestToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      consumer_key: required("PESAPAL_CONSUMER_KEY"),
      consumer_secret: required("PESAPAL_CONSUMER_SECRET"),
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.token) {
    throw new Error(`Pesapal authentication failed (${response.status}): ${data.message || data.error?.message || ""}`);
  }
  return data.token;
}

export async function submitOrder(
  body: Record<string, unknown>,
): Promise<{ redirect_url: string; order_tracking_id?: string }> {
  const token = await getToken();
  const response = await fetch(`${getBaseUrl()}/api/Transactions/SubmitOrderRequest`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.error || !data.redirect_url) {
    throw new Error(`Pesapal order submission failed (${response.status}): ${data.error?.message || data.message || ""}`);
  }
  return data;
}

// Pesapal status_code: 0 invalid, 1 completed, 2 failed, 3 reversed.
const normalizeStatus = (code: unknown, description: unknown): Exclude<PaymentStatus, "amount_mismatch"> => {
  const desc = String(description ?? "").trim().toLowerCase();
  if (code === 1 || desc === "completed") return "completed";
  if (code === 3 || desc === "reversed") return "reversed";
  if (code === 2 || code === 0 || desc === "failed" || desc === "invalid") return "failed";
  return "pending";
};

type TransactionRow = {
  id: string;
  status: string;
  email: string;
  full_name: string;
  merchant_reference: string;
  package_type: string;
  amount: number | string;
  currency: string;
};

/**
 * Asks Pesapal for the real status of an order and records it.
 * The callback URL and IPN carry no trustworthy status, so this is the only
 * place a transaction's status changes.
 */
export async function syncTransaction(orderTrackingId: string): Promise<{ status: PaymentStatus; merchant_reference: string }> {
  const token = await getToken();
  const url = `${getBaseUrl()}/api/Transactions/GetTransactionStatus?orderTrackingId=${encodeURIComponent(orderTrackingId)}`;
  const response = await fetch(url, { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || (result.error && result.error.code)) {
    throw new Error(`Pesapal status check failed (${response.status}): ${result.error?.message || result.message || ""}`);
  }

  const supabase = getSupabaseAdmin();
  const columns = "id,status,email,full_name,merchant_reference,package_type,amount,currency";

  let { data: row, error } = await supabase
    .from("transactions")
    .select(columns)
    .eq("order_tracking_id", orderTrackingId)
    .maybeSingle<TransactionRow>();
  if (error) throw error;

  const merchantReference: string | undefined = result.merchant_reference;
  if (!row && merchantReference) {
    ({ data: row, error } = await supabase
      .from("transactions")
      .select(columns)
      .eq("merchant_reference", merchantReference)
      .maybeSingle<TransactionRow>());
    if (error) throw error;
  }
  if (!row) throw new Error(`No transaction found for order ${orderTrackingId}.`);

  let status: PaymentStatus = normalizeStatus(result.status_code, result.payment_status_description);

  // Don't mark an order paid unless Pesapal received the full amount in the right currency.
  if (status === "completed") {
    const paid = Number(result.amount);
    const expected = Number(row.amount);
    const currencyOk = String(result.currency || "").toUpperCase() === String(row.currency).toUpperCase();
    if (!currencyOk || !(paid >= expected)) {
      console.error("Pesapal amount mismatch", { orderTrackingId, paid, currency: result.currency, expected, expectedCurrency: row.currency });
      status = "amount_mismatch";
    }
  }

  // Completed is final, except that Pesapal can later report a reversal.
  const canUpdate = row.status !== "completed" || status === "reversed";
  if (canUpdate && row.status !== status) {
    const { error: updateError } = await supabase
      .from("transactions")
      .update({
        status,
        order_tracking_id: orderTrackingId,
        payment_method: result.payment_method || "Pesapal",
        confirmation_code: result.confirmation_code || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", row.id);
    if (updateError) throw updateError;
  }

  const finalStatus = (canUpdate ? status : row.status) as PaymentStatus;

  if (finalStatus === "completed") {
    await sendConfirmationEmailOnce(supabase, row, result.confirmation_code).catch((e) =>
      console.error("Confirmation email failed", e),
    );
  }

  return { status: finalStatus, merchant_reference: row.merchant_reference };
}

async function sendConfirmationEmailOnce(supabase: SupabaseClient, row: TransactionRow, confirmationCode?: string) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  // Claim the email atomically so the IPN and the success page can't both send it.
  const { data: claimed, error } = await supabase
    .from("transactions")
    .update({ confirmation_email_sent_at: new Date().toISOString() })
    .eq("id", row.id)
    .is("confirmation_email_sent_at", null)
    .select("id");
  if (error) throw error;
  if (!claimed?.length) return;

  const resend = new Resend(resendKey);
  const { error: sendError } = await resend.emails.send({
    from: process.env.RESEND_FROM || "Lauture Global LTD <onboarding@resend.dev>",
    to: [row.email],
    subject: "Payment confirmed - Lauture Global LTD",
    html: `
      <div style="font-family: sans-serif; color: #0A1128;">
        <h2 style="color: #0D1B5E;">Thank you, ${escapeHtml(row.full_name || "there")}!</h2>
        <p>Your payment of <strong>${escapeHtml(row.currency)} ${escapeHtml(row.amount)}</strong> for the
        <strong>${escapeHtml(PACKAGE_NAMES[row.package_type] || row.package_type)}</strong> package has been confirmed.</p>
        <p>Transaction reference: <strong>${escapeHtml(row.merchant_reference)}</strong></p>
        ${confirmationCode ? `<p>Confirmation code: <strong>${escapeHtml(confirmationCode)}</strong></p>` : ""}
        <p>Our team will be in touch shortly to begin your journey.</p>
        <p style="color: #D4AF37;">— Lauture Global LTD</p>
      </div>`,
  });
  if (sendError) {
    // Release the claim so a later sync can retry.
    await supabase.from("transactions").update({ confirmation_email_sent_at: null }).eq("id", row.id);
    throw sendError;
  }
}
