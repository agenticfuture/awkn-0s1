"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Facebook,
  HandHeart,
  Instagram,
  Mail,
  MapPin,
  Menu,
  MessageCircleHeart,
  PlayCircle,
  Send,
  X,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const NAV_GROUPS = [
  {
    label: "Discover",
    items: [
      { href: "#home", label: "Home" },
      { href: "#about", label: "About Us" },
      { href: "#video", label: "Intro Video" },
    ],
  },
  {
    label: "Experience",
    items: [
      { href: "#events", label: "Events" },
      { href: "#give", label: "Give" },
      { href: "#contact", label: "Contact" },
    ],
  },
];

const STATS = [
  { value: "12+", label: "Cities connected across the network" },
  { value: "4K", label: "People reached through gatherings and content" },
  { value: "24", label: "Intentional retreats, prayer nights, and cohorts" },
];

const MINISTRIES = [
  {
    title: "Retreats",
    body:
      "Sacred, unhurried spaces for spiritual renewal, honest reflection, and community healing.",
  },
  {
    title: "Teaching",
    body:
      "Conversations and resources that make formation practical, accessible, and grounded in everyday life.",
  },
  {
    title: "Pastoral Care",
    body:
      "A relational ministry posture that values presence, wise listening, and care for the whole person.",
  },
];

const EVENTS = [
  {
    title: "Gathering Nights",
    body:
      "A regular rhythm of worship, testimony, prayer, and thoughtful teaching in a calm environment.",
  },
  {
    title: "Leadership Retreats",
    body:
      "Intentional spaces for pastors, founders, and ministry leaders to rest, process, and be strengthened.",
  },
  {
    title: "Formation Series",
    body:
      "Short journeys through identity, prayer, mission, and emotional-spiritual wholeness.",
  },
];

const SOCIAL_LINKS = [
  { href: "https://instagram.com", label: "Instagram", icon: Instagram },
  { href: "https://facebook.com", label: "Facebook", icon: Facebook },
  { href: "https://youtube.com", label: "YouTube", icon: Youtube },
];

const revealUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export function LandingHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-stone-200/80 border-b bg-[#f7f1e8]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 md:px-8">
        <Link className="flex items-center gap-3 text-stone-950" href="#home" scroll>
          <div className="h-11 w-[2px] rounded-full bg-stone-300" />
          <div>
            <p className="font-serif text-2xl leading-none md:text-3xl">
              Awakening Network
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.32em] text-stone-500">
              Gather. Restore. Send.
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Button
            asChild
            className="hidden rounded-full border-stone-300 bg-white/80 px-5 text-xs uppercase tracking-[0.18em] text-stone-900 hover:bg-white md:inline-flex"
            variant="outline"
          >
            <Link href="#contact" scroll>
              Contact
            </Link>
          </Button>

          <div className="relative">
            <Button
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              className="group rounded-full bg-stone-950 px-5 text-xs uppercase tracking-[0.18em] text-stone-50 hover:bg-stone-800"
              onClick={() => setMenuOpen((open) => !open)}
              type="button"
            >
              {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
              Menu
              <ChevronDown
                className={`size-4 transition-transform ${menuOpen ? "rotate-180" : ""}`}
              />
            </Button>

            <AnimatePresence>
              {menuOpen ? (
                <motion.div
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute right-0 top-[calc(100%+0.75rem)] w-[22rem] overflow-hidden rounded-[1.75rem] border border-stone-200 bg-[linear-gradient(180deg,rgba(255,253,249,0.98),rgba(242,233,220,0.98))] p-3 shadow-[0_24px_70px_rgba(55,39,23,0.18)]"
                  exit={{ opacity: 0, y: -12, scale: 0.98 }}
                  initial={{ opacity: 0, y: -12, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  <div className="grid gap-3">
                    {NAV_GROUPS.map((group) => (
                      <div
                        className="rounded-[1.25rem] border border-white/80 bg-white/70 p-4"
                        key={group.label}
                      >
                        <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-stone-500">
                          {group.label}
                        </p>
                        <div className="grid gap-2">
                          {group.items.map((item) => (
                            <Link
                              className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-stone-700 transition-colors hover:bg-stone-100 hover:text-stone-950"
                              href={item.href}
                              key={item.href}
                              onClick={() => setMenuOpen(false)}
                              scroll
                            >
                              <span>{item.label}</span>
                              <ArrowRight className="size-4" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

export function LandingDashboard() {
  return (
    <motion.main
      animate="visible"
      className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:px-8 md:py-10"
      initial="hidden"
      variants={staggerContainer}
    >
      <motion.section
        className="relative overflow-hidden rounded-[2rem] border border-stone-200/80 bg-[linear-gradient(135deg,rgba(249,246,239,0.98),rgba(238,231,219,0.95))] shadow-[0_30px_90px_rgba(76,57,35,0.12)]"
        id="home"
        variants={revealUp}
      >
        <motion.div
          animate={{ opacity: [0.45, 0.8, 0.45] }}
          className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(157,113,69,0.18),transparent_65%)]"
          transition={{ duration: 6, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
        />
        <div className="grid gap-10 px-6 py-8 md:px-10 md:py-12 lg:grid-cols-[1.15fr_0.85fr] lg:px-14 lg:py-16">
          <motion.div variants={revealUp}>
            <Badge className="mb-5 rounded-full border border-amber-800/15 bg-white/70 px-4 py-1.5 text-[11px] uppercase tracking-[0.3em] text-stone-700">
              Awakening Network
            </Badge>
            <h1 className="max-w-4xl font-serif text-5xl leading-[0.95] tracking-[-0.03em] text-stone-950 md:text-7xl">
              A place to become anchored in faith, community, and spiritual
              renewal.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-700 md:text-lg">
              We create thoughtful gatherings, teaching spaces, and pastoral
              rhythms that help people slow down, hear God clearly, and move
              forward with peace and purpose.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="h-12 rounded-full bg-stone-950 px-6 text-sm uppercase tracking-[0.18em] text-stone-50 hover:bg-stone-800"
                size="lg"
              >
                <Link href="#about" scroll>
                  Learn More
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                className="h-12 rounded-full border-stone-300 bg-white/80 px-6 text-sm uppercase tracking-[0.18em] text-stone-900 hover:bg-stone-100"
                size="lg"
                variant="outline"
              >
                <Link href="#video" scroll>
                  Watch Intro
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5.5, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
          >
            <Card className="overflow-hidden rounded-[2rem] border-stone-200/80 bg-stone-950 text-stone-50 shadow-none">
              <CardHeader className="pb-3">
                <CardDescription className="text-[11px] uppercase tracking-[0.25em] text-stone-300">
                  A Spiritual Home
                </CardDescription>
                <CardTitle className="font-serif text-3xl leading-tight text-stone-50">
                  We want people to feel held, not hurried.
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <div className="mb-2 flex items-center gap-2 text-sm text-stone-300">
                    <CalendarDays className="size-4" />
                    This Season
                  </div>
                  <p className="text-sm leading-7 text-stone-200">
                    Prayer gatherings, teaching conversations, restoration
                    retreats, and practical support for leaders and families.
                  </p>
                </div>
                <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,rgba(196,163,117,0.2),rgba(124,92,58,0.4))] p-5">
                  <p className="font-serif text-2xl leading-tight">
                    “A grounded, beautiful invitation into life with God.”
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="grid gap-4 sm:grid-cols-3"
        variants={staggerContainer}
      >
        {STATS.map((stat) => (
          <motion.div
            className="rounded-[1.5rem] border border-stone-200/80 bg-white/70 p-5 backdrop-blur"
            key={stat.label}
            variants={revealUp}
            whileHover={{ y: -6, boxShadow: "0 18px 50px rgba(76,57,35,0.12)" }}
          >
            <div className="font-serif text-4xl text-stone-950">{stat.value}</div>
            <p className="mt-2 text-sm leading-6 text-stone-600">{stat.label}</p>
          </motion.div>
        ))}
      </motion.section>

      <motion.section
        className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]"
        id="about"
        variants={revealUp}
      >
        <Card className="rounded-[2rem] border-stone-200/80 bg-[#f3ede4] shadow-none">
          <CardHeader>
            <CardDescription className="text-[11px] uppercase tracking-[0.25em] text-stone-500">
              About The Network
            </CardDescription>
            <CardTitle className="font-serif text-4xl leading-tight text-stone-950">
              Built for people longing for depth, healing, and a truer way of
              belonging.
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-stone-700">
            <p>
              Like the Anchored North front page, this structure leads with
              story and invitation before anything technical. The goal is to
              feel clear, spacious, and trustworthy.
            </p>
            <p>
              Awakening Network exists to host meaningful spiritual moments and
              to support people through discipleship, prayer, conversation, and
              restorative community.
            </p>
          </CardContent>
        </Card>

        <motion.div className="grid gap-6 md:grid-cols-3" variants={staggerContainer}>
          {MINISTRIES.map((item) => (
            <motion.div key={item.title} variants={revealUp} whileHover={{ y: -8 }}>
              <Card className="h-full rounded-[2rem] border-stone-200/80 bg-white shadow-none">
                <CardHeader>
                  <CardTitle className="font-serif text-3xl text-stone-950">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-stone-600">{item.body}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        className="grid gap-6 lg:grid-cols-[1fr_0.9fr]"
        id="video"
        variants={revealUp}
      >
        <Card className="rounded-[2rem] border-stone-200/80 bg-stone-950 text-stone-50 shadow-none">
          <CardHeader>
            <CardDescription className="text-[11px] uppercase tracking-[0.25em] text-stone-400">
              Intro Video
            </CardDescription>
            <CardTitle className="font-serif text-4xl leading-tight text-stone-50">
              A dedicated place for the main introduction to the ministry.
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              className="flex aspect-video items-center justify-center rounded-[1.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(43,30,18,0.95),rgba(110,79,47,0.88))] p-6 text-center"
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.01 }}
            >
              <div>
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2.8, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
                >
                  <PlayCircle className="mx-auto size-14 text-stone-100" />
                </motion.div>
                <p className="mt-4 font-serif text-3xl text-stone-50">
                  Main Intro Video
                </p>
                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-stone-300">
                  Replace this panel with your hosted video embed or hero media
                  once you have the final introduction film.
                </p>
              </div>
            </motion.div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-stone-200/80 bg-[linear-gradient(180deg,#fffdf9,#f0e7da)] shadow-none">
          <CardHeader>
            <CardDescription className="text-[11px] uppercase tracking-[0.25em] text-stone-500">
              Welcome
            </CardDescription>
            <CardTitle className="font-serif text-4xl leading-tight text-stone-950">
              Come as you are. Stay long enough to be renewed.
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-[1.5rem] border border-stone-200 bg-white/70 p-6">
              <div className="flex items-start gap-4">
                <MessageCircleHeart className="mt-1 size-6 text-amber-800" />
                <p className="text-sm leading-7 text-stone-700">
                  The built-in chat can serve as a gentle first point of
                  contact for visitors who want to ask questions before
                  attending, giving, or reaching out directly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      <motion.section
        className="rounded-[2rem] border border-stone-200/80 bg-white p-6 shadow-none md:p-8"
        id="events"
        variants={revealUp}
      >
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-stone-500">
              Events & Pathways
            </p>
            <h2 className="mt-3 font-serif text-4xl text-stone-950">
              Different expressions, one coherent invitation.
            </h2>
          </div>
          <Badge className="rounded-full bg-[#f3ede4] px-4 py-1.5 text-stone-700">
            Shadcn UI foundation
          </Badge>
        </div>
        <motion.div className="grid gap-5 md:grid-cols-3" variants={staggerContainer}>
          {EVENTS.map((item) => (
            <motion.div key={item.title} variants={revealUp} whileHover={{ y: -8 }}>
              <Card className="h-full rounded-[1.75rem] border-stone-200/80 bg-[#fcfaf7] shadow-none">
                <CardHeader>
                  <CardTitle className="font-serif text-3xl text-stone-950">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-stone-600">{item.body}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        className="grid gap-6 lg:grid-cols-[1fr_0.9fr]"
        id="give"
        variants={revealUp}
      >
        <Card className="rounded-[2rem] border-stone-200/80 bg-[#ede3d4] shadow-none">
          <CardHeader>
            <CardDescription className="text-[11px] uppercase tracking-[0.25em] text-stone-500">
              Support The Work
            </CardDescription>
            <CardTitle className="font-serif text-4xl text-stone-950">
              Help sustain spaces of renewal, teaching, and pastoral care.
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm leading-7 text-stone-700">
              Give toward retreats, accessible resources, community gatherings,
              and the practical work required to care well for people.
            </p>
            <Button
              asChild
              className="rounded-full bg-stone-950 px-6 text-sm uppercase tracking-[0.18em] text-stone-50 hover:bg-stone-800"
            >
              <Link href="/login">
                <HandHeart className="size-4" />
                Support The Mission
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-stone-200/80 bg-stone-950 shadow-none">
          <CardHeader>
            <CardDescription className="text-[11px] uppercase tracking-[0.25em] text-stone-400">
              Visit & Reach Out
            </CardDescription>
            <CardTitle className="font-serif text-4xl text-stone-50">
              We would love to hear your story and help you find your place.
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-stone-300">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 size-5 text-stone-100" />
              <p>Awakening Network Community Hub, Nashville, Tennessee</p>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="mt-1 size-5 text-stone-100" />
              <p>hello@awakeningnetwork.org</p>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      <motion.section
        className="rounded-[2rem] border border-stone-200/80 bg-[linear-gradient(180deg,#fffdf9,#f3ede4)] p-6 shadow-none md:p-8"
        id="contact"
        variants={revealUp}
      >
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-stone-500">
              Contact Us
            </p>
            <h2 className="mt-3 font-serif text-4xl text-stone-950">
              Tell us how we can help, pray, or connect.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-stone-700">
              The section is already designed and placed at the bottom of the
              page. Wire it to your real form handler or CRM endpoint when that
              is ready.
            </p>
          </div>

          <motion.div variants={revealUp}>
            <Card className="rounded-[2rem] border-stone-200/80 bg-white shadow-none">
              <CardContent className="p-6">
                <form className="grid gap-4">
                  <Input
                    className="h-12 rounded-xl border-stone-200 bg-[#fcfaf7]"
                    placeholder="Your name"
                    type="text"
                  />
                  <Input
                    className="h-12 rounded-xl border-stone-200 bg-[#fcfaf7]"
                    placeholder="Email address"
                    type="email"
                  />
                  <Input
                    className="h-12 rounded-xl border-stone-200 bg-[#fcfaf7]"
                    placeholder="Subject"
                    type="text"
                  />
                  <Textarea
                    className="min-h-36 rounded-xl border-stone-200 bg-[#fcfaf7]"
                    placeholder="How can we help?"
                  />
                  <Button
                    className="h-12 rounded-full bg-stone-950 text-sm uppercase tracking-[0.18em] text-stone-50 hover:bg-stone-800"
                    type="submit"
                  >
                    <Send className="size-4" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.section>
    </motion.main>
  );
}

export function LandingFooter() {
  return (
    <motion.footer
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto mt-4 w-full max-w-7xl px-4 pb-10 md:px-8"
      initial={{ opacity: 0, y: 20 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <div className="rounded-[2rem] border border-stone-200/80 bg-white/70 px-6 py-8 backdrop-blur">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-serif text-3xl text-stone-950">
              Awakening Network
            </p>
            <p className="mt-2 text-sm leading-7 text-stone-600">
              Anchored in faith, formed in community, sent with love.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map((social) => (
              <motion.div key={social.label} whileHover={{ y: -4 }} whileTap={{ scale: 0.96 }}>
                <Link
                  className="flex size-11 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 transition-colors hover:text-stone-950"
                  href={social.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  <social.icon className="size-5" />
                  <span className="sr-only">{social.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-6 border-stone-200 border-t pt-6 text-sm text-stone-500">
          © 2026 Awakening Network. All rights reserved.
        </div>
      </div>
    </motion.footer>
  );
}
