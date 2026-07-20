import Stripe from "stripe";

const packageNames: Record<string, string> = {
  basic: "Basic Relocation Guidance",
  comprehensive: "Comprehensive Strategy & Assistance",
  premium: "Full Premium Service",
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    return res.status(500).json({ error: "Stripe secret key is not configured." });
  }

  const { packageType, amount, customerEmail, customerName } = req.body ?? {};

  if (!packageType || typeof amount !== "number") {
    return res.status(400).json({ error: "A valid package type and amount are required." });
  }

  const stripe = new Stripe(stripeSecretKey);
  const siteUrl = process.env.VITE_SITE_URL || "http://localhost:5173";

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customerEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: packageNames[packageType] || "Lauture Global LTD Package",
              description: "Lauture Global LTD — Relocation Consulting Package",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/success?package=${encodeURIComponent(packageType)}`,
      cancel_url: `${siteUrl}/services`,
      metadata: {
        packageType,
        customerName: customerName || "",
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to create checkout session.";
    return res.status(500).json({ error: message });
  }
}
