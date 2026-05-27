"use client";

import Link from "next/link";

import type { MetabolicProtocol } from "@/context/MetabolicContext";
import { protocolLabel, useMetabolic } from "@/context/MetabolicContext";
import { MOCK_RESTAURANTS } from "@/lib/mockRestaurants";

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

function pickSpotlightRestaurant(protocol: MetabolicProtocol) {
  return MOCK_RESTAURANTS.find((r) => r.compatibleProtocols.includes(protocol)) ?? MOCK_RESTAURANTS[0];
}

function activityIdea(protocol: MetabolicProtocol): string {
  if (protocol === "keto") {
    return "20-minute brisk walk after your next meal to deepen fat oxidation without spiking glucose.";
  }
  if (protocol === "vegan") {
    return "Add a 15-minute mobility flow plus a legume-forward snack to protect protein intake today.";
  }
  return "30 minutes easy Zone-2 cycling or swimming supports Mediterranean lipid balance and recovery.";
}

export function ChefsBriefingCard() {
  const { protocol } = useMetabolic();
  const venue = pickSpotlightRestaurant(protocol);

  return (
    <div className="flex flex-1 flex-col rounded-[24px] border border-[#333333] bg-[#1a1a1a] p-scale-7 shadow-float">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-900/30 text-[#059669] [&_.material-symbols-outlined]:text-sm">
          <MsIcon name="campaign" />
        </div>
        <h3 className="font-body-bold text-body-bold text-gray-100">NutriNode Briefing</h3>
        <span className="ml-auto h-2 w-2 rounded-full bg-[#059669]" aria-hidden />
      </div>
      <p className="mb-3 flex-1 font-body-base text-body-base text-gray-400">
        Your active plan is <span className="font-semibold text-gray-200">{protocolLabel(protocol)}</span>. Stay
        inside today&apos;s telemetry band — consistency beats intensity for this window.
      </p>
      <ul className="mb-4 space-y-2 text-sm text-gray-300">
        <li className="flex gap-2">
          <MsIcon name="directions_run" className="mt-0.5 text-primary" />
          <span>
            <span className="font-semibold text-gray-200">Move:</span> {activityIdea(protocol)}
          </span>
        </li>
        <li className="flex gap-2">
          <MsIcon name="restaurant" className="mt-0.5 text-primary" />
          <span>
            <span className="font-semibold text-gray-200">Fuel:</span> Book{" "}
            <span className="text-gray-100">{venue.name}</span> on the Metabolic Map — {venue.metabolicTip}
          </span>
        </li>
      </ul>
      <Link
        href="/map"
        className="flex w-full items-center justify-center gap-2 rounded-full border border-[#333333] bg-[#2a2a2a] py-3 font-body-bold text-body-bold text-gray-200 transition-colors hover:bg-[#333333]"
      >
        Open Metabolic Map
        <MsIcon name="arrow_forward" className="text-sm" />
      </Link>
    </div>
  );
}
