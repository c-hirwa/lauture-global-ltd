type CheckoutSessionPayload = {
  packageType: string;
  amount: number;
  customerEmail?: string;
  customerName?: string;
};

export async function createCheckoutSession({
  packageType,
  amount,
  customerEmail,
  customerName,
}: CheckoutSessionPayload) {
  const response = await fetch("/api/create-checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      packageType,
      amount,
      customerEmail,
      customerName,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.url) {
    throw new Error(data.error || "Unable to start checkout right now.");
  }

  window.location.assign(data.url);
}
