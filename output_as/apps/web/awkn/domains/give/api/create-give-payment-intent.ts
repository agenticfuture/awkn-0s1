import "server-only";

export type GiveCadence = "monthly" | "one_time";

type CreateGivePaymentIntentParams = {
  amount: number;
  cadence: GiveCadence;
  currency?: string;
  donorEmail: string;
  donorName: string;
  donorNote?: string;
  locale: string;
};

type StripePaymentIntentResponse = {
  client_secret?: string;
  id?: string;
};

type StripeSubscriptionResponse = {
  customer?: string;
  id?: string;
  latest_invoice?: {
    payment_intent?: {
      client_secret?: string;
      id?: string;
    };
  };
};

async function stripeFormRequest(
  path: string,
  payload: URLSearchParams
): Promise<Response> {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Stripe secret key is not configured.");
  }

  return fetch(`https://api.stripe.com/v1/${path}`, {
    body: payload,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });
}

async function ensureGiveProductId(locale: string) {
  const configured = process.env.STRIPE_GIVE_PRODUCT_ID;

  if (configured) {
    return configured;
  }

  const productPayload = new URLSearchParams();
  productPayload.set("name", locale === "fr" ? "Don mensuel AWKN" : "AWKN Monthly Giving");
  productPayload.set("metadata[purpose]", "awkn_give");
  productPayload.set("metadata[locale]", locale);

  const productResponse = await stripeFormRequest("products", productPayload);

  if (!productResponse.ok) {
    const errorText = await productResponse.text();
    throw new Error(`Stripe product creation failed: ${errorText}`);
  }

  const data = (await productResponse.json()) as { id?: string };

  if (!data.id) {
    throw new Error("Stripe did not return a product id for recurring giving.");
  }

  return data.id;
}

async function createOneTimeGift({
  amount,
  currency,
  donorEmail,
  donorName,
  donorNote = "",
  locale,
}: Omit<CreateGivePaymentIntentParams, "cadence">) {
  const payload = new URLSearchParams();
  payload.set("amount", `${amount}`);
  payload.set("currency", currency);
  payload.set("automatic_payment_methods[enabled]", "true");
  payload.set("receipt_email", donorEmail);
  payload.set("metadata[purpose]", "awkn_give");
  payload.set("metadata[cadence]", "one_time");
  payload.set("metadata[donor_email]", donorEmail);
  payload.set("metadata[donor_name]", donorName);
  payload.set("metadata[donor_note]", donorNote);
  payload.set("metadata[locale]", locale);

  const response = await stripeFormRequest("payment_intents", payload);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Stripe payment intent failed: ${errorText}`);
  }

  const data = (await response.json()) as StripePaymentIntentResponse;

  if (!data.client_secret) {
    throw new Error("Stripe did not return a client secret.");
  }

  return {
    cadence: "one_time" as const,
    clientSecret: data.client_secret,
    customerId: "",
    id: data.id ?? "",
    subscriptionId: "",
  };
}

async function createMonthlyGift({
  amount,
  currency,
  donorEmail,
  donorName,
  donorNote = "",
  locale,
}: Omit<CreateGivePaymentIntentParams, "cadence">) {
  const productId = await ensureGiveProductId(locale);
  const customerPayload = new URLSearchParams();
  customerPayload.set("email", donorEmail);
  customerPayload.set("name", donorName);
  customerPayload.set("metadata[purpose]", "awkn_give");
  customerPayload.set("metadata[cadence]", "monthly");
  customerPayload.set("metadata[donor_email]", donorEmail);
  customerPayload.set("metadata[donor_name]", donorName);
  customerPayload.set("metadata[donor_note]", donorNote);
  customerPayload.set("metadata[locale]", locale);

  const customerResponse = await stripeFormRequest("customers", customerPayload);

  if (!customerResponse.ok) {
    const errorText = await customerResponse.text();
    throw new Error(`Stripe customer creation failed: ${errorText}`);
  }

  const customerData = (await customerResponse.json()) as { id?: string };

  if (!customerData.id) {
    throw new Error("Stripe did not return a customer id.");
  }

  const subscriptionPayload = new URLSearchParams();
  subscriptionPayload.set("customer", customerData.id);
  subscriptionPayload.set("currency", currency);
  subscriptionPayload.set("collection_method", "charge_automatically");
  subscriptionPayload.set("payment_behavior", "default_incomplete");
  subscriptionPayload.set("payment_settings[save_default_payment_method]", "on_subscription");
  subscriptionPayload.set("items[0][price_data][currency]", currency);
  subscriptionPayload.set("items[0][price_data][product]", productId);
  subscriptionPayload.set("items[0][price_data][recurring][interval]", "month");
  subscriptionPayload.set("items[0][price_data][unit_amount]", `${amount}`);
  subscriptionPayload.set("metadata[purpose]", "awkn_give");
  subscriptionPayload.set("metadata[cadence]", "monthly");
  subscriptionPayload.set("metadata[donor_email]", donorEmail);
  subscriptionPayload.set("metadata[donor_name]", donorName);
  subscriptionPayload.set("metadata[donor_note]", donorNote);
  subscriptionPayload.set("metadata[locale]", locale);
  subscriptionPayload.set("expand[]", "latest_invoice.payment_intent");

  const subscriptionResponse = await stripeFormRequest("subscriptions", subscriptionPayload);

  if (!subscriptionResponse.ok) {
    const errorText = await subscriptionResponse.text();
    throw new Error(`Stripe subscription creation failed: ${errorText}`);
  }

  const data = (await subscriptionResponse.json()) as StripeSubscriptionResponse;
  const paymentIntent = data.latest_invoice?.payment_intent;

  if (!paymentIntent?.client_secret) {
    throw new Error("Stripe did not return a client secret for the recurring gift.");
  }

  return {
    cadence: "monthly" as const,
    clientSecret: paymentIntent.client_secret,
    customerId: customerData.id,
    id: paymentIntent.id ?? "",
    subscriptionId: data.id ?? "",
  };
}

export async function createGivePaymentIntent({
  amount,
  cadence,
  currency = "usd",
  donorEmail,
  donorName,
  donorNote = "",
  locale,
}: CreateGivePaymentIntentParams) {
  if (cadence === "monthly") {
    return createMonthlyGift({ amount, currency, donorEmail, donorName, donorNote, locale });
  }

  return createOneTimeGift({ amount, currency, donorEmail, donorName, donorNote, locale });
}
