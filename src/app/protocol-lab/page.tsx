import { MsIcon } from "@/components/ui/MsIcon";

export default function ProtocolLabPage() {
  const protocol = {
    name: "Keto Adaptation Phase 2",
    status: "Active",
    boundaries: [
      { label: "Net Carbs", limit: "25g", current: "12g", color: "text-primary" },
      { label: "Seed Oils", limit: "0g", current: "0g", color: "text-emerald-500" },
      { label: "Hidden Sugars", limit: "0g", current: "2g", color: "text-error" },
    ],
  };

  return (
    <div className="flex flex-col gap-scale-7 p-page-margin">
      <header className="flex flex-col gap-2">
        <h1 className="font-headline-md text-display-lg text-on-surface">Protocol Lab</h1>
        <p className="text-on-surface-variant">
          Strategic boundaries for your current metabolic window.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-scale-7 md:grid-cols-2">
        <div className="rounded-[24px] border border-outline-variant bg-surface-container p-scale-7">
          <div className="mb-6 flex items-center gap-3">
            <MsIcon name="biotech" className="text-primary" />
            <h2 className="font-headline-md text-xl text-on-surface">{protocol.name}</h2>
            <span className="ml-auto rounded-full border border-outline-variant px-3 py-1 text-xs text-on-surface-variant">
              {protocol.status}
            </span>
          </div>

          <div className="space-y-4">
            {protocol.boundaries.map((b) => (
              <div key={b.label} className="flex items-center justify-between border-b border-outline-variant pb-2">
                <span className="font-label-sm uppercase tracking-wider text-on-surface-variant">
                  {b.label}
                </span>
                <span className={`font-mono-data ${b.color}`}>
                  {b.current} / {b.limit}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center rounded-[24px] border border-outline-variant bg-surface-container p-scale-7 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <MsIcon name="event" className="text-3xl text-primary" />
          </div>
          <h3 className="mb-2 font-headline-md text-on-surface">Metabolic Milestone</h3>
          <p className="px-8 text-sm text-on-surface-variant">
            Your adaptation phase completes on <strong>June 19</strong>. Stay disciplined to lock in
            fat-oxidation pathways.
          </p>
        </div>
      </div>
    </div>
  );
}
