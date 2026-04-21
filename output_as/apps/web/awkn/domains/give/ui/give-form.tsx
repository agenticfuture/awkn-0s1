"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import type { GiveSettings } from "../entities/give";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

function formatAmount(amount: number, locale: string) {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", {
    currency: "USD",
    style: "currency",
  }).format(amount / 100);
}

function getGiveCopy(locale: string) {
  if (locale === "fr") {
    return {
      cadenceMonthly: "Chaque mois",
      cadenceOneTime: "Une seule fois",
      cadenceTitle: "Rythme du don",
      completeGift: "Confirmer le don",
      continueGiving: "Preparer mon don",
      contactInstead: "Nous ecrire a la place",
      donorDetailsTitle: "Vos coordonnees",
      donorEmail: "Email",
      donorEmailPlaceholder: "vous@example.org",
      donorName: "Nom complet",
      donorNamePlaceholder: "Votre nom",
      donorNote: "Dedicace ou note",
      donorNoteHelp:
        "Vous pouvez laisser un court message, une intention ou une dedicace si vous le souhaitez.",
      donorNotePlaceholder: "Une breve note, une intention ou une dedicace...",
      donorRequired:
        "Veuillez renseigner votre nom et votre email avant de preparer votre don.",
      customAmount: "Montant libre",
      customAmountHelp:
        "Saisissez librement le montant que vous souhaitez donner pour soutenir l'oeuvre.",
      customAmountPlaceholder: "120",
      customGiftSummary: "Don choisi",
      customGiftSummaryMonthly: "Don mensuel choisi",
      finalizeError:
        "Le don a ete confirme, mais l'enregistrement admin n'a pas encore pu etre synchronise.",
      givingPanelHelp:
        "Choisissez un montant ou saisissez un don libre, puis preparez votre don. Le formulaire securise apparaitra ici.",
      monthlyHelp:
        "Choisissez ce rythme si vous souhaitez soutenir l'oeuvre regulierement chaque mois.",
      liveKeysMissing:
        "Les cles Stripe ne sont pas encore configurees. Ajoutez NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY et STRIPE_SECRET_KEY pour activer les dons en direct.",
      processing: "Preparation en cours...",
      secureDetails: "Coordonnees securisees du don",
      thanks:
        "Merci pour votre generosite. Votre don soutient directement les rassemblements, les ressources et la presence pastorale du reseau.",
      thanksMonthly:
        "Merci pour votre engagement regulier. Votre don mensuel soutient la presence pastorale, les rassemblements et les ressources au fil du temps.",
      voluntaryGift:
        "Ce don est volontaire et soutient librement le travail d'Awakening Network.",
    };
  }

  return {
    cadenceMonthly: "Monthly",
    cadenceOneTime: "One-Time",
    cadenceTitle: "Giving Rhythm",
    completeGift: "Confirm Gift",
    continueGiving: "Prepare My Gift",
    contactInstead: "Contact Us Instead",
    donorDetailsTitle: "Your Details",
    donorEmail: "Email",
    donorEmailPlaceholder: "you@example.org",
    donorName: "Full Name",
    donorNamePlaceholder: "Your name",
    donorNote: "Dedication or Note",
    donorNoteHelp:
      "You can leave a short message, intention, or dedication if you would like.",
    donorNotePlaceholder: "A short note, intention, or dedication...",
    donorRequired:
      "Please add your name and email before preparing your gift.",
    customAmount: "Custom Amount",
    customAmountHelp:
      "Enter any amount you feel led to give in support of the work.",
    customAmountPlaceholder: "120",
    customGiftSummary: "Chosen Gift",
    customGiftSummaryMonthly: "Chosen Monthly Gift",
    finalizeError:
      "Your gift was confirmed, but the admin record has not been synced yet.",
    givingPanelHelp:
      "Choose a suggested amount or enter your own gift, then prepare your giving. The secure giving form will appear here.",
    monthlyHelp:
      "Choose this rhythm if you want to support the work steadily each month.",
    liveKeysMissing:
      "Stripe keys are not configured yet. Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY and STRIPE_SECRET_KEY to enable live giving.",
    processing: "Preparing...",
    secureDetails: "Secure Gift Details",
    thanks:
      "Thank you for your generosity. Your gift directly supports gatherings, resources, and pastoral presence across the network.",
    thanksMonthly:
      "Thank you for your ongoing generosity. Your monthly gift helps sustain pastoral presence, gatherings, and resources over time.",
    voluntaryGift:
      "This is a voluntary gift made freely to support the work of Awakening Network.",
  };
}

