import { getMediaFeed } from "@/domains/media/api/get-media-feed";
import { MediaList } from "@/domains/media/ui/media-list";
import { getSiteShell } from "@/domains/site/api/get-site-shell";
import { SitePageFrame } from "@/domains/site/ui/site-page-frame";

export default async function FrenchMediaPage() {
  const [shell, items] = await Promise.all([getSiteShell("fr"), getMediaFeed("fr")]);

  return (
    <SitePageFrame shell={shell}>
      <section className="space-y-10">
        <div className="space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-500">
            Medias
          </p>
          <h1 className="font-serif text-5xl leading-tight text-stone-950">
            Films, sorties et contenus qui portent l'histoire du mouvement.
          </h1>
          <p className="max-w-3xl text-base leading-8 text-stone-600">
            Ce flux media est maintenant gere par un domaine frontend dedie et alimente par des
            enregistrements WordPress, pret pour une future synchronisation YouTube.
          </p>
        </div>
        <MediaList items={items} locale="fr" />
      </section>
    </SitePageFrame>
  );
}
