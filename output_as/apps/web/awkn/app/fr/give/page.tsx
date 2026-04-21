import { getGiveSettings } from "@/domains/give/api/get-give-settings";
import { GiveForm } from "@/domains/give/ui/give-form";
import { getSiteShell } from "@/domains/site/api/get-site-shell";
import { SitePageFrame } from "@/domains/site/ui/site-page-frame";

export default async function FrenchGivePage() {
  const [shell, settings] = await Promise.all([getSiteShell("fr"), getGiveSettings("fr")]);

  return (
    <SitePageFrame shell={shell}>
      <GiveForm locale="fr" settings={settings} />
    </SitePageFrame>
  );
}
