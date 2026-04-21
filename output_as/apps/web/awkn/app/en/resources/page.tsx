import { getResourcesFeed } from "@/domains/resources/api/get-resources-feed";
import { ResourcesList } from "@/domains/resources/ui/resources-list";
import { getSiteShell } from "@/domains/site/api/get-site-shell";
import { SitePageFrame } from "@/domains/site/ui/site-page-frame";

export default async function EnglishResourcesPage() {
  const [shell, items] = await Promise.all([getSiteShell("en"), getResourcesFeed("en")]);

  return (
    <SitePageFrame shell={shell}>
      <section className="space-y-10">
        <div className="space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-500">
            Resources
          </p>
          <h1 className="font-serif text-5xl leading-tight text-stone-950">
            Teachings, guides, and media for deeper formation.
          </h1>
          <p className="max-w-3xl text-base leading-8 text-stone-600">
            These resource cards are now being sourced from WordPress records through the
            frontend resources domain API instead of a homepage-only text field.
          </p>
        </div>
        <ResourcesList items={items} locale="en" />
      </section>
    </SitePageFrame>
  );
}
