import type { MetabolicProtocol } from "@/context/MetabolicContext";

export type ProtocolDetail = {
  headline: string;
  restrictions: string[];
  chefNotes: string;
};

const DETAILS: Record<MetabolicProtocol, ProtocolDetail> = {
  keto: {
    headline: "Therapeutic ketosis — minimal glycemic load",
    restrictions: [
      "No refined sugars or high-glycemic starches",
      "Grains and legumes by exception only",
      "Prioritize MCT-friendly fats and omega-3 seafood",
    ],
    chefNotes:
      "Request sauces on the side; confirm no hidden sweeteners in glazes or reductions.",
  },
  vegan: {
    headline: "Plant-exclusive — no animal derivatives",
    restrictions: [
      "No dairy, eggs, honey, or animal fats",
      "Cross-contact alert for shellfish or bone broth kitchens",
      "Whole-food proteins: legumes, seeds, sprouted grains",
    ],
    chefNotes:
      "QR encodes your allergen matrix; kitchen may substitute nut milks or omit cheese finishes.",
  },
  mediterranean: {
    headline: "Olive oil, fish, legumes, and seasonal produce",
    restrictions: [
      "Limit ultra-processed oils; prefer EVOO",
      "Red meat occasional; emphasize fish and pulses",
      "Alcohol only if cleared by your care team",
    ],
    chefNotes:
      "Default plating: herbs, citrus, yogurt-tahini accents; bread optional.",
  },
};

export function getProtocolDetails(protocol: MetabolicProtocol): ProtocolDetail {
  return DETAILS[protocol];
}
