import { NextResponse } from "next/server";
import { getStripePaymentIntent } from "@/domains/give/api/get-stripe-payment-intent";
import { syncGiveRecord } from "@/domains/give/api/sync-give-record";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      cadence?: string;
      customerId?: string;
      donorEmail?: string;
      donorName?: string;
      donorNote?: string;
      locale?: string;
      paymentIntentId?: string;
      subscriptionId?: string;
    };

    if (!body.paymentIntentId) {
      return NextResponse.json(
        { error: "Payment intent id is required." },
        { status: 400 }
      );
    }

    const paymentIntent = await getStripePaymentIntent(body.paymentIntentId);

    if (!["succeeded", "processing", "requires_capture"].includes(paymentIntent.status)) {
      return NextResponse.json(
        {
          error: `Gift is not in a finalizable state: ${paymentIntent.status}`,
        },
        { status: 400 }
      );
    }

    const synced = await syncGiveRecord({
      amount: paymentIntent.amount,
      cadence: body.cadence ?? paymentIntent.cadence ?? "one_time",
      currency: paymentIntent.currency,
      customerId: body.customerId ?? paymentIntent.customerId ?? "",
      donorEmail: body.donorEmail ?? paymentIntent.donorEmail,
      donorName: body.donorName ?? "",
      donorNote: body.donorNote ?? "",
      locale: body.locale ?? "en",
      paymentIntentId: paymentIntent.id,
      subscriptionId: body.subscriptionId ?? paymentIntent.subscriptionId ?? "",
      status: paymentIntent.status,
    });

    return NextResponse.json({
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      synced,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to finalize the gift record.",
      },
      { status: 500 }
    );
  }
}
