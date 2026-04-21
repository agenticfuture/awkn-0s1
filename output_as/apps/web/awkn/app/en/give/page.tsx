import { getGiveSettings } from "@/domains/give/api/get-give-settings";
import { GiveForm } from "@/domains/give/ui/give-form";
import { getSiteShell } from "@/domains/site/api/get-site-shell";
import { SitePageFrame } from "@/domains/site/ui/site-page-frame";

export default async function EnglishGivePage() {
  const [shell, settings] = await Promise.all([getSiteShell("en"), getGiveSettings("en")]);

  return (
    <SitePageFrame shell={shell}>
      <GiveForm locale="en" settings={settings} />
    </SitePageFrame>
  );
}
