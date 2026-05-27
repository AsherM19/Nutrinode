import type { MetabolicProtocol } from "@/context/MetabolicContext";

export type MetabolicProfile = {
  metabolicId: string;
  memberName: string;
  protocol: MetabolicProtocol;
  avoidedIngredients: string[];
  chefInstruction: string;
};

export const METABOLIC_PROFILES: Record<string, MetabolicProfile> = {
  "NN-1042-KETO": {
    metabolicId: "NN-1042-KETO",
    memberName: "Luca Mendes",
    protocol: "keto",
    avoidedIngredients: ["Rice", "Sugar", "Flour Tortilla"],
    chefInstruction:
      "No hidden starches. Keep sauces unsweetened and plate with non-starchy vegetables only.",
  },
  "NN-2011-VEGAN": {
    metabolicId: "NN-2011-VEGAN",
    memberName: "Amara Silva",
    protocol: "vegan",
    avoidedIngredients: ["Dairy", "Egg", "Honey"],
    chefInstruction:
      "Strict plant-exclusive prep. Use separate utensils and confirm no butter in finishing steps.",
  },
  "NN-3304-MED": {
    metabolicId: "NN-3304-MED",
    memberName: "Rafael Costa",
    protocol: "mediterranean",
    avoidedIngredients: ["Seed oils", "Processed sauces", "Excess sodium"],
    chefInstruction:
      "Use EVOO-forward cooking, legumes/fish priority, and citrus-herb seasoning.",
  },
};

export function lookupMetabolicProfile(rawId: string): MetabolicProfile | null {
  const normalized = rawId.trim().toUpperCase();
  if (!normalized) return null;
  return METABOLIC_PROFILES[normalized] ?? null;
}
