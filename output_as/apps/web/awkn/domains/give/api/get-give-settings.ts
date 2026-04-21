import "server-only";

import { wordpressFetch } from "@/lib/cms/client";
import type { CmsLocale } from "@/lib/cms/types";
import type { GiveSettings } from "../entities/give";

const GIVE_SETTINGS_QUERY = `
  query GiveSettings($locale: String) {
    awknGiveSettings(locale: $locale) {
      locale
      eyebrow
      heading
      body
      successMessage
      tiers {
        amount
        label
        description
      }
    }
  }
`;

type GiveSettingsQuery = {
  awknGiveSettings: {
    body: string | null;
    eyebrow: string | null;
    heading: string | null;
    locale: string | null;
    successMessage: string | null;
    tiers:
      | Array<{
          amount: number | null;
          description: string | null;
          label: string | null;
        }>
      | null;
  } | null;
};

export async function getGiveSettings(locale: CmsLocale): Promise<GiveSettings> {
  const data = await wordpressFetch<GiveSettingsQuery>({
    query: GIVE_SETTINGS_QUERY,
    variables: { locale },
  });

  return {
    body:
      data.awknGiveSettings?.body ??
      "Your generosity helps sustain gatherings, resources, and pastoral presence across the network.",
    eyebrow: data.awknGiveSettings?.eyebrow ?? "Give",
    heading:
      data.awknGiveSettings?.heading ??
      "Support the work of renewal with a direct gift.",
    locale: data.awknGiveSettings?.locale ?? locale,
    successMessage:
      data.awknGiveSettings?.successMessage ??
      "Thank you. Your gift has been received and the team will follow up with a confirmation.",
    tiers:
      data.awknGiveSettings?.tiers?.map((tier) => ({
        amount: tier.amount ?? 0,
        description: tier.description ?? "",
        label: tier.label ?? "",
      })).filter((tier) => tier.amount > 0 && tier.label) ?? [],
  };
}
