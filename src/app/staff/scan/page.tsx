"use client";

import { motion } from "framer-motion";
import { ScanLine } from "lucide-react";
import { useEffect, useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

import { protocolLabel, useMetabolic } from "@/context/MetabolicContext";
import type { MenuDish } from "@/lib/menuScan";
import {
  analyzeMenuForProtocol,
  getDemoMenuDishes,
  parseMenuPayload,
  type MenuScanResult,
} from "@/lib/menuScan";

const DEMO_MENU_QR = `{"type":"nutri-menu","dishes":[{"name":"Herb-grilled sea bass","description":"Olive oil, greens"},{"name":"Wild mushroom risotto","description":"Rice, parmesan"},{"name":"Charred broccoli with tahini","description":"Sesame, citrus"},{"name":"Chocolate torte","description":"Flour, butter"}]}`;

export default function IntelligentMenuPage() {
  const { protocol } = useMetabolic();
  const [menuDishes, setMenuDishes] = useState<MenuDish[] | null>(null);
  const [menuResult, setMenuResult] = useState<MenuScanResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [manualJson, setManualJson] = useState("");

  useEffect(() => {
    if (menuDishes?.length) {
      setMenuResult(analyzeMenuForProtocol(menuDishes, protocol));
    }
  }, [protocol, menuDishes]);

  const resolveMenu = (raw: string) => {
    setLastScanned(raw);
    let dishes = parseMenuPayload(raw);
    if (!dishes) {
      try {
        const parsed = JSON.parse(raw) as { dishes?: Array<{ name?: string; description?: string }> };
        if (Array.isArray(parsed.dishes)) {
          dishes = parsed.dishes
            .filter((d) => d?.name)
            .map((d) => ({ name: String(d.name).trim(), description: d.description?.trim() }));
        }
      } catch {
        dishes = null;
      }
    }
    if (!dishes?.length) {
      setMenuDishes(null);
      setMenuResult(null);
      setErrorMessage(
        "Not a menu QR. Use JSON with type \"nutri-menu\" and a dishes array, or paste the demo payload below.",
      );
      return;
    }
    setErrorMessage(null);
    setMenuDishes(dishes);
    setMenuResult(analyzeMenuForProtocol(dishes, protocol));
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-nutri-slate-500">Staff console</p>
        <h1 className="font-[var(--font-manrope)] text-4xl tracking-tight text-nutri-slate-900 sm:text-5xl">
          Intelligent Menu
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-nutri-slate-600">
          Scan a venue menu QR (ingredient-by-ingredient or dish list). We show what you can order on your{" "}
          <span className="font-medium text-nutri-slate-800">{protocolLabel(protocol)}</span> plan and what to tell the
          chef.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <section className="rounded-3xl border border-nutri-slate-200/80 bg-white p-5 shadow-luxury sm:p-6">
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-nutri-slate-500">
            <ScanLine className="h-4 w-4 text-nutri-emerald-deep" aria-hidden />
            Menu scanner
          </div>
          <div className="overflow-hidden rounded-2xl border border-nutri-slate-200/90">
            <Scanner
              constraints={{ facingMode: "environment" }}
              scanDelay={450}
              onError={() => setErrorMessage("Camera access denied or unavailable on this device.")}
              onScan={(codes) => {
                const rawValue = codes[0]?.rawValue;
                if (!rawValue) return;
                resolveMenu(rawValue);
              }}
            />
          </div>

          <div className="mt-4 rounded-2xl border border-nutri-slate-200/90 bg-nutri-slate-50/50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-nutri-slate-500">
              Paste menu JSON (optional)
            </p>
            <textarea
              value={manualJson}
              onChange={(e) => setManualJson(e.target.value)}
              rows={4}
              placeholder={DEMO_MENU_QR.slice(0, 80) + "…"}
              className="mt-2 w-full rounded-xl border border-nutri-slate-200 bg-white px-3 py-2 font-mono text-xs text-nutri-slate-900 outline-none ring-nutri-slate-300/60 focus:border-nutri-slate-300 focus:ring-2"
              aria-label="Menu JSON"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => resolveMenu(manualJson)}
                className="rounded-xl bg-nutri-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-nutri-slate-800"
              >
                Parse pasted menu
              </button>
              <button
                type="button"
                onClick={() => {
                  setManualJson(DEMO_MENU_QR);
                  resolveMenu(DEMO_MENU_QR);
                }}
                className="rounded-xl border border-nutri-slate-300 bg-white px-4 py-2 text-sm font-medium text-nutri-slate-800 transition-colors hover:bg-nutri-slate-50"
              >
                Load demo menu
              </button>
            </div>
          </div>

          <p className="mt-3 text-xs text-nutri-slate-500">
            Expected shape:{" "}
            <span className="font-mono">
              {`{ "type": "nutri-menu", "dishes": [{ "name": "...", "description": "..." }] }`}
            </span>
          </p>
          {lastScanned ? (
            <p className="mt-1 truncate text-xs text-nutri-slate-500">
              Last scan: <span className="font-mono">{lastScanned.slice(0, 120)}</span>
              {lastScanned.length > 120 ? "…" : ""}
            </p>
          ) : null}
          {errorMessage ? <p className="mt-2 text-xs text-rose-600">{errorMessage}</p> : null}
        </section>

        {menuResult ? (
          <motion.aside
            key={menuResult.chefScript}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl border border-[#333333] bg-[#1a1a1a] p-6 shadow-card"
          >
            <p className="inline-flex items-center gap-2 rounded-full border border-[#333333] bg-[#222222] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-300">
              Menu insight · {protocolLabel(protocol)}
            </p>

            <div className="mt-5 space-y-5">
              <div>
                <p className="font-[var(--font-manrope)] text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                  Dishes you can lean on
                </p>
                {menuResult.safeToOrder.length ? (
                  <ul className="mt-2 space-y-2">
                    {menuResult.safeToOrder.map((d) => (
                      <li key={d.name} className="text-sm text-gray-200">
                        <span className="font-medium text-[#68dba9]">{d.name}</span>
                        {d.description ? (
                          <span className="text-gray-500"> — {d.description}</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-gray-400">No clearly aligned dishes — ask the kitchen for modifications.</p>
                )}
              </div>

              <div>
                <p className="font-[var(--font-manrope)] text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                  Ask the chef about
                </p>
                {menuResult.askChefAbout.length ? (
                  <ul className="mt-2 space-y-2">
                    {menuResult.askChefAbout.map((d) => (
                      <li key={d.name} className="text-sm text-gray-200">
                        {d.name}
                        {d.description ? (
                          <span className="text-gray-500"> — {d.description}</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-gray-400">Nothing flagged — still confirm oils and sweeteners.</p>
                )}
              </div>

              <div className="rounded-2xl border border-[#333333] bg-[#151515] p-4">
                <p className="font-[var(--font-manrope)] text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                  What to tell the chef
                </p>
                <p className="mt-2 text-sm leading-relaxed text-gray-200">{menuResult.chefScript}</p>
              </div>
            </div>
          </motion.aside>
        ) : (
          <aside className="rounded-3xl border border-nutri-slate-200/90 bg-white p-6 shadow-card">
            <p className="text-sm text-nutri-slate-600">
              Scan a menu QR or tap <strong>Load demo menu</strong> to preview dish filtering and chef talking points.
            </p>
          </aside>
        )}
      </div>
    </div>
  );
}
