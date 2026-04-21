import "server-only";

import { wordpressFetch } from "@/lib/cms/client";
import type { CmsLocale } from "@/lib/cms/types";
import type { ResourceCard } from "../entities/resource";

const RESOURCES_FEED_QUERY = `
  query ResourcesFeed($locale: String) {
    awknResourcesFeed(locale: $locale, limit: 12) {
      title
      body
      href
    }
  }
`;

type ResourcesFeedQuery = {
  awknResourcesFeed: Array<{
    body: string | null;
    href: string | null;
    title: string | null;
  }> | null;
};

export async function getResourcesFeed(locale: CmsLocale): Promise<ResourceCard[]> {
  const data = await wordpressFetch<ResourcesFeedQuery>({
    query: RESOURCES_FEED_QUERY,
    variables: { locale },
  });

  return (
    data.awknResourcesFeed?.map((item) => ({
      body: item.body ?? "",
      href: item.href ?? "#",
      title: item.title ?? "",
    })).filter((item) => item.title) ?? []
  );
}
