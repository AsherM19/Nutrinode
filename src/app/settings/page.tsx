"use client";

import { MsIcon } from "@/components/ui/MsIcon";

export default function SettingsPage() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="mx-auto max-w-2xl space-y-scale-7 p-page-margin">
      <h1 className="font-headline-md text-display-lg text-on-surface">Settings</h1>

      <section className="overflow-hidden rounded-[24px] border border-outline-variant bg-surface-container">
        <div className="border-b border-outline-variant p-6">
          <div className="flex items-center gap-3 text-on-surface">
            <MsIcon name="help" />
            <span className="font-semibold">How to use NutriNode</span>
          </div>
          <ul className="mt-4 space-y-3 text-sm text-on-surface-variant">
            <li>
              <span className="font-semibold text-on-surface">Dashboard</span> — Live wearable-style metrics vs your
              protocol targets; connect a smart device when you are ready for phone data (steps, calories, BPM).
            </li>
            <li>
              <span className="font-semibold text-on-surface">Plan truth scan</span> — Scan a product barcode or an
              ingredient QR; you get a recommendation aligned with your active protocol (no medical claims).
            </li>
            <li>
              <span className="font-semibold text-on-surface">Intelligent Menu</span> — Scan a venue menu QR to see
              dishes that fit your plan and a short script to give the chef.
            </li>
            <li>
              <span className="font-semibold text-on-surface">Metabolic Map</span> — Find protocol-friendly kitchens;
              briefings link you here for goal-aligned meals.
            </li>
            <li>
              <span className="font-semibold text-on-surface">Protocol Lab</span> — Review boundaries for your current
              metabolic window.
            </li>
            <li>
              <span className="font-semibold text-on-surface">Search</span> — Use the header search to jump to any major
              area of the app.
            </li>
          </ul>
        </div>

        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <MsIcon name="logout" className="text-error" />
            <span className="text-error">Account</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-on-surface-variant transition-colors hover:text-error"
          >
            Sign Out
          </button>
        </div>
      </section>
    </div>
  );
}
