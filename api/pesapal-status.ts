import { firstParam, syncTransaction, type ApiRequest, type ApiResponse } from "../server/pesapal.js";

// GET ?orderTrackingId=... — used by /payment-success. Returns only the status, never payment details.
export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const orderTrackingId = firstParam(req.query?.orderTrackingId) ?? firstParam(req.query?.OrderTrackingId);
  if (!orderTrackingId) return res.status(400).json({ error: "orderTrackingId is required." });

  try {
    const { status, merchant_reference } = await syncTransaction(orderTrackingId);
    return res.status(200).json({ status, merchantReference: merchant_reference });
  } catch (error) {
    console.error("Pesapal status check failed", error);
    return res.status(500).json({ error: "Unable to verify this payment right now." });
  }
}
