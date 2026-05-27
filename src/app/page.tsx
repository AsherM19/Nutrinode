import { ChefsBriefingCard } from "@/components/dashboard/ChefsBriefingCard";
import { MetabolicTelemetryCard } from "@/components/dashboard/MetabolicTelemetryCard";
import { BarcodeDietTruthPanel } from "@/components/concierge/BarcodeDietTruthPanel";
import { MsIcon } from "@/components/ui/MsIcon";

/**
 * App Router root route — dashboard homepage at /
 */
export default function HomePage() {
  return (
    <div className="flex w-full flex-col gap-scale-7">
      <div className="grid grid-cols-1 gap-scale-7 lg:grid-cols-12">
        <MetabolicTelemetryCard />

        <div className="flex flex-col gap-scale-7 lg:col-span-4">
          <div className="grid grid-cols-2 gap-scale-7">
            <div className="flex aspect-square flex-col justify-between rounded-[24px] border border-[#333333] bg-[#1a1a1a] p-6 shadow-float">
              <div className="flex items-start justify-between">
                <MsIcon name="bolt" className="text-[#059669]" />
              </div>
              <div>
                <p className="mb-1 font-label-sm text-label-sm text-gray-400">Efficiency Score</p>
                <p className="font-headline-md text-[32px] font-bold leading-tight text-gray-100">94</p>
              </div>
            </div>
            <div className="flex aspect-square flex-col justify-between rounded-[24px] border border-[#333333] bg-[#1a1a1a] p-6 shadow-float">
              <div className="flex items-start justify-between">
                <MsIcon name="local_fire_department" className="text-tertiary" />
              </div>
              <div>
                <p className="mb-1 font-label-sm text-label-sm text-gray-400">Active KCAL</p>
                <p className="font-headline-md text-[32px] font-bold leading-tight text-gray-100">482</p>
              </div>
            </div>
          </div>

          <ChefsBriefingCard />
        </div>
      </div>

      <BarcodeDietTruthPanel />
    </div>
  );
}
