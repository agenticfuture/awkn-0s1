import "server-only";

import { wordpressFetch } from "@/lib/cms/client";
import type { CmsLocale } from "@/lib/cms/types";
import type { GiveReport } from "../entities/give";

const GIVE_REPORT_QUERY = `
  query GiveReport($locale: String) {
    awknGiveReport(locale: $locale) {
      locale
      totalGifts
      totalAmountCents
      latestGiftAmountCents
      latestGiftDate
      latestGiftStatus
      latestWooOrderId
      wooEnabled
    }
  }
`;

type GiveReportQuery = {
  awknGiveReport: {
    latestGiftAmountCents: number | null;
    latestGiftDate: string | null;
    latestGiftStatus: string | null;
    latestWooOrderId: number | null;
    locale: string | null;
    totalAmountCents: number | null;
    totalGifts: number | null;
    wooEnabled: boolean | null;
  } | null;
};

export async function getGiveReport(locale: CmsLocale): Promise<GiveReport> {
  const data = await wordpressFetch<GiveReportQuery>({
    query: GIVE_REPORT_QUERY,
    variables: { locale },
  });

  return {
    latestGiftAmountCents: data.awknGiveReport?.latestGiftAmountCents ?? 0,
    latestGiftDate: data.awknGiveReport?.latestGiftDate ?? "",
    latestGiftStatus: data.awknGiveReport?.latestGiftStatus ?? "pending",
    latestWooOrderId: data.awknGiveReport?.latestWooOrderId ?? null,
    locale: data.awknGiveReport?.locale ?? locale,
    totalAmountCents: data.awknGiveReport?.totalAmountCents ?? 0,
    totalGifts: data.awknGiveReport?.totalGifts ?? 0,
    wooEnabled: data.awknGiveReport?.wooEnabled ?? false,
  };
}
