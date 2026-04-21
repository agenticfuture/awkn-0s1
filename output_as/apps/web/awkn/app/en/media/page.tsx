import { getMediaFeed } from "@/domains/media/api/get-media-feed";
import { MediaList } from "@/domains/media/ui/media-list";
import { getSiteShell } from "@/domains/site/api/get-site-shell";
import { SitePageFrame } from "@/domains/site/ui/site-page-frame";

export default async function EnglishMediaPage() {
  const [shell, items] = await Promise.all([getSiteShell("en"), getMediaFeed("en")]);

  return (
    <SitePageFrame shell={shell}>
      <section className="space-y-10">
        <div className="space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-500">
            Media
          </p>
          <h1 className="font-serif text-5xl leading-tight text-stone-950">
            Films, releases, and story-rich media from the wider work.
          </h1>
          <p className="max-w-3xl text-base leading-8 text-stone-600">
            This media feed is now domain-owned on the frontend and backed by WordPress records,
            ready for a future YouTube sync job without changing the presentation layer.
          </p>
        </div>
        <MediaList items={items} locale="en" />
      </section>
    </SitePageFrame>
  );
}
