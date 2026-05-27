"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { protocolLabel, useMetabolic } from "@/context/MetabolicContext";
import {
  aggregatePlanStatus,
  bpmVsPlan,
  buildDemoSnapshot,
  caloriesVsPlan,
  fetchWellnessSnapshot,
  stepsVsPlan,
  type WellnessSnapshot,
} from "@/lib/wellnessTelemetry";
import { getPlanTargets, type PlanTargets } from "@/lib/dietGoals";

const DEVICE_KEY = "nutri-node:smart-device-linked";

function statusLabel(s: ReturnType<typeof aggregatePlanStatus>): string {
  if (s === "below") return "Below plan targets";
  if (s === "above") return "Above plan targets";
  return "Within plan band";
}

function pathFromSeries(series: number[]): { d: string; lastX: number; lastY: number } {
  if (!series.length) return { d: "", lastX: 950, lastY: 70 };
  const n = series.length;
  let lastX = 0;
  let lastY = 0;
  const pts = series.map((v, i) => {
    const x = (i / Math.max(1, n - 1)) * 1000;
    const clamped = Math.min(1.1, Math.max(0.25, v));
    const y = 200 - clamped * 130 - 20;
    lastX = x;
    lastY = y;
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return { d: pts.join(" "), lastX, lastY };
}

export function MetabolicTelemetryCard() {
  const { protocol } = useMetabolic();
  const [data, setData] = useState<WellnessSnapshot | null>(null);
  const [deviceLinked, setDeviceLinked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setDeviceLinked(window.localStorage.getItem(DEVICE_KEY) === "1");
    } catch {
      setDeviceLinked(false);
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const snap = deviceLinked
        ? { ...buildDemoSnapshot(protocol), source: "device" as const }
        : await fetchWellnessSnapshot(protocol);
      setData(snap);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load telemetry");
      setData(buildDemoSnapshot(protocol));
    } finally {
      setLoading(false);
    }
  }, [deviceLinked, protocol]);

  useEffect(() => {
    void load();
  }, [load]);

  const targets: PlanTargets = useMemo(() => getPlanTargets(protocol), [protocol]);

  const stepsStatus = data ? stepsVsPlan(data.steps, targets) : "in_range";
  const kcalStatus = data ? caloriesVsPlan(data.consumedCalories, targets) : "in_range";
  const bpmStatus = data ? bpmVsPlan(data.restingBpm, targets) : "in_range";
  const overall = aggregatePlanStatus(stepsStatus, kcalStatus, bpmStatus);

  const lineColor =
    overall === "in_range" ? "#10b981" : overall === "below" ? "#38bdf8" : "#fb7185";

  const pathInfo = data ? pathFromSeries(data.activitySeries) : null;

  const toggleDevice = () => {
    const next = !deviceLinked;
    setDeviceLinked(next);
    try {
      window.localStorage.setItem(DEVICE_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
    void load();
  };

  return (
    <div className="relative flex flex-col overflow-hidden rounded-[24px] border border-[#333333] bg-[#1a1a1a] p-scale-7 shadow-float lg:col-span-8">
      <div className="z-10 mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="mb-1 font-headline-md text-headline-md text-gray-100">Metabolic Telemetry</h2>
          <p className="font-label-sm text-label-sm text-gray-400">
            Live activity, energy, and heart rate vs your {protocolLabel(protocol)} targets
          </p>
          {error ? <p className="mt-1 text-xs text-amber-400">{error}</p> : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 rounded-full border border-emerald-800/50 bg-emerald-900/40 px-3 py-1 font-label-sm text-label-sm text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
            {loading ? "Syncing…" : data?.source === "device" ? "Device" : "Live"}
          </span>
          <button
            type="button"
            onClick={toggleDevice}
            className={[
              "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
              deviceLinked
                ? "border-primary/50 bg-primary/15 text-primary"
                : "border-[#333333] bg-[#222222]/60 text-gray-300 hover:text-gray-100",
            ].join(" ")}
          >
            {deviceLinked ? "Smart device: on" : "Connect smart device"}
          </button>
          <button
            type="button"
            onClick={() => void load()}
            className="rounded-full border border-[#333333] bg-[#222222]/60 px-3 py-1 text-xs font-semibold text-gray-300 hover:text-gray-100"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="z-10 mb-2 flex flex-wrap gap-x-8 gap-y-4">
        <div>
          <p className="mb-1 font-label-sm text-label-sm text-gray-400">STEPS</p>
          <div className="flex items-baseline gap-1">
            <span className="font-headline-md text-display-lg text-gray-100">
              {data ? data.steps.toLocaleString() : "—"}
            </span>
            <span className="font-label-sm text-label-sm text-gray-400">
              / {targets.stepsGoal.toLocaleString()} goal
            </span>
          </div>
          <p
            className={[
              "mt-1 text-[11px] font-semibold uppercase tracking-wide",
              stepsStatus === "in_range" ? "text-emerald-400" : stepsStatus === "below" ? "text-sky-400" : "text-rose-400",
            ].join(" ")}
          >
            {stepsStatus === "in_range" ? "On track" : stepsStatus === "below" ? "Below goal" : "Above typical"}
          </p>
        </div>
        <div className="hidden h-12 w-px self-center bg-[#333333] sm:block" aria-hidden />
        <div>
          <p className="mb-1 font-label-sm text-label-sm text-gray-400">CONSUMED KCAL</p>
          <div className="flex items-baseline gap-1">
            <span className="font-headline-md text-display-lg text-gray-100">
              {data ? data.consumedCalories.toLocaleString() : "—"}
            </span>
            <span className="font-label-sm text-label-sm text-gray-400">
              / {targets.caloriesBudget.toLocaleString()} day
            </span>
          </div>
          <p
            className={[
              "mt-1 text-[11px] font-semibold uppercase tracking-wide",
              kcalStatus === "in_range" ? "text-emerald-400" : kcalStatus === "below" ? "text-sky-400" : "text-rose-400",
            ].join(" ")}
          >
            {kcalStatus === "in_range" ? "Within budget" : kcalStatus === "below" ? "Under budget" : "Over budget"}
          </p>
        </div>
        <div className="hidden h-12 w-px self-center bg-[#333333] sm:block" aria-hidden />
        <div>
          <p className="mb-1 font-label-sm text-label-sm text-gray-400">ACTIVE KCAL</p>
          <div className="flex items-baseline gap-1">
            <span className="font-headline-md text-display-lg text-gray-100">
              {data ? data.activeCalories.toLocaleString() : "—"}
            </span>
            <span className="font-label-sm text-label-sm text-gray-400">burn</span>
          </div>
        </div>
        <div className="hidden h-12 w-px self-center bg-[#333333] sm:block" aria-hidden />
        <div>
          <p className="mb-1 font-label-sm text-label-sm text-gray-400">RESTING BPM</p>
          <div className="flex items-baseline gap-1">
            <span className="font-headline-md text-display-lg text-gray-100">{data ? data.restingBpm : "—"}</span>
            <span className="font-label-sm text-label-sm text-gray-400">
              target {targets.restingBpmTargetLow}–{targets.restingBpmTargetHigh}
            </span>
          </div>
          <p
            className={[
              "mt-1 text-[11px] font-semibold uppercase tracking-wide",
              bpmStatus === "in_range" ? "text-emerald-400" : bpmStatus === "below" ? "text-sky-400" : "text-rose-400",
            ].join(" ")}
          >
            {bpmStatus === "in_range" ? "Steady" : bpmStatus === "below" ? "Low vs band" : "Elevated vs band"}
          </p>
        </div>
      </div>

      <p className="z-10 mb-4 text-xs text-gray-500">
        Plan signal: <span className="font-semibold text-gray-300">{statusLabel(overall)}</span>
        {data ? <span className="text-gray-600"> · updated {new Date(data.updatedAt).toLocaleTimeString()}</span> : null}
      </p>

      <div className="relative min-h-[200px] flex-1 overflow-hidden rounded-xl border border-[#333333] bg-[#222222]/50">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `linear-gradient(to right, #333333 1px, transparent 1px), linear-gradient(to bottom, #333333 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
          aria-hidden
        />
        <div className="absolute bottom-0 left-2 top-0 flex flex-col justify-between py-4 font-label-sm text-[10px] text-gray-400 opacity-60">
          <span>high</span>
          <span>goal</span>
          <span>low</span>
        </div>
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1000 200"
          preserveAspectRatio="none"
          aria-hidden
        >
          <rect fill="#10b981" fillOpacity={overall === "in_range" ? 0.08 : 0.04} height="100" width="1000" x="0" y="50" />
          <line opacity="0.3" stroke="#10b981" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="1000" y1="50" y2="50" />
          <line
            opacity="0.3"
            stroke="#10b981"
            strokeDasharray="4 4"
            strokeWidth="1"
            x1="0"
            x2="1000"
            y1="150"
            y2="150"
          />
          {pathInfo?.d ? (
            <path d={pathInfo.d} fill="none" stroke={lineColor} strokeWidth="2.5" />
          ) : (
            <path
              d="M0,120 C100,120 150,110 200,80 C250,50 300,60 350,90 C400,120 450,130 500,110 C550,90 600,80 650,90 C700,100 750,120 800,110 C850,100 900,80 950,70 L1000,65"
              fill="none"
              stroke={lineColor}
              strokeWidth="2.5"
            />
          )}
          <circle
            cx={pathInfo ? pathInfo.lastX : 950}
            cy={pathInfo ? pathInfo.lastY : 70}
            fill="#1a1a1a"
            r="4"
            stroke={lineColor}
            strokeWidth="2"
          />
          <line
            opacity="0.5"
            stroke={lineColor}
            strokeDasharray="2 2"
            strokeWidth="1"
            x1={pathInfo ? pathInfo.lastX : 950}
            x2={pathInfo ? pathInfo.lastX : 950}
            y1="0"
            y2="200"
          />
        </svg>
      </div>
    </div>
  );
}
