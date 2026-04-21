import "server-only";

import { wordpressFetch } from "@/lib/cms/client";
import type { CmsLocale } from "@/lib/cms/types";
import type { MediaCard } from "../entities/media";

const MEDIA_FEED_QUERY = `
  query MediaFeed($locale: String) {
    awknMediaFeed(locale: $locale, limit: 12) {
      title
      body
      href
      sourceLabel
      publishedAt
      thumbnailUrl
      videoUrl
    }
  }
`;

type MediaFeedQuery = {
  awknMediaFeed: Array<{
    body: string | null;
    href: string | null;
    publishedAt: string | null;
    sourceLabel: string | null;
    thumbnailUrl: string | null;
    title: string | null;
    videoUrl: string | null;
  }> | null;
};

export async function getMediaFeed(locale: CmsLocale): Promise<MediaCard[]> {
  const data = await wordpressFetch<MediaFeedQuery>({
    query: MEDIA_FEED_QUERY,
    variables: { locale },
  });

  return (
    data.awknMediaFeed?.map((item) => ({
      body: item.body ?? "",
      href: item.href ?? "#",
      publishedAt: item.publishedAt ?? "",
      sourceLabel: item.sourceLabel ?? "",
      thumbnailUrl: item.thumbnailUrl ?? "",
      title: item.title ?? "",
      videoUrl: item.videoUrl ?? "",
    })).filter((item) => item.title) ?? []
  );
}
