import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const getBaseUrl = () => {
  const env = process.env.PESAPAL_ENV === "live" ? "live" : "sandbox";
  return env === "live" ? "https://pay.pesapal.com/v3" : "https://cybqa.pesapal.com/pesapalv3";
};

const required = (name: string) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
};

export async function getToken(): Promise<string> {
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
    throw new Error(data.message || data.error || "Unable to authenticate with Pesapal.");
  }
  return data.token;
}

export async function submitOrder(body: Record<string, unknown>) {
  const token = await getToken();
  const response = await fetch(`${getBaseUrl()}/api/Transactions/SubmitOrderRequest`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.error || !data.redirect_url) {
    throw new Error(data.message || data.error?.message || "Unable to create the Pesapal order.");
  }
  return data;
}

const normalizePesapalStatus = (value?: string) => {
  const status = String(value || "").trim().toLowerCase();
  if (["completed", "complete", "success", "successful", "1"].includes(status)) return "completed";
  if (["failed", "failure", "invalid", "2"].includes(status)) return "failed";
  return "pending";
};

export async function syncTransaction(orderTrackingId: string) {
  const token = await getToken();
  const url = `${getBaseUrl()}/api/Transactions/GetTransactionStatus?orderTrackingId=${encodeURIComponent(orderTrackingId)}`;
  const response = await fetch(url, { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.error) {
    throw new Error(result.message || result.error?.message || "Unable to verify Pesapal payment status.");
  }

  const merchantReference = result.merchant_reference || result.order_merchant_reference || result.merchantReference;
  const status = normalizePesapalStatus(
    result.payment_status_description || result.status_description || result.status || result.payment_status,
  );

  const supabase = createClient(required("SUPABASE_URL"), required("SUPABASE_SERVICE_ROLE_KEY"));
  const { data: transaction, error: lookupError } = await supabase
    .from("transactions")
    .select("id,status,email,full_name,merchant_reference,confirmation_email_sent_at")
    .eq("order_tracking_id", orderTrackingId)
    .maybeSingle();

  let row = transaction;
  if (!row && merchantReference) {
    const { data, error } = await supabase
      .from("transactions")
      .select("id,status,email,full_name,merchant_reference,confirmation_email_sent_at")
      .eq("merchant_reference", merchantReference)
      .maybeSingle();
    if (error) throw error;
    row = data;
  }
  if (lookupError) throw lookupError;
  if (!row) throw new Error("Transaction was not found in Supabase.");

  if (row.status !== "completed") {
    const { error: updateError } = await supabase
      .from("transactions")
      .update({
        status,
        order_tracking_id: orderTrackingId,
        payment_method: result.payment_method || result.payment_method_description || "Pesapal",
        confirmation_code: result.confirmation_code || null,
      })
      .eq("id", row.id)
      .neq("status", "completed");
    if (updateError) throw updateError;

    if (status === "completed" && !row.confirmation_email_sent_at) {
      const resendKey = process.env.RESEND_API_KEY;
      if (!resendKey || !row.email) return { ...result, status };
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: process.env.RESEND_FROM || "Lauture Global LTD <onboarding@resend.dev>",
        to: [row.email],
        subject: "Payment confirmed - Lauture Global LTD",
        html: `<p>Hello ${row.full_name || "there"},</p><p>Your payment has been confirmed. Thank you for choosing Lauture Global LTD.</p><p>Transaction reference: ${row.merchant_reference}</p>`,
      });
      await supabase.from("transactions").update({ confirmation_email_sent_at: new Date().toISOString() }).eq("id", row.id);
    }
  }

  return { ...result, status, orderTrackingId };
}
