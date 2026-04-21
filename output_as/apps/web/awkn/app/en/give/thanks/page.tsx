import { getGiveReport } from "@/domains/give/api/get-give-report";
import { getGiveSettings } from "@/domains/give/api/get-give-settings";
import { GiveThanksPanel } from "@/domains/give/ui/give-thanks-panel";
import { getSiteShell } from "@/domains/site/api/get-site-shell";
import { SitePageFrame } from "@/domains/site/ui/site-page-frame";

export default async function EnglishGiveThanksPage() {
  const [shell, settings, report] = await Promise.all([
    getSiteShell("en"),
    getGiveSettings("en"),
    getGiveReport("en"),
  ]);

  return (
    <SitePageFrame shell={shell}>
      <GiveThanksPanel initialReport={report} locale="en" settings={settings} />
    </SitePageFrame>
  );
}
