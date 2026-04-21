import "server-only";

function getWordpressGiftSyncUrl() {
  const configured = process.env.WORDPRESS_GIFT_SYNC_URL;
  if (configured) {
    return configured;
  }

  const graphqlUrl = process.env.WORDPRESS_GRAPHQL_URL ?? "http://wordpress/graphql";
  return graphqlUrl.replace(/\/graphql\/?$/, "/wp-json/awkn/v1/gifts");
}

export async function syncGiveRecord({
  amount,
  cadence = "one_time",
  currency,
  customerId = "",
  donorEmail,
  donorName = "",
  donorNote = "",
  locale,
  paymentIntentId,
  subscriptionId = "",
  status,
}: {
  amount: number;
  cadence?: string;
  currency: string;
  customerId?: string;
  donorEmail?: string;
  donorName?: string;
  donorNote?: string;
  locale: string;
  paymentIntentId: string;
  subscriptionId?: string;
  status: string;
}) {
  const secret = process.env.AWKN_WP_SYNC_SECRET;

  if (!secret) {
    throw new Error("WordPress sync secret is not configured.");
  }

  const response = await fetch(getWordpressGiftSyncUrl(), {
    body: JSON.stringify({
      amount,
      cadence,
      currency,
      customerId,
      donorEmail: donorEmail ?? "",
      donorName,
      donorNote,
      locale,
      paymentIntentId,
      subscriptionId,
      status,
    }),
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "x-awkn-sync-secret": secret,
    },
    method: "POST",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`WordPress gift sync failed: ${errorText}`);
  }

  return response.json();
}
