import { getResourcesFeed } from "@/domains/resources/api/get-resources-feed";
import { ResourcesList } from "@/domains/resources/ui/resources-list";
import { getSiteShell } from "@/domains/site/api/get-site-shell";
import { SitePageFrame } from "@/domains/site/ui/site-page-frame";

export default async function FrenchResourcesPage() {
  const [shell, items] = await Promise.all([getSiteShell("fr"), getResourcesFeed("fr")]);

  return (
    <SitePageFrame shell={shell}>
      <section className="space-y-10">
        <div className="space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-500">
            Ressources
          </p>
          <h1 className="font-serif text-5xl leading-tight text-stone-950">
            Enseignements, guides et medias pour une formation plus profonde.
          </h1>
          <p className="max-w-3xl text-base leading-8 text-stone-600">
            Ces cartes de ressources sont maintenant alimentees par de vrais contenus WordPress via
            le domaine frontend `resources`, et non plus par un simple champ de page d'accueil.
          </p>
        </div>
        <ResourcesList items={items} locale="fr" />
      </section>
    </SitePageFrame>
  );
}
