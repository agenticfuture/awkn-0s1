import "server-only";

import { getLandingPageContent } from "@/lib/cms/fetchers";
import type { CmsLocale } from "@/lib/cms/types";

export async function getSiteShell(locale: CmsLocale) {
  return getLandingPageContent(locale);
}
