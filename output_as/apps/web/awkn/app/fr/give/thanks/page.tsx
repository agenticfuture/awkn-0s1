import { getGiveReport } from "@/domains/give/api/get-give-report";
import { getGiveSettings } from "@/domains/give/api/get-give-settings";
import { GiveThanksPanel } from "@/domains/give/ui/give-thanks-panel";
import { getSiteShell } from "@/domains/site/api/get-site-shell";
import { SitePageFrame } from "@/domains/site/ui/site-page-frame";

export default async function FrenchGiveThanksPage() {
  const [shell, settings, report] = await Promise.all([
    getSiteShell("fr"),
    getGiveSettings("fr"),
    getGiveReport("fr"),
  ]);

  return (
    <SitePageFrame shell={shell}>
      <GiveThanksPanel initialReport={report} locale="fr" settings={settings} />
    </SitePageFrame>
  );
}
