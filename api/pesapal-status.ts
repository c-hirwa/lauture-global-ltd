import { syncTransaction } from "../server/pesapal.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const orderTrackingId = req.query?.orderTrackingId;
    if (!orderTrackingId || typeof orderTrackingId !== "string") {
      return res.status(400).json({ error: "orderTrackingId is required." });
    }
    const result = await syncTransaction(orderTrackingId);
    return res.status(200).json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to verify payment.";
    return res.status(500).json({ error: message });
  }
}
