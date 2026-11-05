import { createClient } from "@supabase/supabase-js";
import { submitOrder } from "../server/pesapal.js";

const prices: Record<string, number> = {
  basic: 525,
  comprehensive: 1260,
  premium: 2100,
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { packageType, fullName, email, phone } = req.body ?? {};
    if (!packageType || !prices[packageType] || !fullName || !email || !phone) {
      return res.status(400).json({ error: "Package, full name, email and phone are required." });
    }

    const siteUrl = process.env.SITE_URL;
    const ipnId = process.env.PESAPAL_IPN_ID;
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!siteUrl || !ipnId || !supabaseUrl || !serviceRoleKey) {
      throw new Error("Payment configuration is incomplete. Please contact support.");
    }

    const merchantReference = `LG-${packageType}-${Date.now()}`;
    const nameParts = String(fullName).trim().split(/\s+/);
    const firstName = nameParts.shift() || String(fullName);
    const lastName = nameParts.join(" ") || firstName;
    const result = await submitOrder({
      id: merchantReference,
      currency: "USD",
      amount: prices[packageType],
      description: `Lauture Global ${packageType} package`,
      callback_url: `${siteUrl.replace(/\/$/, "")}/payment-success`,
      cancellation_url: `${siteUrl.replace(/\/$/, "")}/payment-failed`,
      notification_id: ipnId,
      billing_address: {
        email_address: email,
        phone_number: phone,
        first_name: firstName,
        last_name: lastName,
      },
    });

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const { error } = await supabase.from("transactions").insert({
      merchant_reference: merchantReference,
      package_type: packageType,
      amount: prices[packageType],
      currency: "USD",
      status: "pending",
      payment_method: "Pesapal",
      full_name: String(fullName),
      email: String(email),
      phone: String(phone),
    });
    if (error) throw error;

    return res.status(200).json({ redirect_url: result.redirect_url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to start Pesapal payment.";
    return res.status(500).json({ error: message });
  }
}
