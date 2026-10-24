import type { PillarKey } from "@/lib/methodology";

export type OwnershipKey = "STATE" | "PRIVATE" | "INTERNATIONAL_BRANCH";

export const OWNERSHIP_LABELS: Record<OwnershipKey, string> = {
  STATE: "Davlat",
  PRIVATE: "Xususiy",
  INTERNATIONAL_BRANCH: "Xorijiy filial",
};

export type ProfileKey =
  | "MULTIDISCIPLINARY"
  | "TECHNICAL"
  | "MEDICAL"
  | "PEDAGOGICAL"
  | "ECONOMICS_LAW"
  | "LANGUAGES"
  | "AGRICULTURE"
  | "ARTS_SPORT";

export const PROFILE_LABELS: Record<ProfileKey, string> = {
  MULTIDISCIPLINARY: "Klassik",
  TECHNICAL: "Texnika va IT",
  MEDICAL: "Tibbiyot",
  PEDAGOGICAL: "Pedagogika",
  ECONOMICS_LAW: "Iqtisodiyot va huquq",
  LANGUAGES: "Tillar",
  AGRICULTURE: "Agrar",
  ARTS_SPORT: "Sanʼat va sport",
};

/** Tailwind background class per pillar, shared by bars, dots and legends. */
export const PILLAR_BG: Record<PillarKey, string> = {
  teaching: "bg-firuza",
  research: "bg-lojuvard",
  outcomes: "bg-anor",
  voice: "bg-oltin",
  international: "bg-ink-faint",
};

export const STATUS_LABELS = {
  ranked: "",
  insufficient_data: "Maʼlumot yetarli emas",
  not_eligible: "Reytingda ishtirok etmaydi",
} as const;
