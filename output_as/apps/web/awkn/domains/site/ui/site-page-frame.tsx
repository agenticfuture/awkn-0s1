import type { ReactNode } from "react";
import { LandingFooter, LandingHeader } from "@/components/landing-dashboard";
import { getSiteShell } from "../api/get-site-shell";

type SiteShell = Awaited<ReturnType<typeof getSiteShell>>;

export function SitePageFrame({
  children,
  shell,
}: {
  children: ReactNode;
  shell: SiteShell;
}) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[linear-gradient(180deg,#f7f2e9_0%,#f2ece1_28%,#f6f4ef_58%,#fbfaf7_100%)] px-4 py-6 md:px-8 md:py-8">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top,rgba(232,200,145,0.35),transparent_58%)]"
      />
      <div className="relative z-10 mx-auto max-w-7xl">
        <LandingHeader
          primaryNav={shell.primaryNav}
          siteSettings={shell.siteSettings}
          siteTitle={shell.siteTitle}
        />
        <main className="py-10">{children}</main>
        <LandingFooter
          footerGroups={shell.footerGroups}
          siteSettings={shell.siteSettings}
          siteTitle={shell.siteTitle}
        />
      </div>
    </div>
  );
}
