import { timingSafeEqual } from "node:crypto";
import { firstParam, getSupabaseAdmin, type ApiRequest, type ApiResponse } from "../server/pesapal.js";
import {
  documentSharedClient,
  intakeReceivedClient,
  newEnquiryTeam,
  sendEmail,
  teamInbox,
  type ClientIntake,
  type SharedDocument,
} from "../server/email.js";

/**
 * Supabase Database Webhook receiver (Database → Webhooks in the Supabase dashboard).
 * Configure two webhooks, both POST to https://www.lautureglobal.com/api/notify with header
 * `x-webhook-secret: <NOTIFY_WEBHOOK_SECRET>`:
 *   - table public.clients,   event INSERT  → client "request received" + team "new enquiry"
 *   - table public.documents, event INSERT  → client "new document"
 * Payment emails are sent from server/pesapal.ts when Pesapal confirms a payment.
 */

type WebhookPayload = {
  type?: "INSERT" | "UPDATE" | "DELETE";
  table?: string;
  schema?: string;
  record?: Record<string, unknown> | null;
};

const secretMatches = (provided: string | undefined, expected: string) => {
  if (!provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const expected = process.env.NOTIFY_WEBHOOK_SECRET;
  if (!expected) {
    console.error("NOTIFY_WEBHOOK_SECRET is not configured");
    return res.status(500).json({ error: "Not configured" });
  }
  if (!secretMatches(firstParam(req.headers?.["x-webhook-secret"]), expected)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const payload = (req.body ?? {}) as WebhookPayload;
  const record = payload.record;
  if (payload.type !== "INSERT" || payload.schema !== "public" || !record) {
    return res.status(200).json({ ignored: true });
  }

  try {
    const supabase = getSupabaseAdmin();

    if (payload.table === "clients") {
      const client = record as unknown as ClientIntake;
      if (!client.email || !client.id) return res.status(200).json({ ignored: true });
      const [toClient, toTeam] = await Promise.all([
        sendEmail(supabase, { to: client.email, content: intakeReceivedClient(client), relatedClientId: client.id }),
        sendEmail(supabase, { to: teamInbox(), content: newEnquiryTeam(client), relatedClientId: client.id }),
      ]);
      return res.status(200).json({ client: toClient, team: toTeam });
    }

    if (payload.table === "documents") {
      const doc = record as unknown as SharedDocument;
      if (!doc.client_email) return res.status(200).json({ ignored: true });
      const { data: client } = await supabase
        .from("clients")
        .select("id, full_name")
        .ilike("email", doc.client_email)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle<{ id: string; full_name: string }>();
      const result = await sendEmail(supabase, {
        to: doc.client_email,
        content: documentSharedClient(doc, client?.full_name),
        relatedClientId: client?.id ?? null,
      });
      return res.status(200).json({ client: result });
    }

    return res.status(200).json({ ignored: true });
  } catch (error) {
    console.error("notify failed", { table: payload.table, error });
    // 500 lets Supabase retry; duplicates are suppressed in sendEmail.
    return res.status(500).json({ error: "Notification failed" });
  }
}
