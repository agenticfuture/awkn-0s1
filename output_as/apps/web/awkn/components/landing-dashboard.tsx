"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  CirclePlay,
  Facebook,
  HeartHandshake,
  Instagram,
  Mail,
  MapPin,
  Menu,
  Sparkles,
  Trees,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type {
  LandingFooterGroup,
  LandingNavItem,
  LandingPageContent,
  LandingSiteSettings,
} from "@/lib/cms/types";

function getDiscoverLinks(locale: string) {
  if (locale === "fr") {
    return [
      {
        title: "Vision",
        description: "Comprendre le souffle spirituel et culturel du reseau.",
        href: "#vision",
      },
      {
        title: "Histoire",
        description: "Voir le mouvement, les personnes et les lieux qui portent la mission.",
        href: "#about",
      },
      {
        title: "Ressources",
        description: "Explorer les enseignements, films, guides et outils de formation.",
        href: "#resources",
      },
    ];
  }

  return [
    {
      title: "Vision",
      description: "Understand the spiritual and cultural heartbeat of the network.",
      href: "#vision",
    },
    {
      title: "Story",
      description: "See the movement, people, and places shaping the mission.",
      href: "#about",
    },
    {
      title: "Resources",
      description: "Explore teachings, films, guides, and formation tools.",
      href: "#resources",
    },
  ];
}

function getExperienceLinks(locale: string) {
  if (locale === "fr") {
    return [
      {
        title: "Evenements",
        description: "Participer a des retraites, rassemblements et moments incarnes.",
        href: "/events",
      },
      {
        title: "Medias",
        description: "Voir les nouvelles sorties, films et recits medias du mouvement.",
        href: "/media",
      },
      {
        title: "Video",
        description: "Commencer par le film d'introduction et le recit principal.",
        href: "#video",
      },
      {
        title: "Contact",
        description: "Nous joindre pour un partenariat, une invitation ou un lien communautaire.",
        href: "#contact",
      },
      {
        title: "Donner",
        description: "Soutenir l'oeuvre par un don direct gere par le frontend.",
        href: "/give",
      },
    ];
  }

  return [
    {
      title: "Events",
      description: "Join retreats, gatherings, and sacred in-person moments.",
      href: "/events",
    },
    {
      title: "Media",
      description: "Watch new releases, films, and media stories from the movement.",
      href: "/media",
    },
    {
      title: "Video",
      description: "Start with the main introductory film and core story.",
      href: "#video",
    },
    {
      title: "Contact",
      description: "Reach out for partnership, speaking, or community connection.",
      href: "#contact",
    },
    {
      title: "Give",
      description: "Support the work through a direct gift and a frontend-led donation flow.",
      href: "/give",
    },
  ];
}

function getHighlights(locale: string) {
  if (locale === "fr") {
    return [
      {
        label: "Renouveau",
        title: "Un site qui porte du sens.",
        body:
          "La page d'accueil se comporte maintenant comme une porte d'entree publique guidee par la mission plutot qu'un selecteur d'applications internes.",
        icon: Sparkles,
      },
      {
        label: "Appartenance",
        title: "Une structure plus calme et plus claire.",
        body:
          "Hero, histoire, ressources, evenements, contact et pied de page suivent maintenant une progression editoriale intentionnelle.",
        icon: HeartHandshake,
      },
      {
        label: "Lieu",
        title: "Concu pour grandir avec le contenu.",
        body:
          "Le design est pret a se connecter a WordPress comme backend structure sans perdre la liberte du frontend.",
        icon: Trees,
      },
    ];
  }

  return [
    {
      label: "Renewal",
      title: "A website that leads with meaning.",
      body:
        "The homepage now behaves like a mission-led public front door instead of an internal application selector.",
      icon: Sparkles,
    },
    {
      label: "Belonging",
      title: "A calmer, clearer structure.",
      body:
        "Hero, story, featured resources, events, contact, and footer now sit in an intentional editorial flow.",
      icon: HeartHandshake,
    },
    {
      label: "Place",
      title: "Built for content-managed growth.",
      body:
        "The design is ready to pair with WordPress as a structured backend while preserving full frontend freedom.",
      icon: Trees,
    },
  ];
}

