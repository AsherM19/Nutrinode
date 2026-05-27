"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

import { protocolLabel, useMetabolic } from "@/context/MetabolicContext";
import {
  evaluateIngredientsForProtocol,
  parseIngredientsFromPayload,
  type DietTruthResult,
} from "@/lib/dietIngredientTruth";

function MsIcon({ name, className }: { name: string; className?: string }) {
  return (
    <span
      className={["material-symbols-outlined shrink-0 leading-none", className].filter(Boolean).join(" ")}
      aria-hidden
    >
      {name}
    </span>
  );
}

export function BarcodeDietTruthPanel() {
  const { protocol } = useMetabolic();
  const [truth, setTruth] = useState<DietTruthResult | null>(null);
  const [productName, setProductName] = useState<string | null>(null);
  const [scanKey, setScanKey] = useState(0);
  const prevProtocol = useRef<typeof protocol | null>(null);

  useEffect(() => {
    if (prevProtocol.current === null) {
      prevProtocol.current = protocol;
      return;
    }
    if (prevProtocol.current === protocol) return;
    prevProtocol.current = protocol;
    setTruth(null);
    setProductName(null);
    setScanKey((k) => k + 1);
  }, [protocol]);

  useEffect(() => {
    if (truth) return;

    const scanner = new Html5QrcodeScanner(`diet-truth-reader-${scanKey}`, { fps: 10, qrbox: 250 }, false);

    scanner.render(
      async (decodedText) => {
        await scanner.clear();
        const parsed = parseIngredientsFromPayload(decodedText);
        if (parsed) {
          setProductName(null);
          setTruth(evaluateIngredientsForProtocol(parsed, protocol));
          return;
        }

        const trimmed = decodedText.trim();
        if (/^\d{8,14}$/.test(trimmed)) {
          try {
            const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${trimmed}.json`);
            const data = await res.json();
            if (data.status === 1 && data.product) {
              const ing =
                (data.product.ingredients_text as string | undefined) ||
                (data.product.ingredients_text_with_allergens as string | undefined) ||
                "";
              setProductName((data.product.product_name as string) ?? "Scanned product");
              setTruth(evaluateIngredientsForProtocol(ing || "Unknown ingredients", protocol));
              return;
            }
          } catch {
            /* fall through */
          }
        }

        setProductName(null);
        setTruth({
          verdict: "caution",
          headline: "Could not read an ingredient list from this code.",
          reasons: [
            "Use a barcode listed in Open Food Facts, or a QR/JSON payload with `ingredients` (array of lines) or `ingredients_text`.",
          ],
        });
      },
      () => {},
    );

    return () => {
      void scanner.clear();
    };
  }, [protocol, truth, scanKey]);

  const verdictStyles =
    truth?.verdict === "recommended"
      ? "border-emerald-800/40 bg-emerald-950/30 text-emerald-200"
      : truth?.verdict === "caution"
        ? "border-amber-800/40 bg-amber-950/25 text-amber-100"
        : truth
          ? "border-rose-900/40 bg-rose-950/30 text-rose-100"
          : "border-[#333333] bg-[#222222]/40 text-gray-300";

  return (
    <motion.section
      layout
      className="relative flex flex-col overflow-hidden rounded-[24px] border border-[#333333] bg-[#1a1a1a] shadow-float md:flex-row"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="z-10 flex flex-col justify-center p-scale-7 md:w-1/2">
        <div className="mb-4 inline-flex w-max items-center gap-1.5 rounded-full border border-blue-800/50 bg-blue-900/30 px-3 py-1.5 font-label-sm text-label-sm text-blue-400">
          <MsIcon name="qr_code_scanner" className="text-[14px]" />
          Plan truth scan
        </div>
        <h3 className="mb-2 font-headline-md text-headline-md text-gray-100">Scan a product</h3>
        <p className="mb-4 font-body-base text-body-base text-gray-400">
          Barcode or ingredient QR is checked against your active {protocolLabel(protocol)} plan — recommendations
          only.
        </p>

        {!truth ? (
          <div id={`diet-truth-reader-${scanKey}`} className="overflow-hidden rounded-xl border border-[#333333]" />
        ) : (
          <div className="space-y-4">
            {productName ? (
              <p className="font-body-bold text-body-bold text-gray-200">{productName}</p>
            ) : null}
            <div className={`rounded-xl border px-4 py-3 ${verdictStyles}`}>
              <p className="font-body-bold text-body-bold">{truth.headline}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 font-body-base text-body-base text-gray-300">
                {truth.reasons.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              onClick={() => {
                setTruth(null);
                setProductName(null);
                setScanKey((k) => k + 1);
              }}
              className="w-max rounded-full bg-[#059669] px-6 py-3 font-body-bold text-body-bold text-white shadow-sm transition-colors hover:bg-emerald-600"
            >
              Scan another item
            </button>
          </div>
        )}
      </div>

      <div className="relative flex min-h-[240px] items-center justify-center border-t border-[#333333] bg-gradient-to-br from-[#111111] to-[#1a1a1a] p-8 md:w-1/2 md:border-l md:border-t-0">
        <div className="relative flex aspect-[4/3] w-full max-w-[280px] items-center justify-center">
          <div className="absolute right-8 z-20 flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#333333] bg-[#222222] shadow-lg">
            <MsIcon name="verified" className="text-4xl text-[#059669]" />
          </div>
          <div className="absolute left-8 z-10 flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#333333] bg-[#2a2a2a] opacity-60 shadow-md">
            <MsIcon name="nutrition" className="text-3xl text-gray-500" />
          </div>
          <div className="absolute left-1/2 top-1/2 z-30 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2">
            <span className="flex items-center justify-center rounded-full border border-[#333333] bg-[#222222] p-1 shadow-sm">
              <MsIcon name="arrow_forward" className="text-xl text-gray-300" />
            </span>
          </div>
        </div>
        <AnimatePresence>
          {truth ? (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-4 right-4 text-center text-xs text-gray-500 md:left-8 md:right-8"
            >
              Verdict: <span className="font-semibold text-gray-300">{truth.verdict}</span>
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
