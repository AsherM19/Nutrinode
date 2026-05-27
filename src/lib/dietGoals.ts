import type { MetabolicProtocol } from "@/context/MetabolicContext";

/** Daily targets used to compare live wearable-style metrics vs plan. */
export type PlanTargets = {
  stepsGoal: number;
  caloriesBudget: number;
  activeCaloriesGoal: number;
  restingBpmTargetLow: number;
  restingBpmTargetHigh: number;
};

export function getPlanTargets(protocol: MetabolicProtocol): PlanTargets {
  switch (protocol) {
    case "keto":
      return {
        stepsGoal: 10000,
        caloriesBudget: 2000,
        activeCaloriesGoal: 450,
        restingBpmTargetLow: 55,
        restingBpmTargetHigh: 72,
      };
    case "vegan":
      return {
        stepsGoal: 9000,
        caloriesBudget: 2200,
        activeCaloriesGoal: 400,
        restingBpmTargetLow: 58,
        restingBpmTargetHigh: 78,
      };
    case "mediterranean":
    default:
      return {
        stepsGoal: 8500,
        caloriesBudget: 2300,
        activeCaloriesGoal: 380,
        restingBpmTargetLow: 56,
        restingBpmTargetHigh: 76,
      };
  }
}