function getLandingBodyCopy(locale: string) {
  if (locale === "fr") {
    return {
      askAboutAttending: "Demander comment participer",
      eventsEyebrow: "Evenements",
      eventsHeadingFallback: "Evenements",
      eventsHeadingWithTeaser: "Rassemblements, retraites et invitations publiques.",
      eventsIntro:
        "Cette section est intentionnellement prete pour un branchement backend afin que les cartes, dates, lieux et appels a l'action soient geres depuis WordPress tout en gardant le systeme visuel entierement cote frontend.",
      explore: "Explorer",
      featuredStory: "Histoire mise en avant",
      footerBody:
        "Les liens sociaux, liens legaux, parametres de contact, menus de pied de page et appels a l'action newsletter peuvent etre geres depuis WordPress pendant que ce frontend garde le controle de la presentation.",
      footerHeading:
        "Une experience publique concue cote frontend, prete a etre alimentee par un backend WordPress.",
      footerTech: "Design pilote par le frontend • Structure de contenu geree par WordPress",
      mainActions: "Actions principales",
      mainContentFlow: "Flux principal",
      placeholderDate: "22-24 mai 2026",
      placeholderEvent: "Rassemblement Eveil",
      placeholderEventBody:
        "Un bloc d'evenement exemple pour valider la mise en page avant une connexion plus complete au modele WordPress `Events`.",
      reachOut: "Nous joindre",
      sourceLabel: "Source",
      testEventPlaceholder: "Evenement test",
      whyItMatters: "Pourquoi c'est important",
      whyItMattersBody:
        "Cette structure est plus facile a mapper aux modeles de contenu WordPress, plus simple a localiser et bien plus proche des sites publics apaises et soignes que vous avez references.",
    };
  }

  return {
    askAboutAttending: "Ask about attending",
    eventsEyebrow: "Events",
    eventsHeadingFallback: "Events",
    eventsHeadingWithTeaser: "Gatherings, retreats, and public invitations.",
    eventsIntro:
      "This section is intentionally ready for backend wiring so event cards, dates, locations, and CTAs can be managed from WordPress while keeping the visual system completely frontend-owned.",
    explore: "Explore",
    featuredStory: "Featured Story",
    footerBody:
      "Social links, privacy links, contact settings, footer menus, and newsletter CTAs can all be managed from WordPress while this frontend keeps complete control over presentation.",
    footerHeading:
      "A frontend-designed public experience, ready to be powered by a WordPress backend.",
    footerTech: "Frontend-led design • WordPress-backed content structure",
    mainActions: "Main actions",
    mainContentFlow: "Main content flow",
    placeholderDate: "May 22-24, 2026",
    placeholderEvent: "Awakening Gathering",
    placeholderEventBody:
      "A sample event block to prove the layout and later connect to a WordPress-backed `Events` content model.",
    reachOut: "Reach out",
    sourceLabel: "Source",
    testEventPlaceholder: "Test Event Placeholder",
    whyItMatters: "Why it matters",
    whyItMattersBody:
      "This structure is easier to map to WordPress content models, easier to localize, and much closer to the calm, polished, public-facing websites you referenced.",
  };
}

