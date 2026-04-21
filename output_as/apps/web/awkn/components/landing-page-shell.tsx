import {
  LandingDashboard,
  LandingFooter,
  LandingHeader,
} from "@/components/landing-dashboard";
import type { CmsLocale } from "@/lib/cms/types";
import { getSiteShell } from "@/domains/site/api/get-site-shell";

export async function LandingPageShell({ locale }: { locale: CmsLocale }) {
  const content = await getSiteShell(locale);

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[linear-gradient(180deg,#f7f2e9_0%,#f2ece1_28%,#f6f4ef_58%,#fbfaf7_100%)] px-4 py-6 md:px-8 md:py-8">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top,rgba(232,200,145,0.35),transparent_58%)]"
      />
      <div
        aria-hidden="true"
        className="absolute right-0 top-40 h-[360px] w-[360px] bg-[radial-gradient(circle,rgba(163,183,162,0.22),transparent_64%)] blur-2xl"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <LandingHeader
          primaryNav={content.primaryNav}
          siteSettings={content.siteSettings}
          siteTitle={content.siteTitle}
        />
        <LandingDashboard
          contact={content.contact}
          hero={content.hero}
          resources={content.resources}
          siteSettings={content.siteSettings}
          story={content.story}
          teaserEvent={content.teaserEvent}
          video={content.video}
        />
        <LandingFooter
          footerGroups={content.footerGroups}
          siteSettings={content.siteSettings}
          siteTitle={content.siteTitle}
        />
      </div>
    </div>
  );
}
