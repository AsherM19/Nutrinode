import type { MetabolicProtocol } from "@/context/MetabolicContext";

export type MockRestaurant = {
  id: string;
  name: string;
  neighborhood: string;
  lat: number;
  lng: number;
  region: "lisbon" | "algarve";
  /** Protocols this venue can accommodate — map shows only exact matches to active protocol */
  compatibleProtocols: MetabolicProtocol[];
  cuisine: string;
  /** Concierge-facing note for popup */
  metabolicTip: string;
};

export const MOCK_RESTAURANTS: MockRestaurant[] = [
  {
    id: "1",
    name: "Cais Verde",
    neighborhood: "Cais do Sodré",
    lat: 38.7056,
    lng: -9.144,
    region: "lisbon",
    compatibleProtocols: ["vegan", "mediterranean"],
    cuisine: "Atlantic vegetable tasting",
    metabolicTip: "Tasting menu can be fully plant-exclusive; ask for nut-free pastry if needed.",
  },
  {
    id: "2",
    name: "Olivar Alta",
    neighborhood: "Príncipe Real",
    lat: 38.7162,
    lng: -9.1521,
    region: "lisbon",
    compatibleProtocols: ["mediterranean", "keto"],
    cuisine: "Iberian coastal",
    metabolicTip: "Offers almond-flour pizza crust and olive-oil–based sauces on request.",
  },
  {
    id: "3",
    name: "Nódoa Keto Lab",
    neighborhood: "Chiado",
    lat: 38.7109,
    lng: -9.1426,
    region: "lisbon",
    compatibleProtocols: ["keto"],
    cuisine: "Low-carb chef’s table",
    metabolicTip: "Chef’s table is glucose-conscious by design; no hidden starches in reductions.",
  },
  {
    id: "4",
    name: "Ribeira Slate",
    neighborhood: "Alfama",
    lat: 38.7125,
    lng: -9.1302,
    region: "lisbon",
    compatibleProtocols: ["mediterranean", "vegan", "keto"],
    cuisine: "Fire + olive oil",
    metabolicTip: "Will split plating: keto proteins, vegan sides, and EVOO-forward finishes.",
  },
  {
    id: "5",
    name: "Jardim 38",
    neighborhood: "Avenidas Novas",
    lat: 38.7331,
    lng: -9.1544,
    region: "lisbon",
    compatibleProtocols: ["vegan"],
    cuisine: "Garden tasting menu",
    metabolicTip: "Honey is omitted across the menu; desserts use fruit reductions only.",
  },
  {
    id: "6",
    name: "Maré Algarvia",
    neighborhood: "Lagos",
    lat: 37.102,
    lng: -8.674,
    region: "algarve",
    compatibleProtocols: ["mediterranean", "keto"],
    cuisine: "Grilled catch + greens",
    metabolicTip: "Grilled fish with herb butter can be swapped for EVOO; sides are low-glycemic.",
  },
  {
    id: "7",
    name: "Citrino Faro",
    neighborhood: "Faro centro",
    lat: 37.0194,
    lng: -7.9322,
    region: "algarve",
    compatibleProtocols: ["mediterranean", "vegan"],
    cuisine: "Citrus grove kitchen",
    metabolicTip: "Legume-forward mezze; kitchen avoids cross-contact with shellfish on prep.",
  },
  {
    id: "8",
    name: "Cliff House Table",
    neighborhood: "Carvoeiro",
    lat: 37.0936,
    lng: -8.4722,
    region: "algarve",
    compatibleProtocols: ["keto", "mediterranean"],
    cuisine: "Clifftop tasting",
    metabolicTip: "Tasting track can be tightened to under 20g carbs with 24h notice.",
  },
];

/**
 * Venues must explicitly list the active protocol (e.g. Keto → only rows where compatibleProtocols includes "keto").
 */
export function filterRestaurantsByProtocol(
  list: MockRestaurant[],
  protocol: MetabolicProtocol,
): MockRestaurant[] {
  return list.filter((r) => r.compatibleProtocols.includes(protocol));
}
