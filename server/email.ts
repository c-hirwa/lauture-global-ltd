// Transactional email for Lauture Global: templates + a sender that logs every attempt
// to public.notifications (sent / failed / skipped). Server-only (uses secrets).
import type { SupabaseClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export type EmailContent = { subject: string; html: string; text: string };

const BRAND = {
  name: "Lauture Global LTD",
  navy: "#0D1B5E",
  gold: "#D4AF37",
  phone: "+250 792 866 210",
  whatsapp: "https://wa.me/250792866210",
  email: "info@lautureglobal.com",
};

export const escapeHtml = (value: unknown) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

const firstName = (fullName?: string | null) => (fullName || "").trim().split(/\s+/)[0] || "there";

const siteUrl = () => (process.env.SITE_URL || "https://www.lautureglobal.com").replace(/\/$/, "");

/** Simple, table-based layout that renders consistently in Gmail, Outlook and mobile clients. */
function layout({ preheader, heading, body, cta }: { preheader: string; heading: string; body: string; cta?: { label: string; url: string } }) {
  const button = cta
    ? `<tr><td style="padding:8px 0 24px"><a href="${escapeHtml(cta.url)}" style="display:inline-block;background:${BRAND.gold};color:#0A1128;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:8px">${escapeHtml(cta.label)}</a></td></tr>`
    : "";
  return `<!doctype html><html><body style="margin:0;background:#F4F6FB;font-family:Arial,Helvetica,sans-serif;color:#0A1128">
<span style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6FB;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden">
<tr><td style="background:${BRAND.navy};padding:20px 28px;color:#ffffff;font-size:18px;font-weight:bold;letter-spacing:.5px">LAUTURE <span style="color:${BRAND.gold}">GLOBAL</span></td></tr>
<tr><td style="height:3px;background:${BRAND.gold}"></td></tr>
<tr><td style="padding:28px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="font-size:22px;font-weight:bold;color:${BRAND.navy};padding-bottom:12px">${escapeHtml(heading)}</td></tr>
<tr><td style="font-size:15px;line-height:1.6;padding-bottom:16px">${body}</td></tr>
${button}
</table></td></tr>
<tr><td style="padding:18px 28px;background:#F8F9FC;font-size:12px;line-height:1.6;color:#5B6478">
${BRAND.name} · KG 17 Avenue, Remera, Kigali, Rwanda<br>
WhatsApp <a href="${BRAND.whatsapp}" style="color:${BRAND.navy}">${BRAND.phone}</a> · <a href="mailto:${BRAND.email}" style="color:${BRAND.navy}">${BRAND.email}</a>
</td></tr></table></td></tr></table></body></html>`;
}

const row = (label: string, value: unknown) =>
  value ? `<tr><td style="padding:4px 12px 4px 0;color:#5B6478;white-space:nowrap">${escapeHtml(label)}</td><td style="padding:4px 0">${escapeHtml(value)}</td></tr>` : "";

const details = (rows: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px;margin:8px 0">${rows}</table>`;

const textBlock = (lines: (string | false | null | undefined)[]) =>
  lines.filter(Boolean).join("\n") + `\n\n— ${BRAND.name}\nWhatsApp ${BRAND.phone} · ${BRAND.email}`;

// ---------- Templates ----------

export type ClientIntake = {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  country_from?: string | null;
  travelers?: string | null;
  purpose?: string | null;
  timeline?: string | null;
  package_title?: string | null;
  package_price?: number | string | null;
};

export function intakeReceivedClient(c: ClientIntake): EmailContent {
  const portal = `${siteUrl()}/login?mode=signup&email=${encodeURIComponent(c.email)}`;
  const pkg = c.package_title || "your package";
  return {
    subject: "We've received your request — Lauture Global",
    html: layout({
      preheader: `Thanks ${firstName(c.full_name)}, here's what happens next.`,
      heading: `Thank you, ${firstName(c.full_name)}!`,
      body: `We've received your request for <strong>${escapeHtml(pkg)}</strong>. Here's what happens next:
<ol style="padding-left:20px;margin:12px 0">
<li>If you haven't paid yet, you can complete payment securely from your client portal (Mobile Money or card via Pesapal).</li>
<li>Book your first consultation at a time that suits you.</li>
<li>Our team will be in touch to start planning your journey.</li>
</ol>
Create your portal account with this email address to track your progress, book sessions and receive documents.`,
      cta: { label: "Open your client portal", url: portal },
    }),
    text: textBlock([
      `Thank you, ${firstName(c.full_name)}!`,
      "",
      `We've received your request for ${pkg}.`,
      "1. If you haven't paid yet, complete payment from your client portal (Mobile Money or card via Pesapal).",
      "2. Book your first consultation.",
      "3. Our team will be in touch to start planning your journey.",
      "",
      `Client portal: ${portal}`,
    ]),
  };
}

export function newEnquiryTeam(c: ClientIntake): EmailContent {
  const adminUrl = `${siteUrl()}/admin/clients/${c.id}`;
  const price = c.package_price != null ? `$${Number(c.package_price).toLocaleString("en-US")}` : null;
  return {
    subject: `New enquiry: ${c.full_name} — ${c.package_title || "no package"}`,
    html: layout({
      preheader: `${c.full_name} submitted the intake form.`,
      heading: "New client enquiry",
      body: details(
        row("Name", c.full_name) +
          row("Email", c.email) +
          row("Phone", c.phone) +
          row("From", c.country_from) +
          row("Package", c.package_title && price ? `${c.package_title} (${price})` : c.package_title) +
          row("Travelers", c.travelers) +
          row("Purpose", c.purpose) +
          row("Timeline", c.timeline),
      ),
      cta: { label: "Open in admin", url: adminUrl },
    }),
    text: textBlock([
      "New client enquiry",
      `Name: ${c.full_name}`,
      `Email: ${c.email}`,
      c.phone && `Phone: ${c.phone}`,
      c.country_from && `From: ${c.country_from}`,
      c.package_title && `Package: ${c.package_title}${price ? ` (${price})` : ""}`,
      c.travelers && `Travelers: ${c.travelers}`,
      c.purpose && `Purpose: ${c.purpose}`,
      c.timeline && `Timeline: ${c.timeline}`,
      "",
      `Admin: ${adminUrl}`,
    ]),
  };
}

export type PaymentInfo = {
  full_name: string;
  email: string;
  amount: number | string;
  currency: string;
  packageName: string;
  merchant_reference: string;
  confirmation_code?: string | null;
};

export function paymentConfirmedClient(p: PaymentInfo): EmailContent {
  const amount = `${p.currency} ${Number(p.amount).toLocaleString("en-US")}`;
  return {
    subject: "Payment confirmed — Lauture Global",
    html: layout({
      preheader: `Your payment of ${amount} has been confirmed.`,
      heading: `Thank you, ${firstName(p.full_name)}!`,
      body: `Your payment has been confirmed. Our team will contact you shortly to schedule your first consultation.${details(
        row("Package", p.packageName) +
          row("Amount", amount) +
          row("Reference", p.merchant_reference) +
          row("Confirmation code", p.confirmation_code),
      )}`,
      cta: { label: "Go to your client portal", url: `${siteUrl()}/dashboard` },
    }),
    text: textBlock([
      `Thank you, ${firstName(p.full_name)}!`,
      "Your payment has been confirmed. Our team will contact you shortly to schedule your first consultation.",
      "",
      `Package: ${p.packageName}`,
      `Amount: ${amount}`,
      `Reference: ${p.merchant_reference}`,
      p.confirmation_code && `Confirmation code: ${p.confirmation_code}`,
      "",
      `Client portal: ${siteUrl()}/dashboard`,
    ]),
  };
}

export function paymentConfirmedTeam(p: PaymentInfo): EmailContent {
  const amount = `${p.currency} ${Number(p.amount).toLocaleString("en-US")}`;
  return {
    subject: `Payment received: ${amount} from ${p.full_name}`,
    html: layout({
      preheader: `${p.full_name} paid ${amount}.`,
      heading: "Payment received",
      body: details(
        row("Client", p.full_name) +
          row("Email", p.email) +
          row("Package", p.packageName) +
          row("Amount", amount) +
          row("Reference", p.merchant_reference) +
          row("Confirmation code", p.confirmation_code),
      ),
      cta: { label: "View payments", url: `${siteUrl()}/admin/payments` },
    }),
    text: textBlock([
      "Payment received",
      `Client: ${p.full_name} (${p.email})`,
      `Package: ${p.packageName}`,
      `Amount: ${amount}`,
      `Reference: ${p.merchant_reference}`,
      p.confirmation_code && `Confirmation code: ${p.confirmation_code}`,
    ]),
  };
}

export type SharedDocument = { title: string; description?: string | null; client_email: string };

export function documentSharedClient(d: SharedDocument, clientName?: string | null): EmailContent {
  const url = `${siteUrl()}/dashboard?tab=documents`;
  return {
    subject: `New document: ${d.title}`,
    html: layout({
      preheader: `${d.title} is ready in your client portal.`,
      heading: "A new document is ready for you",
      body: `Hello ${escapeHtml(firstName(clientName))}, the Lauture Global team has shared <strong>${escapeHtml(d.title)}</strong> with you.${
        d.description ? `<br><br>${escapeHtml(d.description)}` : ""
      }<br><br>Sign in to your client portal to view and download it.`,
      cta: { label: "View document", url },
    }),
    text: textBlock([
      `Hello ${firstName(clientName)},`,
      `The Lauture Global team has shared "${d.title}" with you.`,
      d.description,
      "",
      `View it in your client portal: ${url}`,
    ]),
  };
}

// ---------- Sending ----------

export const teamInbox = () => process.env.TEAM_NOTIFY_EMAIL || BRAND.email;

export type SendResult = "sent" | "failed" | "skipped" | "duplicate";

/**
 * Sends one email via Resend and records it in public.notifications.
 * Skips (and logs "skipped") when RESEND_API_KEY isn't set, and skips silently when the
 * same subject was already sent to the same recipient for the same client (webhook retries).
 */
export async function sendEmail(
  supabase: SupabaseClient,
  opts: { to: string; content: EmailContent; relatedClientId?: string | null },
): Promise<SendResult> {
  const { to, content, relatedClientId = null } = opts;

  let dupQuery = supabase
    .from("notifications")
    .select("id")
    .eq("recipient_email", to)
    .eq("subject", content.subject)
    .eq("status", "sent")
    .limit(1);
  dupQuery = relatedClientId ? dupQuery.eq("related_client_id", relatedClientId) : dupQuery.is("related_client_id", null);
  const { data: dup } = await dupQuery;
  if (dup?.length) return "duplicate";

  const apiKey = process.env.RESEND_API_KEY;
  let status: SendResult = "skipped";
  if (apiKey) {
    try {
      const { error } = await new Resend(apiKey).emails.send({
        from: process.env.RESEND_FROM || "Lauture Global <onboarding@resend.dev>",
        replyTo: process.env.RESEND_REPLY_TO || BRAND.email,
        to: [to],
        subject: content.subject,
        html: content.html,
        text: content.text,
      });
      status = error ? "failed" : "sent";
      if (error) console.error("Resend error", { to, subject: content.subject, error });
    } catch (err) {
      status = "failed";
      console.error("Resend request failed", { to, subject: content.subject, err });
    }
  } else {
    console.warn("RESEND_API_KEY not set; email skipped", { to, subject: content.subject });
  }

  const { error: logError } = await supabase.from("notifications").insert({
    recipient_email: to,
    subject: content.subject,
    body: content.text.slice(0, 2000),
    channel: "email",
    status,
    related_client_id: relatedClientId,
  });
  if (logError) console.error("Could not log notification", logError);

  return status;
}