function parseCustomAmountToCents(value: string) {
  const normalized = value.replace(/[^0-9.]/g, "");
  if (!normalized) {
    return 0;
  }

  const parsed = Number.parseFloat(normalized);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return 0;
  }

  return Math.round(parsed * 100);
}

function PaymentForm({
  amount,
  cadence,
  customerId,
  donorEmail,
  donorName,
  donorNote,
  locale,
  subscriptionId,
  successMessage,
}: {
  amount: number;
  cadence: "monthly" | "one_time";
  customerId: string;
  donorEmail: string;
  donorName: string;
  donorNote: string;
  locale: string;
  subscriptionId: string;
  successMessage: string;
}) {
  const copy = getGiveCopy(locale);
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setStatus("submitting");

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/${locale}/give/thanks?success=1&cadence=${cadence}&customer_id=${encodeURIComponent(customerId)}&donor_email=${encodeURIComponent(donorEmail)}&donor_name=${encodeURIComponent(donorName)}&donor_note=${encodeURIComponent(donorNote)}&subscription_id=${encodeURIComponent(subscriptionId)}`,
      },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message ?? "Unable to confirm the gift.");
      return;
    }

    setStatus("success");
    setMessage(successMessage);
  }

  return (
    <form className="space-y-5 border border-stone-300 bg-white/85 p-6" onSubmit={handleSubmit}>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
          {cadence === "monthly" ? copy.customGiftSummaryMonthly : copy.customGiftSummary}
        </p>
        <p className="mt-2 font-serif text-3xl text-stone-950">{formatAmount(amount, locale)}</p>
        <p className="mt-2 text-sm leading-7 text-stone-600">
          {cadence === "monthly" ? copy.thanksMonthly : copy.thanks}
        </p>
      </div>
      <div className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
          {copy.secureDetails}
        </p>
        <PaymentElement />
      </div>
      <button
        className="w-full bg-stone-950 px-5 py-3 text-sm font-medium text-stone-50 transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={!stripe || status === "submitting"}
        type="submit"
      >
        {status === "submitting" ? copy.processing : copy.completeGift}
      </button>
      {message ? <p className="text-sm text-stone-600">{message}</p> : null}
    </form>
  );
}

export function GiveForm({
  locale,
  settings,
}: {
  locale: string;
  settings: GiveSettings;
}) {
  const copy = getGiveCopy(locale);
  const searchParams = useSearchParams();
  const [cadence, setCadence] = useState<"monthly" | "one_time">("one_time");
  const [selectedAmount, setSelectedAmount] = useState(settings.tiers[0]?.amount ?? 2500);
  const [customAmount, setCustomAmount] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorNote, setDonorNote] = useState("");
  const [error, setError] = useState("");
  const [finalizeMessage, setFinalizeMessage] = useState("");
  const [subscriptionId, setSubscriptionId] = useState("");
  const canUseStripe = Boolean(stripePromise && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  const wasSuccessful = searchParams.get("success") === "1";
  const paymentIntentId = searchParams.get("payment_intent");
  const redirectStatus = searchParams.get("redirect_status");

  const selectedTier = useMemo(
    () => settings.tiers.find((tier) => tier.amount === selectedAmount) ?? settings.tiers[0],
    [selectedAmount, settings.tiers]
  );

  async function startCheckout(amount: number) {
    setError("");

    if (!donorName.trim() || !donorEmail.trim()) {
      setClientSecret("");
      setError(copy.donorRequired);
      return;
    }

    const response = await fetch("/api/give/intent", {
      body: JSON.stringify({
        amount,
        cadence,
        donorEmail,
        donorName,
        donorNote,
        locale,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const payload = (await response.json()) as
      | {
          cadence?: "monthly" | "one_time";
          clientSecret?: string;
          customerId?: string;
          error?: string;
          subscriptionId?: string;
        }
      | undefined;

    if (!response.ok || !payload?.clientSecret) {
      setClientSecret("");
      setError(payload?.error ?? "Unable to initialize the donation payment.");
      return;
    }

    setClientSecret(payload.clientSecret);
    setCustomerId(payload.customerId ?? "");
    setSubscriptionId(payload.subscriptionId ?? "");
  }

  function handleCustomAmountChange(value: string) {
    setCustomAmount(value);
    const cents = parseCustomAmountToCents(value);
    if (cents > 0) {
      setSelectedAmount(cents);
    }
  }

  useEffect(() => {
    setClientSecret("");
    setCustomerId("");
    setSubscriptionId("");
  }, [cadence, selectedAmount]);

  useEffect(() => {
    if (!paymentIntentId || !["succeeded", "processing"].includes(redirectStatus ?? "")) {
      return;
    }

    let cancelled = false;

    async function finalizeGift() {
      const response = await fetch("/api/give/finalize", {
        body: JSON.stringify({
          locale,
          paymentIntentId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const payload = (await response.json()) as { error?: string } | undefined;

      if (cancelled) {
        return;
      }

      if (!response.ok) {
        setFinalizeMessage(payload?.error ?? copy.finalizeError);
        return;
      }

      setFinalizeMessage(settings.successMessage);
    }

    void finalizeGift();

    return () => {
      cancelled = true;
    };
  }, [copy.finalizeError, locale, paymentIntentId, redirectStatus, settings.successMessage]);

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-500">
            {settings.eyebrow}
          </p>
          <h1 className="font-serif text-5xl leading-tight text-stone-950">
            {settings.heading}
          </h1>
          <p className="max-w-2xl text-base leading-8 text-stone-600">{settings.body}</p>
          <p className="max-w-2xl text-sm leading-7 text-stone-500">{copy.voluntaryGift}</p>
        </div>

        <div className="border border-stone-300 bg-white/80 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
            {copy.cadenceTitle}
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <button
              className={`border px-4 py-4 text-left transition ${
                cadence === "one_time"
                  ? "border-stone-900 bg-stone-950 text-stone-50"
                  : "border-stone-300 bg-white text-stone-900 hover:border-stone-500"
              }`}
              onClick={() => setCadence("one_time")}
              type="button"
            >
              <p className="font-serif text-2xl">{copy.cadenceOneTime}</p>
              <p className={`mt-2 text-sm leading-7 ${cadence === "one_time" ? "text-stone-200" : "text-stone-600"}`}>
                {copy.voluntaryGift}
              </p>
            </button>
            <button
              className={`border px-4 py-4 text-left transition ${
                cadence === "monthly"
                  ? "border-stone-900 bg-stone-950 text-stone-50"
                  : "border-stone-300 bg-white text-stone-900 hover:border-stone-500"
              }`}
              onClick={() => setCadence("monthly")}
              type="button"
            >
              <p className="font-serif text-2xl">{copy.cadenceMonthly}</p>
              <p className={`mt-2 text-sm leading-7 ${cadence === "monthly" ? "text-stone-200" : "text-stone-600"}`}>
                {copy.monthlyHelp}
              </p>
            </button>
          </div>
        </div>

        <div className="border border-stone-300 bg-white/80 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
            {copy.donorDetailsTitle}
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-stone-700">
              <span>{copy.donorName}</span>
              <input
                autoComplete="name"
                className="border border-stone-300 bg-white px-4 py-3 text-stone-950 outline-none transition focus:border-stone-700"
                onChange={(event) => setDonorName(event.target.value)}
                placeholder={copy.donorNamePlaceholder}
                value={donorName}
              />
            </label>
            <label className="grid gap-2 text-sm text-stone-700">
              <span>{copy.donorEmail}</span>
              <input
                autoComplete="email"
                className="border border-stone-300 bg-white px-4 py-3 text-stone-950 outline-none transition focus:border-stone-700"
                onChange={(event) => setDonorEmail(event.target.value)}
                placeholder={copy.donorEmailPlaceholder}
                type="email"
                value={donorEmail}
              />
            </label>
          </div>
          <label className="mt-4 grid gap-2 text-sm text-stone-700">
            <span>{copy.donorNote}</span>
            <textarea
              className="min-h-28 border border-stone-300 bg-white px-4 py-3 text-stone-950 outline-none transition focus:border-stone-700"
              onChange={(event) => setDonorNote(event.target.value)}
              placeholder={copy.donorNotePlaceholder}
              value={donorNote}
            />
            <span className="text-xs leading-6 text-stone-500">{copy.donorNoteHelp}</span>
          </label>
        </div>

        <div className="grid gap-4">
          {settings.tiers.map((tier) => {
            const selected = tier.amount === selectedAmount;

            return (
              <button
                className={`border px-5 py-5 text-left transition ${
                  selected
                    ? "border-stone-900 bg-stone-950 text-stone-50"
                    : "border-stone-300 bg-white/80 text-stone-900 hover:border-stone-500"
                }`}
                key={tier.amount}
                onClick={() => setSelectedAmount(tier.amount)}
                type="button"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-serif text-2xl">{tier.label}</p>
                    <p className={`mt-2 text-sm leading-7 ${selected ? "text-stone-200" : "text-stone-600"}`}>
                      {tier.description}
                    </p>
                  </div>
                  <span className="text-sm font-semibold uppercase tracking-[0.24em]">
                    {formatAmount(tier.amount, locale)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="border border-stone-300 bg-white/80 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
            {copy.customAmount}
          </p>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-xl text-stone-500">$</span>
            <input
              className="w-full border-0 bg-transparent font-serif text-3xl text-stone-950 outline-none"
              inputMode="decimal"
              onChange={(event) => handleCustomAmountChange(event.target.value)}
              placeholder={copy.customAmountPlaceholder}
              value={customAmount}
            />
          </div>
          <p className="mt-3 text-sm leading-7 text-stone-600">{copy.customAmountHelp}</p>
        </div>

        <div className="flex gap-3">
          <button
            className="bg-stone-950 px-5 py-3 text-sm font-medium text-stone-50 transition hover:bg-stone-800"
            onClick={() => startCheckout(selectedAmount)}
            type="button"
          >
            {copy.continueGiving}
          </button>
          <a
            className="border border-stone-300 bg-white/80 px-5 py-3 text-sm font-medium text-stone-900 transition hover:bg-white"
            href={`mailto:hello@awakeningnetwork.org?subject=${encodeURIComponent(`Give to Awakening Network (${selectedTier?.label ?? selectedAmount})`)}`}
          >
            {copy.contactInstead}
          </a>
        </div>

        {wasSuccessful ? (
          <div className="border border-emerald-300 bg-emerald-50 p-5 text-sm leading-7 text-emerald-900">
            {finalizeMessage || settings.successMessage}
          </div>
        ) : null}

        {!canUseStripe ? (
          <p className="text-sm text-amber-700">
            {copy.liveKeysMissing}
          </p>
        ) : null}
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
      </div>

      <div>
        {clientSecret && stripePromise ? (
          <Elements options={{ clientSecret }} stripe={stripePromise}>
            <PaymentForm
              amount={selectedAmount}
              cadence={cadence}
              customerId={customerId}
              donorEmail={donorEmail}
              donorName={donorName}
              donorNote={donorNote}
              locale={locale}
              subscriptionId={subscriptionId}
              successMessage={settings.successMessage}
            />
          </Elements>
        ) : (
          <div className="border border-dashed border-stone-300 bg-white/70 p-6 text-sm leading-7 text-stone-600">
            {copy.givingPanelHelp}
          </div>
        )}
      </div>
    </div>
  );
}
