import { syncTransaction } from "../server/pesapal.js";

export default async function handler(req: any, res: any) {
  try {
    const body = req.body ?? {};
    const query = req.query ?? {};
    const orderTrackingId = query.OrderTrackingId || query.orderTrackingId || body.OrderTrackingId || body.orderTrackingId;
    const orderMerchantReference = query.OrderMerchantReference || query.orderMerchantReference || body.OrderMerchantReference || body.orderMerchantReference;

    if (!orderTrackingId) return res.status(400).json({ error: "OrderTrackingId is required." });
    await syncTransaction(orderTrackingId);

    return res.status(200).json({
      orderNotificationType: "IPNCHANGE",
      orderTrackingId,
      orderMerchantReference: orderMerchantReference || null,
      status: 200,
    });
  } catch (error: unknown) {
    console.error("Pesapal IPN verification failed", error);
    return res.status(500).json({ error: "Payment verification failed." });
  }
}
