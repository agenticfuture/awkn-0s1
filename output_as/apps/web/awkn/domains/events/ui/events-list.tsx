import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import type { EventCard } from "../entities/event";

function getCopy(locale: string) {
  if (locale === "fr") {
    return {
      cta: "Voir les evenements",
    };
  }

  return {
    cta: "View Events",
  };
}

export function EventsList({
  items,
  locale,
}: {
  items: EventCard[];
  locale: string;
}) {
  const copy = getCopy(locale);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {items.map((item) => (
        <article
          className="flex h-full flex-col gap-4 border border-stone-300 bg-[linear-gradient(145deg,rgba(255,255,255,0.9),rgba(242,235,223,0.96))] p-7 shadow-[0_20px_60px_-48px_rgba(70,52,26,0.65)]"
          key={`${item.title}-${item.dateLabel}`}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
            {item.dateLabel}
          </p>
          <h2 className="font-serif text-3xl leading-tight text-stone-950">
            {item.title}
          </h2>
          <div className="flex items-center gap-2 text-sm text-stone-600">
            <MapPin className="h-4 w-4" />
            {item.location}
          </div>
          <p className="flex-1 text-sm leading-7 text-stone-600">{item.body}</p>
          <Link
            className="inline-flex items-center gap-2 text-sm font-medium text-stone-900"
            href={`/${locale}/events`}
          >
            {copy.cta}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </article>
      ))}
    </div>
  );
}
