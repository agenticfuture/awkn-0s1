import Link from "next/link";
import { ArrowRight, CirclePlay } from "lucide-react";
import type { MediaCard } from "../entities/media";

function getCopy(locale: string) {
  if (locale === "fr") {
    return {
      cta: "Voir les medias",
      fallbackLabel: "Media",
      watch: "Voir la sortie",
    };
  }

  return {
    cta: "View Media",
    fallbackLabel: "Media",
    watch: "Watch Release",
  };
}

function formatDate(value: string, locale: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
    dateStyle: "medium",
  }).format(date);
}

export function MediaList({
  items,
  locale,
}: {
  items: MediaCard[];
  locale: string;
}) {
  const copy = getCopy(locale);

  return (
    <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <article
          className="flex h-full flex-col overflow-hidden border border-stone-300 bg-white/85 shadow-[0_20px_60px_-48px_rgba(70,52,26,0.65)]"
          key={`${item.title}-${item.publishedAt}`}
        >
          <div className="relative aspect-[16/10] bg-stone-200">
            {item.thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={item.title}
                className="h-full w-full object-cover"
                src={item.thumbnailUrl}
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-[linear-gradient(145deg,rgba(44,33,20,0.88),rgba(119,88,52,0.72))] text-stone-50">
                <CirclePlay className="h-12 w-12" />
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-4 p-6">
            <div className="flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
              <span>{item.sourceLabel || copy.fallbackLabel}</span>
              <span>{formatDate(item.publishedAt, locale)}</span>
            </div>
            <h2 className="font-serif text-3xl leading-tight text-stone-950">
              {item.title}
            </h2>
            <p className="flex-1 text-sm leading-7 text-stone-600">{item.body}</p>
            <div className="flex flex-wrap gap-3">
              {item.videoUrl ? (
                <Link
                  className="inline-flex items-center gap-2 text-sm font-medium text-stone-900"
                  href={item.videoUrl}
                  target="_blank"
                >
                  {copy.watch}
                  <CirclePlay className="h-4 w-4" />
                </Link>
              ) : null}
              <Link
                className="inline-flex items-center gap-2 text-sm font-medium text-stone-900"
                href={`/${locale}/media`}
              >
                {copy.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
