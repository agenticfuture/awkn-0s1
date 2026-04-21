import "server-only";

import { wordpressFetch } from "@/lib/cms/client";
import type { CmsLocale } from "@/lib/cms/types";
import type { EventCard } from "../entities/event";

const EVENTS_FEED_QUERY = `
  query EventsFeed($locale: String) {
    awknEventsFeed(locale: $locale, limit: 12) {
      title
      body
      href
      location
      dateLabel
    }
  }
`;

type EventsFeedQuery = {
  awknEventsFeed: Array<{
    body: string | null;
    dateLabel: string | null;
    href: string | null;
    location: string | null;
    title: string | null;
  }> | null;
};

export async function getEventsFeed(locale: CmsLocale): Promise<EventCard[]> {
  const data = await wordpressFetch<EventsFeedQuery>({
    query: EVENTS_FEED_QUERY,
    variables: { locale },
  });

  return (
    data.awknEventsFeed?.map((item) => ({
      body: item.body ?? "",
      dateLabel: item.dateLabel ?? "",
      href: item.href ?? "#",
      location: item.location ?? "",
      title: item.title ?? "",
    })).filter((item) => item.title) ?? []
  );
}
