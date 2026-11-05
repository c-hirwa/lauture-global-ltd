import { beforeEach, describe, expect, it, vi } from "vitest";

const sendEmail = vi.fn();
vi.mock("./email.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./email")>();
  return { ...actual, sendEmail: (...args: unknown[]) => sendEmail(...args) };
});
vi.mock("./pesapal.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./pesapal")>();
  const q = {
    select: () => q,
    ilike: () => q,
    order: () => q,
    limit: () => q,
    maybeSingle: async () => ({ data: { id: "c-9", full_name: "Ama Mensah" }, error: null }),
  };
  return { ...actual, getSupabaseAdmin: () => ({ from: () => q }) };
});

import handler from "../api/notify";

const call = async (req: Record<string, unknown>) => {
  let statusCode = 0;
  let body: unknown;
  const res = {
    status(code: number) {
      statusCode = code;
      return res;
    },
    json(b: unknown) {
      body = b;
      return b;
    },
  };
  await handler(req as never, res as never);
  return { statusCode, body };
};

const headers = { "x-webhook-secret": "s3cret" };

describe("/api/notify", () => {
  beforeEach(() => {
    process.env.NOTIFY_WEBHOOK_SECRET = "s3cret";
    process.env.TEAM_NOTIFY_EMAIL = "team@example.com";
    sendEmail.mockReset().mockResolvedValue("sent");
  });

  it("rejects requests without the right secret", async () => {
    expect((await call({ method: "POST", headers: { "x-webhook-secret": "nope" }, body: {} })).statusCode).toBe(401);
    expect((await call({ method: "POST", headers: {}, body: {} })).statusCode).toBe(401);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("only accepts POST", async () => {
    expect((await call({ method: "GET", headers })).statusCode).toBe(405);
  });

  it("emails the client and the team for a new intake", async () => {
    const { statusCode } = await call({
      method: "POST",
      headers,
      body: {
        type: "INSERT",
        schema: "public",
        table: "clients",
        record: { id: "c-1", full_name: "Ama Mensah", email: "ama@example.com", package_title: "Basic Guidance" },
      },
    });
    expect(statusCode).toBe(200);
    const recipients = sendEmail.mock.calls.map((c) => (c[1] as { to: string }).to).sort();
    expect(recipients).toEqual(["ama@example.com", "team@example.com"]);
  });

  it("emails the client when a document is shared", async () => {
    await call({
      method: "POST",
      headers,
      body: { type: "INSERT", schema: "public", table: "documents", record: { title: "Lease", client_email: "ama@example.com" } },
    });
    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(sendEmail.mock.calls[0][1]).toMatchObject({ to: "ama@example.com", relatedClientId: "c-9" });
  });

  it("ignores updates and other tables", async () => {
    await call({ method: "POST", headers, body: { type: "UPDATE", schema: "public", table: "clients", record: { id: "x" } } });
    await call({ method: "POST", headers, body: { type: "INSERT", schema: "public", table: "bookings", record: { id: "x" } } });
    expect(sendEmail).not.toHaveBeenCalled();
  });
});