function MotionFade({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      transition={{ delay, duration: 0.65, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function mergePrimaryNav(primaryNav: LandingNavItem[], locale: string) {
  const bySlug = new Map(primaryNav.map((item) => [item.slug, item]));

  return [
    bySlug.get("about") ?? { href: "#about", label: locale === "fr" ? "A propos" : "About", slug: "about" },
    { href: "/resources", label: locale === "fr" ? "Ressources" : "Resources", slug: "resources" },
    { href: "/events", label: locale === "fr" ? "Evenements" : "Events", slug: "events" },
    { href: "/media", label: locale === "fr" ? "Medias" : "Media", slug: "media" },
    bySlug.get("contact") ?? { href: "#contact", label: "Contact", slug: "contact" },
  ];
}

function normalizeFooterGroups(footerGroups: LandingFooterGroup[]) {
  return footerGroups.length ? footerGroups : [];
}

function withLocaleHref(locale: string, href: string) {
  if (!href) {
    return `/${locale}`;
  }

  if (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:")
  ) {
    return href;
  }

  if (href.startsWith("#")) {
    return `/${locale}${href}`;
  }

  if (href === "/") {
    return `/${locale}`;
  }

  if (href.startsWith("/api") || href.startsWith("/en") || href.startsWith("/fr")) {
    return href;
  }

  if (href.startsWith("/")) {
    return `/${locale}${href}`;
  }

  return href;
}

export function LandingHeader({
  siteSettings,
  siteTitle,
  primaryNav,
}: {
  primaryNav: LandingNavItem[];
  siteSettings: LandingSiteSettings;
  siteTitle: string;
}) {
  const navItems = mergePrimaryNav(primaryNav, siteSettings.locale);
  const discoverLinks = getDiscoverLinks(siteSettings.locale);
  const experienceLinks = getExperienceLinks(siteSettings.locale);
  const copy =
    siteSettings.locale === "fr"
      ? {
          brand: "Renouveau pour les personnes, les lieux et le pelerinage.",
          contact: "Contact",
          discover: "Decouvrir",
          experience: "Vivre",
          give: "Donner",
          menu: "Menu",
        }
      : {
          brand: "Renewal for people, places, and pilgrimage.",
          contact: "Contact",
          discover: "Discover",
          experience: "Experience",
          give: "Give",
          menu: "Menu",
        };

  return (
    <MotionFade className="mx-auto w-full max-w-7xl" delay={0.02}>
      <header className="grid grid-cols-[auto_1fr_auto] items-center gap-6 border-b border-stone-300/70 px-1 py-5">
        <Link className="flex items-center gap-3" href={`/${siteSettings.locale}`}>
          {siteSettings.logoImageUrl ? (
            <div className="flex h-12 items-center justify-center md:h-14">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={siteSettings.logoText || siteTitle}
                className="max-h-10 w-auto max-w-[9.5rem] object-contain mix-blend-multiply opacity-95 md:max-h-12 md:max-w-[11.25rem]"
                src={siteSettings.logoImageUrl}
              />
            </div>
          ) : (
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-stone-400/60 bg-white/70 shadow-sm">
              <span className="font-semibold text-sm tracking-[0.18em] text-stone-900">
                AN
              </span>
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-[11px] uppercase tracking-[0.3em] text-stone-500">
              {siteSettings.logoText || siteTitle}
            </p>
            <p className="font-serif text-lg text-stone-950 md:text-xl">
              {copy.brand}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center justify-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              className="text-sm text-stone-700 transition hover:text-stone-950"
              href={withLocaleHref(siteSettings.locale, item.href)}
              key={item.label}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-3">
          <div className="hidden items-center gap-2 sm:inline-flex">
            <Link
              className={`text-xs uppercase tracking-[0.22em] transition ${
                siteSettings.locale === "en" ? "text-stone-950" : "text-stone-400 hover:text-stone-700"
              }`}
              href="/en"
            >
              EN
            </Link>
            <span className="text-stone-300">/</span>
            <Link
              className={`text-xs uppercase tracking-[0.22em] transition ${
                siteSettings.locale === "fr" ? "text-stone-950" : "text-stone-400 hover:text-stone-700"
              }`}
              href="/fr"
            >
              FR
            </Link>
          </div>

          <Link
            className="hidden border-b border-transparent text-sm text-stone-700 transition hover:border-stone-500 hover:text-stone-950 sm:inline-flex"
            href={`/${siteSettings.locale}#contact`}
          >
            {copy.contact}
          </Link>
          <Link
            className="hidden bg-stone-950 px-4 py-2.5 text-sm font-medium text-stone-50 transition hover:bg-stone-800 lg:inline-flex"
            href={`/${siteSettings.locale}/give`}
          >
            {copy.give}
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-4 py-2.5 text-sm font-medium text-stone-50 transition hover:bg-stone-800"
                type="button"
              >
                <span>{copy.menu}</span>
                <Menu className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[340px] rounded-2xl p-2">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="rounded-xl px-3 py-3">
                  {copy.discover}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-[340px] rounded-2xl p-2">
                  {discoverLinks.map((item) => (
                    <DropdownMenuItem asChild className="rounded-xl px-3 py-3" key={item.title}>
                      <Link href={withLocaleHref(siteSettings.locale, item.href)}>
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-sm text-stone-900">
                            {item.title}
                          </span>
                          <span className="text-xs leading-5 text-stone-500">
                            {item.description}
                          </span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="rounded-xl px-3 py-3">
                  {copy.experience}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-[340px] rounded-2xl p-2">
                  {experienceLinks.map((item) => (
                    <DropdownMenuItem asChild className="rounded-xl px-3 py-3" key={item.title}>
                      <Link href={withLocaleHref(siteSettings.locale, item.href)}>
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-sm text-stone-900">
                            {item.title}
                          </span>
                          <span className="text-xs leading-5 text-stone-500">
                            {item.description}
                          </span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              {navItems.map((item) => (
                <DropdownMenuItem asChild className="rounded-xl px-3 py-3" key={item.label}>
                  <Link
                    className="flex items-center justify-between"
                    href={withLocaleHref(siteSettings.locale, item.href)}
                  >
                    <span className="text-sm text-stone-900">{item.label}</span>
                    <ChevronRight className="h-4 w-4 text-stone-400" />
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </MotionFade>
  );
}

export function LandingDashboard({
  contact,
  hero,
  resources,
  siteSettings,
  story,
  teaserEvent,
  video,
}: {
  contact: LandingPageContent["contact"];
  hero: LandingPageContent["hero"];
  resources: LandingPageContent["resources"];
  siteSettings: LandingSiteSettings;
  story: LandingPageContent["story"];
  teaserEvent: LandingPageContent["teaserEvent"];
  video: LandingPageContent["video"];
}) {
  const copy = getLandingBodyCopy(siteSettings.locale);
  const highlights = getHighlights(siteSettings.locale);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-24 pb-12 text-left">
      <section className="grid items-start gap-14 pt-6 lg:grid-cols-[1.05fr_0.95fr]">
        <MotionFade className="space-y-8" delay={0.08}>
          <div className="inline-flex items-center gap-2 border border-amber-300/80 bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-900">
            <Sparkles className="h-3.5 w-3.5" />
            {hero.eyebrow}
          </div>

          <div className="space-y-6">
            <h1 className="max-w-4xl font-serif text-5xl leading-[0.96] tracking-tight text-stone-950 md:text-7xl">
              {hero.title}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-stone-600">
              {hero.body}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex items-center justify-center gap-2 bg-stone-950 px-6 py-3.5 text-sm font-medium text-stone-50 transition hover:bg-stone-800"
              href={withLocaleHref(siteSettings.locale, hero.primaryCtaHref)}
            >
              {hero.primaryCtaLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              className="inline-flex items-center justify-center border border-stone-300 bg-white/75 px-6 py-3.5 text-sm font-medium text-stone-800 transition hover:bg-white"
              href={withLocaleHref(siteSettings.locale, hero.secondaryCtaHref)}
            >
              {hero.secondaryCtaLabel}
            </Link>
          </div>
        </MotionFade>

        <MotionFade className="relative" delay={0.18}>
          <div
            className="absolute inset-x-10 top-6 h-40 bg-amber-200/50 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative overflow-hidden border border-stone-300 bg-[linear-gradient(145deg,rgba(248,243,234,0.98),rgba(228,219,204,0.92))] p-5 shadow-[0_40px_120px_-70px_rgba(79,58,29,0.7)]">
            <div className="aspect-[16/10] border border-stone-300/80 bg-stone-900 p-4 text-stone-50" id="video">
              <div className="flex h-full flex-col justify-between bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_45%),linear-gradient(135deg,rgba(70,58,43,0.95),rgba(17,17,17,1))] p-6">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.28em] text-stone-300">
                  <span>{video.eyebrow}</span>
                  <span>{copy.featuredStory}</span>
                </div>

                <div className="space-y-4">
                  <button
                    className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:scale-105 hover:bg-white/20"
                    type="button"
                  >
                    <CirclePlay className="h-8 w-8" />
                  </button>
                  <div className="space-y-2">
                    <h2 className="max-w-xl font-serif text-3xl leading-tight md:text-4xl">
                      {video.title}
                    </h2>
                    <p className="max-w-lg text-sm leading-6 text-stone-300">
                      {video.url
                        ? `${video.body} ${copy.sourceLabel}: ${video.url}`
                        : video.body}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MotionFade>
      </section>

      <section className="grid gap-6 md:grid-cols-3" id="vision">
        {highlights.map((item, index) => (
          <MotionFade delay={0.12 + index * 0.08} key={item.title}>
            <article className="border-t border-stone-300 bg-stone-50/60 px-1 pt-6">
              <div className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                <item.icon className="h-4 w-4" />
                {item.label}
              </div>
              <h3 className="mb-3 font-serif text-3xl leading-tight text-stone-950">
                {item.title}
              </h3>
              <p className="text-sm leading-7 text-stone-600">{item.body}</p>
            </article>
          </MotionFade>
        ))}
      </section>

      <section className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr]" id="about">
        <MotionFade delay={0.15}>
          <div className="space-y-4 border-l-2 border-amber-300 pl-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-500">
              {story.eyebrow}
            </p>
            <h2 className="font-serif text-4xl leading-tight text-stone-950 md:text-5xl">
              {story.heading}
            </h2>
          </div>
        </MotionFade>

        <MotionFade delay={0.22}>
          <div className="grid gap-10">
            <p className="max-w-3xl text-base leading-8 text-stone-600">
              {story.body}
            </p>
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                  {copy.mainContentFlow}
                </p>
                <ul className="space-y-3 text-sm leading-7 text-stone-700">
                  {story.flow.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                  {copy.whyItMatters}
                </p>
                <p className="text-sm leading-7 text-stone-600">
                  {copy.whyItMattersBody}
                </p>
              </div>
            </div>
          </div>
        </MotionFade>
      </section>

      <section className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr]" id="resources">
        <MotionFade delay={0.18}>
          <div className="space-y-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-500">
              {resources.eyebrow}
            </p>
            <h2 className="font-serif text-4xl leading-tight text-stone-950 md:text-5xl">
              {resources.heading}
            </h2>
          </div>
        </MotionFade>

        <div className="grid gap-6 md:grid-cols-3">
          {resources.items.map((item, index) => (
            <MotionFade delay={0.22 + index * 0.06} key={item}>
              <article className="flex h-full flex-col gap-4 border border-stone-300 bg-white/75 p-6">
                <h3 className="font-serif text-2xl leading-tight text-stone-950">
                  {item.title}
                </h3>
                <p className="flex-1 text-sm leading-7 text-stone-600">{item.body}</p>
                <Link
                  className="inline-flex items-center gap-2 text-sm font-medium text-stone-900"
                  href={`/${siteSettings.locale}/resources`}
                >
                  {copy.explore}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            </MotionFade>
          ))}
        </div>
      </section>

      <section className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr]" id="events">
        <MotionFade delay={0.2}>
          <div className="space-y-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-500">
              {copy.eventsEyebrow}
            </p>
            <h2 className="font-serif text-4xl leading-tight text-stone-950 md:text-5xl">
              {teaserEvent?.title ? copy.eventsHeadingWithTeaser : copy.eventsHeadingFallback}
            </h2>
            <p className="max-w-2xl text-base leading-8 text-stone-600">
              {copy.eventsIntro}
            </p>
          </div>
        </MotionFade>

        <MotionFade delay={0.28}>
          <article className="border border-stone-300 bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(242,235,223,0.95))] p-7 shadow-[0_24px_90px_-70px_rgba(55,37,16,0.75)]">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
              {copy.testEventPlaceholder}
            </p>
            <h3 className="mb-3 font-serif text-3xl text-stone-950">
              {teaserEvent?.title ?? copy.placeholderEvent}
            </h3>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
              {teaserEvent?.dateLabel ?? copy.placeholderDate}
            </p>
            <div className="mb-5 flex items-center gap-2 text-sm text-stone-600">
              <MapPin className="h-4 w-4" />
              {teaserEvent?.location ?? contact.location}
            </div>
            <p className="mb-6 text-sm leading-7 text-stone-600">
              {teaserEvent?.body ?? copy.placeholderEventBody}
            </p>
            <Link
              className="inline-flex items-center gap-2 border-b border-stone-800 pb-1 text-sm font-medium text-stone-900"
              href={`/${siteSettings.locale}/events`}
            >
              {copy.askAboutAttending}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        </MotionFade>
      </section>

      <MotionFade className="grid gap-10 border-t border-stone-300 pt-14 lg:grid-cols-[0.95fr_1.05fr]" delay={0.28}>
        <div className="space-y-4" id="contact">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-500">
            {contact.eyebrow}
          </p>
          <h2 className="font-serif text-4xl leading-tight text-stone-950 md:text-5xl">
            {contact.heading}
          </h2>
          <p className="max-w-xl text-base leading-8 text-stone-600">
            {contact.body}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="border border-stone-300 bg-white/80 p-6">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
              {copy.reachOut}
            </p>
            <div className="space-y-3 text-sm text-stone-700">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {siteSettings.contactEmail}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {contact.location}
              </p>
            </div>
          </div>

          <div className="border border-stone-300 bg-stone-950 p-6 text-stone-100">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-400">
              {copy.mainActions}
            </p>
            <div className="space-y-3 text-sm leading-7">
              {contact.actions.map((action) => (
                <p key={action}>{action}</p>
              ))}
            </div>
          </div>
        </div>
      </MotionFade>
    </div>
  );
}

export function LandingFooter({
  footerGroups,
  siteSettings,
  siteTitle,
}: {
  footerGroups: LandingFooterGroup[];
  siteSettings: LandingSiteSettings;
  siteTitle: string;
}) {
  const groups = normalizeFooterGroups(footerGroups);
  const copy = getLandingBodyCopy(siteSettings.locale);

  return (
    <footer className="mx-auto mt-10 w-full max-w-7xl border-t border-stone-300 pt-10">
      <div className="grid gap-10 pb-10 lg:grid-cols-[1.1fr_1fr]">
        <MotionFade delay={0.3}>
          <div className="space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-500">
              {siteSettings.logoText || siteTitle}
            </p>
            <h3 className="max-w-xl font-serif text-3xl leading-tight text-stone-950">
              {copy.footerHeading}
            </h3>
            <p className="max-w-xl text-sm leading-7 text-stone-600">
              {copy.footerBody}
            </p>
            <div className="flex items-center gap-4 pt-1">
              <Link
                className="text-stone-600 transition hover:text-stone-950"
                href={siteSettings.instagramUrl || "#"}
                target="_blank"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                className="text-stone-600 transition hover:text-stone-950"
                href={siteSettings.youtubeUrl || "#"}
                target="_blank"
              >
                <Youtube className="h-5 w-5" />
              </Link>
              <Link
                className="text-stone-600 transition hover:text-stone-950"
                href={siteSettings.facebookUrl || "#"}
                target="_blank"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                className="inline-flex items-center rounded-full border border-stone-300 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-600 transition hover:border-stone-500 hover:text-stone-950"
                href={siteSettings.tiktokUrl || "#"}
                target="_blank"
              >
                TikTok
              </Link>
              <Link
                className="text-stone-600 transition hover:text-stone-950"
                href={`mailto:${siteSettings.contactEmail}`}
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </MotionFade>

        <div className="grid gap-8 sm:grid-cols-3">
          {groups.map((group, index) => (
            <MotionFade delay={0.34 + index * 0.06} key={group.title}>
              <div>
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                  {group.title}
                </p>
                <div className="space-y-3">
                  {group.links.map((link) => (
                    <Link
                      className="block text-sm text-stone-700 transition hover:text-stone-950"
                      href={withLocaleHref(siteSettings.locale, link.href)}
                      key={link.label}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </MotionFade>
          ))}
        </div>
      </div>

      <MotionFade
        className="flex flex-col gap-3 border-t border-stone-300 py-5 text-[11px] font-medium uppercase tracking-[0.28em] text-stone-500 md:flex-row md:items-center md:justify-between"
        delay={0.46}
      >
        <p>{siteSettings.logoText || siteTitle} • {siteSettings.footerTagline}</p>
        <p>{copy.footerTech}</p>
      </MotionFade>
    </footer>
  );
}
