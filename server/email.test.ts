import { beforeEach, describe, expect, it, vi } from "vitest";

const send = vi.fn();
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

import {
  documentSharedClient,
  escapeHtml,
  intakeReceivedClient,
  newEnquiryTeam,
  paymentConfirmedClient,
  sendEmail,
} from "./email";

// Minimal stand-in for the Supabase query builder: records inserts, answers selects from `rows`.
function fakeSupabase(rows: Record<string, unknown[]> = {}) {
  const inserts: { table: string; row: Record<string, unknown> }[] = [];
  const client = {
    inserts,
    from(table: string) {
      const q = {
        select: () => q,
        eq: () => q,
        is: () => q,
        ilike: () => q,
        order: () => q,
        limit: () => q,
        maybeSingle: async () => ({ data: (rows[table] ?? [])[0] ?? null, error: null }),
        insert: async (row: Record<string, unknown>) => {
          inserts.push({ table, row });
          return { error: null };
        },
        then: (resolve: (v: unknown) => unknown) => resolve({ data: rows[table] ?? [], error: null }),
      };
      return q;
    },
  };
  return client;
}

const client = {
  id: "c-1",
  full_name: "Ama <script>alert(1)</script> Mensah",
  email: "ama@example.com",
  phone: "+250700000000",
  package_title: "Comprehensive Strategy & Assistance",
  package_price: 1260,
  purpose: "Relocation",
};

describe("email templates", () => {
  it("escapes user input in HTML", () => {
    const { html } = newEnquiryTeam(client);
    expect(html).not.toContain("<script>");
    expect(html).toContain(escapeHtml("<script>"));
  });

  it("gives every template a subject, HTML and plain-text version", () => {
    for (const t of [
      intakeReceivedClient(client),
      newEnquiryTeam(client),
      documentSharedClient({ title: "Visa checklist", client_email: client.email }, client.full_name),
      paymentConfirmedClient({
        full_name: client.full_name,
        email: client.email,
        amount: 1260,
        currency: "USD",
        packageName: "Comprehensive Strategy & Assistance",
        merchant_reference: "LG-comprehensive-1",
      }),
    ]) {
      expect(t.subject.length).toBeGreaterThan(5);
      expect(t.html).toContain("<!doctype html>");
      expect(t.text).toContain("Lauture Global");
    }
  });

  it("links the team alert to the client in the admin", () => {
    expect(newEnquiryTeam(client).text).toContain("/admin/clients/c-1");
    expect(newEnquiryTeam(client).text).toContain("$1,260");
  });
});

describe("sendEmail", () => {
  beforeEach(() => {
    send.mockReset();
    delete process.env.RESEND_API_KEY;
  });

  it("logs 'skipped' and sends nothing when Resend isn't configured", async () => {
    const sb = fakeSupabase();
    const result = await sendEmail(sb as never, { to: "a@example.com", content: intakeReceivedClient(client) });
    expect(result).toBe("skipped");
    expect(send).not.toHaveBeenCalled();
    expect(sb.inserts[0].row).toMatchObject({ status: "skipped", recipient_email: "a@example.com" });
  });

  it("sends and logs 'sent' when configured", async () => {
    process.env.RESEND_API_KEY = "re_test";
    send.mockResolvedValue({ data: { id: "1" }, error: null });
    const sb = fakeSupabase();
    const result = await sendEmail(sb as never, { to: "a@example.com", content: intakeReceivedClient(client), relatedClientId: "c-1" });
    expect(result).toBe("sent");
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ to: ["a@example.com"], text: expect.any(String) }));
    expect(sb.inserts[0].row).toMatchObject({ status: "sent", related_client_id: "c-1" });
  });

  it("logs 'failed' when the provider rejects the email", async () => {
    process.env.RESEND_API_KEY = "re_test";
    send.mockResolvedValue({ data: null, error: { message: "domain not verified" } });
    const sb = fakeSupabase();
    expect(await sendEmail(sb as never, { to: "a@example.com", content: intakeReceivedClient(client) })).toBe("failed");
    expect(sb.inserts[0].row).toMatchObject({ status: "failed" });
  });

  it("doesn't resend an email that was already sent (webhook retry)", async () => {
    process.env.RESEND_API_KEY = "re_test";
    const sb = fakeSupabase({ notifications: [{ id: "n-1" }] });
    expect(await sendEmail(sb as never, { to: "a@example.com", content: intakeReceivedClient(client) })).toBe("duplicate");
    expect(send).not.toHaveBeenCalled();
    expect(sb.inserts).toHaveLength(0);
  });
});
