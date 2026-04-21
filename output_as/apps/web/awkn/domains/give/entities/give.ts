export type GiveTier = {
  amount: number;
  description: string;
  label: string;
};

export type GiveSettings = {
  body: string;
  eyebrow: string;
  heading: string;
  locale: string;
  successMessage: string;
  tiers: GiveTier[];
};

export type GiveReport = {
  latestGiftAmountCents: number;
  latestGiftDate: string;
  latestGiftStatus: string;
  latestWooOrderId: number | null;
  locale: string;
  totalAmountCents: number;
  totalGifts: number;
  wooEnabled: boolean;
};
