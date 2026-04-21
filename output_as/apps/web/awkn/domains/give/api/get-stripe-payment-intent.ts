import "server-only";

type StripePaymentIntent = {
  amount?: number;
  currency?: string;
  customer?: string | null;
  id?: string;
  metadata?: Record<string, string | undefined> | null;
  receipt_email?: string | null;
  status?: string;
};

export async function getStripePaymentIntent(paymentIntentId: string) {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Stripe secret key is not configured.");
  }

  const response = await fetch(
    `https://api.stripe.com/v1/payment_intents/${paymentIntentId}`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
      method: "GET",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Stripe payment intent lookup failed: ${errorText}`);
  }

  const data = (await response.json()) as StripePaymentIntent;

  if (!data.id) {
    throw new Error("Stripe did not return a payment intent id.");
  }

  return {
    amount: data.amount ?? 0,
    currency: data.currency ?? "usd",
    customerId: data.customer ?? "",
    donorEmail: data.receipt_email ?? "",
    id: data.id,
    cadence: data.metadata?.cadence ?? "one_time",
    subscriptionId: data.metadata?.subscription_id ?? "",
    status: data.status ?? "unknown",
  };
}
