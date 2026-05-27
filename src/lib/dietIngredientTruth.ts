import type { MetabolicProtocol } from "@/context/MetabolicContext";

export type TruthVerdict = "recommended" | "caution" | "avoid";

export type DietTruthResult = {
  verdict: TruthVerdict;
  headline: string;
  reasons: string[];
};

const PROTOCOL_RULES: Record<
  MetabolicProtocol,
  { avoid: RegExp[]; caution: RegExp[]; label: string }
> = {
  keto: {
    label: "Ketogenic",
    avoid: [
      /\bsugar\b/i,
      /\bglucose\b/i,
      /\bfructose\b/i,
      /\bsyrup\b/i,
      /\bwheat\b/i,
      /\bflour\b/i,
      /\brice\b/i,
      /\bpasta\b/i,
      /\bcorn\b/i,
      /\bmaltodextrin\b/i,
    ],
    caution: [/\bhoney\b/i, /\bstarch\b/i, /\bmilk\b/i, /\bskim\b/i],
  },
  vegan: {
    label: "Vegan",
    avoid: [
      /\bmilk\b/i,
      /\bcream\b/i,
      /\butter\b/i,
      /\bcheese\b/i,
      /\bwhey\b/i,
      /\begg\b/i,
      /\bgelatin\b/i,
      /\bhoney\b/i,
      /\bfish\b/i,
      /\bchicken\b/i,
      /\bbeef\b/i,
    ],
    caution: [/\blactic\b/i, /\bmono-?\s?diglycerides\b/i],
  },
  mediterranean: {
    label: "Mediterranean",
    avoid: [
      /\bpartially hydrogenated\b/i,
      /\bhigh fructose corn syrup\b/i,
      /\bhfcs\b/i,
      /\bsoybean oil\b/i,
      /\bcanola oil\b/i,
      /\bsunflower oil\b/i,
    ],
    caution: [/\bpalm oil\b/i, /\bsodium nitrite\b/i, /\bmsg\b/i],
  },
};

function normalizeIngredients(raw: string): string {
  return raw.replace(/\s+/g, " ").trim();
}

export function parseIngredientsFromPayload(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    const parsed = JSON.parse(trimmed) as { ingredients?: string[]; ingredients_text?: string };
    if (Array.isArray(parsed.ingredients) && parsed.ingredients.length > 0) {
      return parsed.ingredients.map((l) => String(l).trim()).filter(Boolean).join(", ");
    }
    if (typeof parsed.ingredients_text === "string" && parsed.ingredients_text.trim()) {
      return parsed.ingredients_text.trim();
    }
  } catch {
    if (trimmed.includes("\n")) {
      return trimmed
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .join(", ");
    }
    return trimmed;
  }
  return null;
}

export function evaluateIngredientsForProtocol(
  ingredientsText: string,
  protocol: MetabolicProtocol,
): DietTruthResult {
  const text = normalizeIngredients(ingredientsText);
  const rules = PROTOCOL_RULES[protocol];
  const reasons: string[] = [];

  for (const rx of rules.avoid) {
    if (rx.test(text)) {
      const match = text.match(rx);
      reasons.push(`Contains ${match?.[0] ?? "a restricted item"} — not aligned with ${rules.label} boundaries.`);
    }
  }
  if (reasons.length >= 2) {
    return {
      verdict: "avoid",
      headline: "Not recommended for your current plan.",
      reasons: reasons.slice(0, 4),
    };
  }
  if (reasons.length === 1) {
    return {
      verdict: "avoid",
      headline: "Not recommended for your current plan.",
      reasons,
    };
  }

  for (const rx of rules.caution) {
    if (rx.test(text)) {
      const match = text.match(rx);
      reasons.push(`Flagged: ${match?.[0] ?? "borderline ingredient"} — use sparingly or confirm preparation.`);
    }
  }
  if (reasons.length > 0) {
    return {
      verdict: "caution",
      headline: "Proceed with caution — review before consuming.",
      reasons,
    };
  }

  return {
    verdict: "recommended",
    headline: "Aligned with your plan — reasonable to consume as described.",
    reasons: ["No major conflicts detected against your active protocol rules."],
  };
}
