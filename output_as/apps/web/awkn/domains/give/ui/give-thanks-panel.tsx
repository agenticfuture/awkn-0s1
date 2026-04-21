"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { GiveReport, GiveSettings } from "../entities/give";

function formatAmount(amount: number, locale: string) {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", {
    currency: "USD",
    style: "currency",
  }).format(amount / 100);
}

function formatDate(value: string, locale: string) {
  if (!value) {
    return locale === "fr" ? "En cours de mise a jour" : "Updating now";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
    dateStyle: "long",
  }).format(date);
}

function getCopy(locale: string) {
  if (locale === "fr") {
    return {
      adminSync: "Coordination backend",
      backHome: "Retour a l'accueil",
      backToGive: "Revenir a Donner",
      cadenceMonthly: "Don mensuel",
      cadenceOneTime: "Don ponctuel",
      giftRecorded: "Don enregistre",
      latestGift: "Dernier don",
      latestStatus: "Statut recent",
      latestWooOrder: "Commande Woo",
      loading: "Nous finalisons votre enregistrement de don...",
      reportBody:
        "Cette vue confirme aussi que le frontend React et WordPress restent bien synchronises apres le don.",
      reportTitle: "Apercu de generosite",
      statusCompleted: "Termine",
      statusOnHold: "En attente",
      statusPending: "En preparation",
      subtitle:
        "Merci pour votre generosite. Votre soutien est recu et l'equipe peut maintenant le suivre en toute clarte.",
      syncFailed:
        "Le don a ete confirme, mais la synchronisation administrative demande encore une verification.",
      syncOk:
        "Le don et son suivi interne ont bien ete enregistres, y compris la trace WooCommerce.",
      title: "Merci pour votre don",
      totalGiven: "Total enregistre",
      totalGifts: "Nombre de dons",
      wooDisabled: "WooCommerce n'est pas actif pour cet environnement.",
    };
  }

  return {
    adminSync: "Backend coordination",
    backHome: "Return Home",
    backToGive: "Return to Give",
    cadenceMonthly: "Monthly gift",
    cadenceOneTime: "One-time gift",
    giftRecorded: "Gift recorded",
    latestGift: "Latest gift",
    latestStatus: "Recent status",
    latestWooOrder: "Woo order",
    loading: "We are finalizing your gift record now...",
    reportBody:
      "This view also confirms that the React frontend and WordPress backend remain in sync after the gift.",
    reportTitle: "Generosity snapshot",
    statusCompleted: "Completed",
    statusOnHold: "On hold",
    statusPending: "Preparing",
    subtitle:
      "Thank you for your generosity. Your support has been received, and the team can now track it clearly in the background.",
    syncFailed:
      "Your gift was confirmed, but the admin sync still needs a manual review.",
    syncOk:
      "Your gift and its internal follow-through have been recorded, including the WooCommerce trace.",
    title: "Thank you for your gift",
    totalGiven: "Total recorded",
    totalGifts: "Gift count",
    wooDisabled: "WooCommerce is not active in this environment.",
  };
}

function getStatusLabel(status: string, locale: string) {
  const copy = getCopy(locale);

  if (status === "completed" || status === "succeeded") {
    return copy.statusCompleted;
  }

  if (status === "on-hold" || status === "processing" || status === "requires_capture") {
    return copy.statusOnHold;
  }

  return copy.statusPending;
}

type FinalizePayload = {
  error?: string;
  paymentIntentId?: string;
  status?: string;
  synced?: {
    cadence?: string;
    giftId?: number;
    woo?: {
      enabled?: boolean;
      orderId?: number;
      status?: string;
    };
  };
};

