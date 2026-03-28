"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Code2,
  Eye,
  LayoutDashboard,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";

const APPS = [
  {
    title: "Agent Workspace",
    description:
      "Manage customer cases, use AI copilot for faster resolution, and monitor the support queue.",
    href: "http://localhost:3001/",
    icon: ShieldCheck,
    color: "from-blue-500 to-cyan-500",
    status: "Active",
  },
  {
    title: "Customer Chat",
    description:
      "Get instant help from our AI-powered support assistant or connect with a live agent.",
    href: "/chat",
    icon: MessageSquare,
    color: "from-purple-500 to-pink-500",
    status: "Active",
  },
  {
    title: "ServiceGen SaaS",
    description:
      "Comprehensive SaaS dashboard for managing your services, subscriptions, and team.",
    href: "http://localhost:3002/dashboard/",
    icon: LayoutDashboard,
    color: "from-orange-500 to-red-500",
    status: "External",
  },
  {
    title: "ServiceGen Supervisor",
    description:
      "Real-time monitoring and oversight of AI agent performance and system health.",
    href: "#",
    icon: Eye,
    color: "from-emerald-500 to-teal-500",
    status: "Coming Soon",
  },
  {
    title: "ServiceGen API",
    description:
      "Explore our robust API documentation and integrate ServiceGen into your own workflows.",
    href: "http://service-gen-api:8000/docs",
    icon: Code2,
    color: "from-indigo-500 to-violet-500",
    status: "External",
  },
  {
    title: "System Status",
    description:
      "Monitor the health and performance of all ServiceGen ecosystem components.",
    href: "#",
    icon: Zap,
    color: "from-yellow-500 to-amber-500",
    status: "Active",
  },
];

export function LandingDashboard() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {APPS.map((app, index) => (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          key={app.title}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Link
            className={`group relative flex h-full flex-col items-start rounded-3xl border bg-card/50 p-8 backdrop-blur-xl transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 ${app.status === "Coming Soon" ? "pointer-events-none opacity-60" : ""}`}
            href={app.href}
            rel="noopener noreferrer"
            target="_blank"
          >
            <div
              className={`mb-6 rounded-2xl bg-gradient-to-br ${app.color} p-4 text-white shadow-lg transition-transform group-hover:rotate-3 group-hover:scale-110`}
            >
              <app.icon className="h-8 w-8" />
            </div>

            <div className="mb-2 flex w-full items-center justify-between">
              <h2 className="font-bold text-2xl">{app.title}</h2>
              <span
                className={`rounded-full px-2.5 py-0.5 font-bold text-[10px] uppercase tracking-wider ${
                  app.status === "Active"
                    ? "bg-primary/10 text-primary"
                    : app.status === "External"
                      ? "bg-orange-500/10 text-orange-500"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {app.status}
              </span>
            </div>

            <p className="mb-8 text-left text-muted-foreground leading-relaxed">
              {app.description}
            </p>

            <div className="mt-auto flex items-center font-bold text-primary">
              {app.status === "Coming Soon" ? "Stay Tuned" : "Launch App"}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
            </div>

            {/* Subtle Hover Effect */}
            <div className="-z-10 absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

export function LandingHeader() {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/50 px-4 py-1.5 backdrop-blur-md">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="font-medium text-sm">ServiceGen Meta Platform</span>
      </div>
      <h1 className="mb-4 font-bold text-5xl tracking-tight md:text-7xl">
        Welcome to{" "}
        <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          ServiceGen
        </span>
      </h1>
      <p className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground md:text-xl">
        The ultimate ecosystem for AI-driven customer service and service
        generation. Select an application to begin your journey.
      </p>
    </motion.div>
  );
}

export function LandingFooter() {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="mt-20 font-medium text-muted-foreground text-sm uppercase tracking-widest"
      initial={{ opacity: 0 }}
      transition={{ delay: 1, duration: 1 }}
    >
      &copy; 2026 ServiceGen Meta Ecosystem &bull; All Systems Operational
    </motion.div>
  );
}
