import { corsHeaders, syncTransaction } from "../_shared/pesapal.ts";

// GET ?orderTrackingId=... — verifies with Pesapal and syncs the local record.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const orderTrackingId = new URL(req.url).searchParams.get("orderTrackingId");
  if (!orderTrackingId) {
    return json({ error: "Missing orderTrackingId" }, 400);
  }

  try {
    const result = await syncTransaction(orderTrackingId);
    return json(result);
  } catch (err) {
    console.error("pesapal-status failed:", err);
    const message =
      err instanceof Error ? err.message : "Unable to check payment status.";
    return json({ error: message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
