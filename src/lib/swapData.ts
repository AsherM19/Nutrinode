export const SMART_SWAP_DATA: Record<string, string> = {
  "white rice": "Cauliflower Rice",
  rice: "Cauliflower Rice",
  "flour tortilla": "Almond Flour Wrap",
  tortilla: "Cassava Tortilla",
  "vegetable oil": "Extra-Virgin Olive Oil",
  oil: "Avocado Oil",
  "white bread": "Sprouted Grain Bread",
  bread: "Seeded Whole-Grain Bread",
  sugar: "Monk Fruit Sweetener",
  soda: "Sparkling Water with Citrus",
  potato: "Roasted Cauliflower",
  pasta: "Zucchini Noodles",
};

function normalize(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, " ");
}

export function getSmartSwapSuggestion(ingredient: string): string | null {
  const key = normalize(ingredient);
  if (!key) return null;

  if (SMART_SWAP_DATA[key]) return SMART_SWAP_DATA[key];

  for (const [candidate, swap] of Object.entries(SMART_SWAP_DATA)) {
    if (key.includes(candidate) || candidate.includes(key)) {
      return swap;
    }
  }

  return "Try a minimally processed whole-food alternative with better metabolic profile.";
}
