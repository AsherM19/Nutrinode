"use client";

import dynamic from "next/dynamic";

function MapLoading() {
  return (
    <div className="flex h-[560px] items-center justify-center rounded-3xl border border-nutri-slate-200/80 bg-white text-sm text-nutri-slate-500 shadow-card">
      Loading map…
    </div>
  );
}

const MetabolicMapClient = dynamic(
  () =>
    import("@/components/map/MetabolicMap").then((m) => ({
      default: m.MetabolicMap,
    })),
  { ssr: false, loading: () => <MapLoading /> },
);

export default MetabolicMapClient;
