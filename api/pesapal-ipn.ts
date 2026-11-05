import { firstParam, syncTransaction, type ApiRequest, type ApiResponse } from "../server/pesapal.js";

// Pesapal Instant Payment Notification (register this URL's IPN ID as PESAPAL_IPN_ID).
// Accepts GET or POST. The notification itself isn't trusted; we re-check the status with Pesapal.
export default async function handler(req: ApiRequest, res: ApiResponse) {
  const query = req.query ?? {};
  const body = req.body ?? {};
  const orderTrackingId = firstParam(query.OrderTrackingId) ?? firstParam(body.OrderTrackingId);
  const orderMerchantReference = firstParam(query.OrderMerchantReference) ?? firstParam(body.OrderMerchantReference) ?? null;

  if (!orderTrackingId) return res.status(400).json({ error: "OrderTrackingId is required." });

  try {
    await syncTransaction(orderTrackingId);
    return res.status(200).json({ orderNotificationType: "IPNCHANGE", orderTrackingId, orderMerchantReference, status: 200 });
  } catch (error) {
    console.error("Pesapal IPN sync failed", error);
    // A 500 tells Pesapal to retry the notification later.
    return res.status(500).json({ orderNotificationType: "IPNCHANGE", orderTrackingId, orderMerchantReference, status: 500 });
  }
}