export function GiveThanksPanel({
  initialReport,
  locale,
  settings,
}: {
  initialReport: GiveReport;
  locale: string;
  settings: GiveSettings;
}) {
  const copy = useMemo(() => getCopy(locale), [locale]);
  const searchParams = useSearchParams();
  const [finalizeState, setFinalizeState] = useState<"loading" | "success" | "error">("loading");
  const [finalizeMessage, setFinalizeMessage] = useState(settings.successMessage);
  const [report, setReport] = useState(initialReport);
  const [wooOrderId, setWooOrderId] = useState<number | null>(null);

  const cadence = searchParams.get("cadence") === "monthly" ? "monthly" : "one_time";
  const customerId = searchParams.get("customer_id") ?? "";
  const donorEmail = searchParams.get("donor_email") ?? "";
  const donorName = searchParams.get("donor_name") ?? "";
  const donorNote = searchParams.get("donor_note") ?? "";
  const paymentIntentId = searchParams.get("payment_intent");
  const redirectStatus = searchParams.get("redirect_status");
  const subscriptionId = searchParams.get("subscription_id") ?? "";
  const wasSuccessful = searchParams.get("success") === "1";

  useEffect(() => {
    if (!wasSuccessful || !paymentIntentId || !["succeeded", "processing"].includes(redirectStatus ?? "")) {
      setFinalizeState("error");
      setFinalizeMessage(copy.syncFailed);
      return;
    }

    let cancelled = false;

    async function finalizeGift() {
      const finalizeResponse = await fetch("/api/give/finalize", {
        body: JSON.stringify({
          cadence,
          customerId,
          donorEmail,
          donorName,
          donorNote,
          locale,
          paymentIntentId,
          subscriptionId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const finalizePayload = (await finalizeResponse.json()) as FinalizePayload;

      if (cancelled) {
        return;
      }

      if (!finalizeResponse.ok) {
        setFinalizeState("error");
        setFinalizeMessage(finalizePayload.error ?? copy.syncFailed);
        return;
      }

      setFinalizeState("success");
      setFinalizeMessage(copy.syncOk);
      setWooOrderId(finalizePayload.synced?.woo?.orderId ?? null);

      const reportResponse = await fetch(`/api/give/report?locale=${locale}`, {
        cache: "no-store",
      });

      if (!reportResponse.ok) {
        return;
      }

      const latestReport = (await reportResponse.json()) as GiveReport;

      if (!cancelled) {
        setReport(latestReport);
      }
    }

    void finalizeGift();

    return () => {
      cancelled = true;
    };
  }, [cadence, copy.syncFailed, copy.syncOk, customerId, donorEmail, donorName, donorNote, locale, paymentIntentId, redirectStatus, subscriptionId, wasSuccessful]);

  return (
    <section className="space-y-8 border border-stone-300 bg-white/85 p-8 shadow-[0_30px_100px_rgba(76,56,24,0.08)]">
      <div className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-stone-500">
          {settings.eyebrow}
        </p>
        <h1 className="font-serif text-5xl leading-tight text-stone-950">{copy.title}</h1>
        <p className="max-w-3xl text-base leading-8 text-stone-600">{copy.subtitle}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5 border border-stone-300 bg-stone-50 p-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-500">
              {copy.giftRecorded}
            </p>
          <p className="mt-3 text-base leading-8 text-stone-700">
            {finalizeState === "loading" ? copy.loading : finalizeMessage}
          </p>
          <p className="mt-2 text-sm leading-7 text-stone-500">
            {cadence === "monthly" ? copy.cadenceMonthly : copy.cadenceOneTime}
          </p>
        </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-500">
                {copy.latestGift}
              </p>
              <p className="mt-2 font-serif text-3xl text-stone-950">
                {formatAmount(report.latestGiftAmountCents, locale)}
              </p>
              <p className="mt-2 text-sm leading-7 text-stone-600">
                {formatDate(report.latestGiftDate, locale)}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-500">
                {copy.adminSync}
              </p>
              <p className="mt-2 font-serif text-3xl text-stone-950">
                {getStatusLabel(wooOrderId ? "completed" : report.latestGiftStatus, locale)}
              </p>
              <p className="mt-2 text-sm leading-7 text-stone-600">
                {wooOrderId
                  ? `${copy.latestWooOrder}: #${wooOrderId}`
                  : report.latestWooOrderId
                    ? `${copy.latestWooOrder}: #${report.latestWooOrderId}`
                    : copy.wooDisabled}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 border border-stone-300 bg-white p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-500">
            {copy.reportTitle}
          </p>
          <p className="text-sm leading-7 text-stone-600">{copy.reportBody}</p>
          <div className="grid gap-3">
            <div className="border border-stone-200 px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                {copy.totalGifts}
              </p>
              <p className="mt-2 font-serif text-3xl text-stone-950">{report.totalGifts}</p>
            </div>
            <div className="border border-stone-200 px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                {copy.totalGiven}
              </p>
              <p className="mt-2 font-serif text-3xl text-stone-950">
                {formatAmount(report.totalAmountCents, locale)}
              </p>
            </div>
            <div className="border border-stone-200 px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                {copy.latestStatus}
              </p>
              <p className="mt-2 font-serif text-2xl text-stone-950">
                {getStatusLabel(report.latestGiftStatus, locale)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          className="bg-stone-950 px-5 py-3 text-sm font-medium text-stone-50 transition hover:bg-stone-800"
          href={`/${locale}`}
        >
          {copy.backHome}
        </Link>
        <Link
          className="border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-stone-900 transition hover:bg-stone-50"
          href={`/${locale}/give`}
        >
          {copy.backToGive}
        </Link>
      </div>
    </section>
  );
}
