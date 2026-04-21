import { NextResponse } from "next/server";
import { getGiveReport } from "@/domains/give/api/get-give-report";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const localeParam = searchParams.get("locale");
    const locale = localeParam === "fr" ? "fr" : "en";
    const report = await getGiveReport(locale);

    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load the giving report.",
      },
      { status: 500 }
    );
  }
}
