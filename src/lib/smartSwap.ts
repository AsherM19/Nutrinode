import type { MetabolicProtocol } from "@/context/MetabolicContext";

type SwapTable = Record<string, string>;

const KETO_SWAPS: SwapTable = {
  rice: "Cauliflower Rice",
  pasta: "Zucchini Noodles",
  potato: "celeriac or turnip mash",
  bread: "almond-flour flatbread",
  sugar: "monk fruit or allulose",
  flour: "almond or coconut flour",
  milk: "unsweetened macadamia milk",
  beer: "dry sparkling wine (occasional)",
  default: "higher-fat, lower-carb whole-food alternative",
};

const VEGAN_SWAPS: SwapTable = {
  honey: "Agave",
  butter: "cultured plant butter or extra-virgin olive oil",
  cream: "cashew cream",
  egg: "chickpea flour batter or soft tofu",
  cheese: "aged cashew cheese",
  chicken: "grilled king oyster mushroom",
  beef: "lentil-walnut ragù",
  fish: "hearts of palm “crab” or marinated tofu",
  milk: "oat or soy barista milk",
  default: "plant-exclusive whole-food substitute",
};

const MEDITERRANEAN_SWAPS: SwapTable = {
  butter: "extra-virgin olive oil",
  cream: "yogurt-tahini sauce",
  beef: "lamb or legumes with herbs",
  pork: "grilled fish or chickpeas",
  sugar: "fruit compote with citrus zest",
  salt: "herbs, citrus, and capers",
  snack: "nuts, olives, and crudités",
  default: "olive oil, legumes, fish, and seasonal produce",
};

const TABLES: Record<MetabolicProtocol, SwapTable> = {
  keto: KETO_SWAPS,
  vegan: VEGAN_SWAPS,
  mediterranean: MEDITERRANEAN_SWAPS,
};

function normalizeIngredient(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Returns a metabolic alternative for a standard ingredient
 * based on the active nutritional protocol.
 */
export function smartSwap(
  standardIngredient: string,
  protocol: MetabolicProtocol,
): string {
  const key = normalizeIngredient(standardIngredient);
  const table = TABLES[protocol];
  const direct = table[key];
  if (direct) return direct;

  for (const [ingredient, alt] of Object.entries(table)) {
    if (ingredient === "default") continue;
    if (key.includes(ingredient) || ingredient.includes(key)) {
      return alt;
    }
  }

  return table.default ?? "seasonal whole-food alternative aligned with your protocol";
}
