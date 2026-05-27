type SwapDictionary = Record<string, string>;

const SWAP_DICTIONARY: SwapDictionary = {
  "white rice": "Cauliflower Rice",
  rice: "Cauliflower Rice",
  pasta: "Zucchini Noodles",
  "white pasta": "Chickpea Pasta",
  bread: "Seeded Almond-Flour Bread",
  "white bread": "Sprouted Grain Bread",
  sugar: "Monk Fruit or Date Paste",
  "table sugar": "Monk Fruit or Date Paste",
  soda: "Sparkling Water with Citrus",
  chips: "Oven-Roasted Kale Chips",
  fries: "Baked Celeriac Fries",
  mayo: "Greek Yogurt Herb Dressing",
  "heavy cream": "Cashew Cream",
  butter: "Extra-Virgin Olive Oil",
};

function normalizeIngredient(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Returns a NutriNode-style ingredient swap recommendation.
 */
export function getNutriNodeSwap(ingredient: string): string | null {
  const key = normalizeIngredient(ingredient);
  if (!key) return null;

  if (SWAP_DICTIONARY[key]) {
    return SWAP_DICTIONARY[key];
  }

  for (const [candidate, swap] of Object.entries(SWAP_DICTIONARY)) {
    if (key.includes(candidate) || candidate.includes(key)) {
      return swap;
    }
  }

  return "Try a whole-food alternative with higher fiber and lower glycemic load.";
}
