export type SiteSearchItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  /** extra tokens for matching */
  keywords: string[];
};

export const SITE_SEARCH_INDEX: SiteSearchItem[] = [
  {
    id: "dash",
    title: "Dashboard",
    description: "Telemetry, briefing, and product truth scan",
    href: "/",
    keywords: ["home", "telemetry", "wellness", "steps", "calories", "bpm"],
  },
  {
    id: "map",
    title: "Metabolic Map",
    description: "Verified kitchens and protocol-friendly venues",
    href: "/map",
    keywords: ["restaurants", "lisbon", "algarve", "venues", "location"],
  },
  {
    id: "menu",
    title: "Intelligent Menu",
    description: "Scan a menu QR to see safe dishes and chef talking points",
    href: "/staff/scan",
    keywords: ["camera", "scan", "menu", "chef", "staff"],
  },
  {
    id: "lab",
    title: "Protocol Lab",
    description: "Protocol boundaries and milestones",
    href: "/protocol-lab",
    keywords: ["protocol", "keto", "vegan", "mediterranean", "boundaries"],
  },
  {
    id: "settings",
    title: "Settings",
    description: "Help and sign out",
    href: "/settings",
    keywords: ["account", "logout", "help", "guide"],
  },
  {
    id: "login",
    title: "Login",
    description: "Sign in to NutriNode",
    href: "/login",
    keywords: ["google", "auth"],
  },
];

export function filterSiteSearch(query: string, limit = 8): SiteSearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return SITE_SEARCH_INDEX.filter((item) => {
    const hay = [item.title, item.description, ...item.keywords].join(" ").toLowerCase();
    return hay.includes(q);
  }).slice(0, limit);
}
