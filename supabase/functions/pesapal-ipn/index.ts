import { corsHeaders, syncTransaction } from "../_shared/pesapal.ts";

// Pesapal Instant Payment Notification webhook (GET or POST).
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  let orderTrackingId = url.searchParams.get("OrderTrackingId");
  let orderMerchantReference = url.searchParams.get("OrderMerchantReference");

  if (req.method === "POST") {
    const body = await req.json().catch(() => ({}));
    orderTrackingId = orderTrackingId || body.OrderTrackingId || body.orderTrackingId;
    orderMerchantReference =
      orderMerchantReference || body.OrderMerchantReference || body.orderMerchantReference;
  }

  if (!orderTrackingId) {
    return json({ error: "Missing OrderTrackingId" }, 400);
  }

  try {
    await syncTransaction(orderTrackingId);
    return json({
      orderNotificationType: "IPNCHANGE",
      orderTrackingId,
      orderMerchantReference,
      status: 200,
    });
  } catch (err) {
    console.error("pesapal-ipn failed:", err);
    return json(
      {
        orderNotificationType: "IPNCHANGE",
        orderTrackingId,
        orderMerchantReference,
        status: 500,
      },
      500,
    );
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
