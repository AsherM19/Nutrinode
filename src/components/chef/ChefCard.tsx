"use client";

import { motion } from "framer-motion";
import { ChefHat, QrCode, ShieldCheck } from "lucide-react";

import { protocolLabel, useMetabolic } from "@/context/MetabolicContext";
import { getProtocolDetails } from "@/lib/protocolDetails";

function QrPlaceholder() {
  return (
    <div
      className="relative flex aspect-square w-full max-w-[140px] items-center justify-center rounded-2xl border border-nutri-slate-200/90 bg-white shadow-inner"
      aria-hidden
    >
      <div
        className="absolute inset-3 rounded-lg opacity-[0.18]"
        style={{
          backgroundImage: `
            linear-gradient(90deg, #0f172a 1px, transparent 1px),
            linear-gradient(#0f172a 1px, transparent 1px)
          `,
          backgroundSize: "8px 8px",
        }}
      />
      <QrCode className="relative z-10 h-10 w-10 text-nutri-slate-400" strokeWidth={1.25} />
    </div>
  );
}

export function ChefCard() {
  const { protocol } = useMetabolic();
  const detail = getProtocolDetails(protocol);

  return (
    <motion.article
      layout
      className="relative overflow-hidden rounded-3xl border border-nutri-slate-200/80 bg-gradient-to-br from-white via-white to-nutri-slate-50/70 shadow-luxury"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-nutri-slate-100/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-nutri-slate-200/50 blur-3xl" />

      <div className="relative grid gap-8 p-8 md:grid-cols-[1fr_auto] md:items-center md:gap-12">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-nutri-slate-300/90 bg-gradient-to-r from-white via-nutri-slate-50 to-nutri-slate-100/70 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-nutri-slate-700 shadow-[0_4px_16px_rgba(15,23,42,0.06)] ring-1 ring-white/80 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-nutri-slate-500/80 shadow-[0_0_0_3px_rgba(148,163,184,0.2)]" aria-hidden />
            <ChefHat className="h-3.5 w-3.5 text-nutri-slate-700" aria-hidden />
            Chef briefing
          </div>
          <h2 className="font-display text-3xl tracking-tight text-nutri-slate-900 md:text-4xl">
            {protocolLabel(protocol)}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-nutri-slate-600">
            {detail.headline}
          </p>

          <ul className="mt-6 space-y-3">
            {detail.restrictions.map((line) => (
              <li key={line} className="flex gap-3 text-sm text-nutri-slate-700">
                <ShieldCheck
                  className="mt-0.5 h-4 w-4 shrink-0 text-nutri-slate-600"
                  aria-hidden
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-xs leading-relaxed text-nutri-slate-500">
            {detail.chefNotes}
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 md:items-end">
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-nutri-slate-500 md:text-right">
            Staff scan
          </p>
          <QrPlaceholder />
          <p className="max-w-[200px] text-center text-[11px] text-nutri-slate-500 md:text-right">
            Placeholder QR encodes protocol + escalation contacts for the maître.
          </p>
        </div>
      </div>
    </motion.article>
  );
}
