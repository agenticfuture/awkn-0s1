import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ResourceCard } from "../entities/resource";

function getCopy(locale: string) {
  if (locale === "fr") {
    return {
      cta: "Voir les ressources",
      label: "Ressource",
    };
  }

  return {
    cta: "Keep Exploring",
    label: "Resource",
  };
}

export function ResourcesList({
  items,
  locale,
}: {
  items: ResourceCard[];
  locale: string;
}) {
  const copy = getCopy(locale);

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <article
          className="flex h-full flex-col gap-4 border border-stone-300 bg-white/80 p-7 shadow-[0_20px_60px_-48px_rgba(70,52,26,0.65)]"
          key={item.title}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
            {copy.label}
          </p>
          <h2 className="font-serif text-3xl leading-tight text-stone-950">
            {item.title}
          </h2>
          <p className="flex-1 text-sm leading-7 text-stone-600">{item.body}</p>
          <Link
            className="inline-flex items-center gap-2 text-sm font-medium text-stone-900"
            href={`/${locale}/resources`}
          >
            {copy.cta}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </article>
      ))}
    </div>
  );
}
