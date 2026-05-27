import type { MetabolicProtocol } from "@/context/MetabolicContext";

import { getPlanTargets, type PlanTargets } from "@/lib/dietGoals";

export type WellnessSnapshot = {
  steps: number;
  activeCalories: number;
  consumedCalories: number;
  restingBpm: number;
  /** 0–1 series for chart (last 24 points ~ hourly) */
  activitySeries: number[];
  source: "demo_api" | "device" | "fallback";
  updatedAt: string;
};

const DEMO_ENDPOINT =
  "https://jsonplaceholder.typicode.com/users/1"; /* lightweight public JSON; we map fields deterministically */

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

/** Build plausible demo metrics from protocol + time so the chart moves between sessions. */
export function buildDemoSnapshot(protocol: MetabolicProtocol, now = new Date()): WellnessSnapshot {
  const targets = getPlanTargets(protocol);
  const seed = hashString(`${protocol}-${now.toISOString().slice(0, 13)}`);
  const jitter = (n: number, range: number) => n + (seed % (range * 2 + 1)) - range;

  const steps = Math.min(
    targets.stepsGoal + 2500,
    Math.max(2000, jitter(targets.stepsGoal - 800, 1200)),
  );
  const activeCalories = Math.min(
    targets.activeCaloriesGoal + 120,
    Math.max(120, jitter(targets.activeCaloriesGoal - 40, 80)),
  );
  const consumedCalories = Math.min(
    targets.caloriesBudget + 400,
    Math.max(900, jitter(Math.floor(targets.caloriesBudget * 0.72), 250)),
  );
  const restingBpm = Math.min(
    targets.restingBpmTargetHigh + 8,
    Math.max(48, jitter(64, 6)),
  );

  const series: number[] = [];
  for (let i = 0; i < 24; i += 1) {
    const wave = Math.sin((i / 24) * Math.PI * 2) * 0.12;
    const noise = ((seed >> (i % 8)) % 17) / 170;
    const norm = 0.45 + wave + noise + (steps / targets.stepsGoal - 1) * 0.08;
    series.push(Math.min(1.15, Math.max(0.2, norm)));
  }

  return {
    steps,
    activeCalories,
    consumedCalories,
    restingBpm,
    activitySeries: series,
    source: "demo_api",
    updatedAt: now.toISOString(),
  };
}

/**
 * Try a minimal network fetch so "live API" path is real; on failure use deterministic demo data.
 */
export async function fetchWellnessSnapshot(protocol: MetabolicProtocol): Promise<WellnessSnapshot> {
  try {
    const res = await fetch(DEMO_ENDPOINT, { cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as { id?: number; name?: string };
    const base = buildDemoSnapshot(protocol);
    if (typeof data.id === "number") {
      return {
        ...base,
        steps: Math.min(
          getPlanTargets(protocol).stepsGoal + 2000,
          base.steps + (data.id % 400),
        ),
        source: "demo_api",
      };
    }
    return base;
  } catch {
    return { ...buildDemoSnapshot(protocol), source: "fallback" };
  }
}

export type MetricVsPlan = "below" | "in_range" | "above";

export function stepsVsPlan(steps: number, targets: PlanTargets): MetricVsPlan {
  if (steps < targets.stepsGoal * 0.85) return "below";
  if (steps > targets.stepsGoal * 1.08) return "above";
  return "in_range";
}

export function caloriesVsPlan(consumed: number, targets: PlanTargets): MetricVsPlan {
  if (consumed < targets.caloriesBudget * 0.75) return "below";
  if (consumed > targets.caloriesBudget) return "above";
  return "in_range";
}

export function bpmVsPlan(bpm: number, targets: PlanTargets): MetricVsPlan {
  if (bpm < targets.restingBpmTargetLow) return "below";
  if (bpm > targets.restingBpmTargetHigh) return "above";
  return "in_range";
}

export function aggregatePlanStatus(
  steps: MetricVsPlan,
  kcal: MetricVsPlan,
  bpm: MetricVsPlan,
): MetricVsPlan {
  const scores: number[] = [steps, kcal, bpm].map((s) =>
    s === "in_range" ? 0 : s === "below" ? -1 : 1,
  );
  const sum = scores.reduce((a, b) => a + b, 0);
  if (sum <= -1) return "below";
  if (sum >= 1) return "above";
  return "in_range";
}
