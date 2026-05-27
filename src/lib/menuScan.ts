import type { MetabolicProtocol } from "@/context/MetabolicContext";

export type MenuDish = {
  name: string;
  description?: string;
};

export type MenuScanResult = {
  ok: boolean;
  dishes: MenuDish[];
  safeToOrder: MenuDish[];
  askChefAbout: MenuDish[];
  chefScript: string;
};

const DEMO_MENU: MenuDish[] = [
  { name: "Herb-grilled sea bass", description: "Olive oil, seasonal greens, lemon" },
  { name: "Wild mushroom risotto", description: "Arborio rice, parmesan, white wine" },
  { name: "Charred broccoli with tahini", description: "Sesame, garlic, citrus" },
  { name: "Chocolate torte", description: "Flour, butter, dark chocolate" },
];

function dishRiskScore(dish: MenuDish, protocol: MetabolicProtocol): number {
  const blob = `${dish.name} ${dish.description ?? ""}`.toLowerCase();
  let score = 0;
  const bump = (patterns: RegExp[]) => {
    for (const p of patterns) if (p.test(blob)) score += 1;
  };

  if (protocol === "keto") {
    bump([/\brice\b/, /\bpasta\b/, /\bflour\b/, /\bsugar\b/, /\bchocolate\b/, /\bwine\b/]);
  } else   if (protocol === "vegan") {
    bump([/\bparmesan\b/, /\bcheese\b/, /\bbutter\b/, /\bsea bass\b/, /\bfish\b/, /\bbass\b/, /\bsalmon\b/]);
  } else {
    bump([/\bflour\b/, /\bfried\b/, /\bprocessed\b/]);
  }
  return score;
}

export function parseMenuPayload(raw: string): MenuDish[] | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    const parsed = JSON.parse(trimmed) as {
      type?: string;
      dishes?: Array<{ name?: string; description?: string }>;
    };
    if (parsed.type === "nutri-menu" && Array.isArray(parsed.dishes)) {
      const out: MenuDish[] = [];
      for (const d of parsed.dishes) {
        if (d?.name && String(d.name).trim()) {
          out.push({ name: String(d.name).trim(), description: d.description?.trim() });
        }
      }
      return out.length ? out : null;
    }
  } catch {
    return null;
  }
  return null;
}

export function analyzeMenuForProtocol(
  dishes: MenuDish[],
  protocol: MetabolicProtocol,
): MenuScanResult {
  const scored = dishes.map((d) => ({ dish: d, score: dishRiskScore(d, protocol) }));
  const safeToOrder = scored.filter((s) => s.score === 0).map((s) => s.dish);
  const askChefAbout = scored.filter((s) => s.score > 0).map((s) => s.dish);

  const safeNames = safeToOrder.map((d) => d.name).join(", ");
  const chefScript = [
    `Active plan: ${protocol}.`,
    safeNames
      ? `Please confirm preparation for: ${safeNames} — no cross-contact with off-plan oils or sweeteners.`
      : "No clearly safe dishes detected from this menu text — ask the kitchen for a protein-forward plate with olive oil and non-starchy vegetables.",
    askChefAbout.length
      ? `Dishes to clarify or modify: ${askChefAbout.map((d) => d.name).join(", ")}.`
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    ok: true,
    dishes,
    safeToOrder,
    askChefAbout,
    chefScript,
  };
}

export function getDemoMenuDishes(): MenuDish[] {
  return DEMO_MENU;
}
