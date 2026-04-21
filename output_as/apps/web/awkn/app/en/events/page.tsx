import { getEventsFeed } from "@/domains/events/api/get-events-feed";
import { EventsList } from "@/domains/events/ui/events-list";
import { getSiteShell } from "@/domains/site/api/get-site-shell";
import { SitePageFrame } from "@/domains/site/ui/site-page-frame";

export default async function EnglishEventsPage() {
  const [shell, items] = await Promise.all([getSiteShell("en"), getEventsFeed("en")]);

  return (
    <SitePageFrame shell={shell}>
      <section className="space-y-10">
        <div className="space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-500">
            Events
          </p>
          <h1 className="font-serif text-5xl leading-tight text-stone-950">
            Gatherings, retreats, and public invitations shaped by the mission.
          </h1>
          <p className="max-w-3xl text-base leading-8 text-stone-600">
            These event entries now come from WordPress event records through the frontend events
            domain API, ready for a future detail-page flow.
          </p>
        </div>
        <EventsList items={items} locale="en" />
      </section>
    </SitePageFrame>
  );
}
