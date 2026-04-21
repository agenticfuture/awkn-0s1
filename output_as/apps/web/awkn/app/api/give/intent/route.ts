import { NextResponse } from "next/server";
import { createGivePaymentIntent } from "@/domains/give/api/create-give-payment-intent";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      amount?: number;
      cadence?: "monthly" | "one_time";
      donorEmail?: string;
      donorName?: string;
      donorNote?: string;
      locale?: string;
    };

    if (!body.amount || body.amount < 100) {
      return NextResponse.json(
        { error: "Donation amount must be at least 100 cents." },
        { status: 400 }
      );
    }

    if (!body.donorName?.trim() || !body.donorEmail?.trim()) {
      return NextResponse.json(
        { error: "Donor name and email are required." },
        { status: 400 }
      );
    }

    const intent = await createGivePaymentIntent({
      amount: body.amount,
      cadence: body.cadence === "monthly" ? "monthly" : "one_time",
      donorEmail: body.donorEmail.trim(),
      donorName: body.donorName.trim(),
      donorNote: body.donorNote?.trim() ?? "",
      locale: body.locale ?? "en",
    });

    return NextResponse.json(intent);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create donation payment intent.",
      },
      { status: 500 }
    );
  }
}
