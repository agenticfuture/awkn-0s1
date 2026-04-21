import { getEventsFeed } from "@/domains/events/api/get-events-feed";
import { EventsList } from "@/domains/events/ui/events-list";
import { getSiteShell } from "@/domains/site/api/get-site-shell";
import { SitePageFrame } from "@/domains/site/ui/site-page-frame";

export default async function FrenchEventsPage() {
  const [shell, items] = await Promise.all([getSiteShell("fr"), getEventsFeed("fr")]);

  return (
    <SitePageFrame shell={shell}>
      <section className="space-y-10">
        <div className="space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-500">
            Evenements
          </p>
          <h1 className="font-serif text-5xl leading-tight text-stone-950">
            Rassemblements, retraites et invitations publiques portes par la mission.
          </h1>
          <p className="max-w-3xl text-base leading-8 text-stone-600">
            Ces evenements viennent maintenant de vrais enregistrements WordPress via le domaine
            frontend `events`, prets pour une future navigation detaillee.
          </p>
        </div>
        <EventsList items={items} locale="fr" />
      </section>
    </SitePageFrame>
  );
}
