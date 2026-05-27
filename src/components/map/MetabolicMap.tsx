"use client";

import L from "leaflet";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import {
  protocolLabel,
  useMetabolic,
} from "@/context/MetabolicContext";
import {
  filterRestaurantsByProtocol,
  MOCK_RESTAURANTS,
  type MockRestaurant,
} from "@/lib/mockRestaurants";

import "leaflet/dist/leaflet.css";

const LISBON: L.LatLngExpression = [38.7223, -9.1393];
const ALGARVE: L.LatLngExpression = [37.15, -8.05];

const LISBON_ZOOM = 12;
const ALGARVE_ZOOM = 9;

const FLY_DURATION_SEC = 1.35;

/** Verified Kitchen Network marker: golden dot + ring. */
const venueDivIcon = L.divIcon({
  className: "nutri-leaflet-marker",
  html: '<div class="nutri-leaflet-marker__dot nutri-leaflet-marker__dot--gold" aria-hidden="true"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -10],
});

function MapFlyTo({
  center,
  zoom,
}: {
  center: L.LatLngExpression;
  zoom: number;
}) {
  const map = useMap();
  const isFirstPan = useRef(true);

  useEffect(() => {
    if (isFirstPan.current) {
      isFirstPan.current = false;
      map.setView(center, zoom, { animate: false });
      return;
    }
    map.flyTo(center, zoom, {
      duration: FLY_DURATION_SEC,
      easeLinearity: 0.22,
    });
  }, [map, center, zoom]);

  return null;
}

type RegionView = "lisbon" | "algarve";

export function MetabolicMap() {
  const { protocol, setProtocol } = useMetabolic();
  const [region, setRegion] = useState<RegionView>("lisbon");
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<MockRestaurant | null>(null);

  /** Strict protocol match: e.g. Keto → only venues that list `keto` in compatibleProtocols. */
  const protocolMatched = useMemo(
    () => filterRestaurantsByProtocol(MOCK_RESTAURANTS, protocol),
    [protocol],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const inRegion =
      region === "lisbon"
        ? protocolMatched.filter((r) => r.region === "lisbon")
        : protocolMatched.filter((r) => r.region === "algarve");
    if (!q) return inRegion;
    return inRegion.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.neighborhood.toLowerCase().includes(q) ||
        r.cuisine.toLowerCase().includes(q),
    );
  }, [protocolMatched, query, region]);

  const center = region === "lisbon" ? LISBON : ALGARVE;
  const zoom = region === "lisbon" ? LISBON_ZOOM : ALGARVE_ZOOM;

  return (
    <div className="relative md:space-y-6">
      <div className="hidden md:flex md:flex-col md:gap-6">
      <div className="rounded-2xl border border-[#333333] bg-[#1a1a1a] p-3">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
          Protocol Filter
        </p>
        <div className="flex flex-wrap gap-2">
          {(["keto", "vegan", "mediterranean"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setProtocol(option)}
              className={[
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                protocol === option
                  ? "border-[#68dba9] bg-[#68dba9]/20 text-[#68dba9]"
                  : "border-[#333333] bg-[#222222] text-gray-300 hover:text-gray-100",
              ].join(" ")}
            >
              {protocolLabel(option)}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-nutri-slate-500">
            Geospatial discovery
          </p>
          <h1 className="mt-1 font-display text-4xl tracking-tight text-nutri-slate-900">
            Metabolic Map
          </h1>
          <p className="mt-2 max-w-xl text-sm text-nutri-slate-600">
            Venues must match your active{" "}
            <span className="font-medium text-nutri-slate-700">
              {protocolLabel(protocol)}
            </span>{" "}
            protocol. Toggle Lisbon or the Algarve — the map eases between regions. Refine by
            name or neighborhood.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { id: "lisbon" as const, label: "Lisbon" },
              { id: "algarve" as const, label: "Algarve" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setRegion(tab.id)}
              className={[
                "rounded-full px-4 py-2 text-xs font-medium tracking-wide transition-all",
                region === tab.id
                  ? "bg-gradient-to-r from-nutri-slate-900 to-nutri-slate-800 text-white shadow-sm"
                  : "bg-white text-nutri-slate-600 ring-1 ring-nutri-slate-200 hover:bg-nutri-slate-50 hover:shadow-[0_10px_24px_-20px_rgba(15,23,42,0.35)]",
              ].join(" ")}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      </div>

      <div className="relative overflow-hidden rounded-none border-y border-nutri-slate-200/80 bg-gradient-to-br from-white via-white to-nutri-slate-50/70 p-3 shadow-luxury md:rounded-3xl md:border md:p-4">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-nutri-slate-100/75 blur-3xl" />
        <label className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-nutri-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search venues, neighborhoods, cuisine…"
            className="w-full rounded-2xl border border-nutri-slate-200 bg-nutri-slate-50/60 py-3 pl-11 pr-4 text-sm text-nutri-slate-900 outline-none ring-nutri-slate-300/60 placeholder:text-nutri-slate-400 focus:border-nutri-slate-300 focus:ring-2"
          />
        </label>

        <motion.div
          className="h-[calc(100dvh-9.5rem)] overflow-hidden rounded-2xl ring-1 ring-nutri-slate-200/80 md:mt-4 md:h-[420px]"
          initial={{ opacity: 0.85 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <MapContainer
            center={center}
            zoom={zoom}
            className="h-full w-full"
            scrollWheelZoom
          >
            <MapFlyTo center={center} zoom={zoom} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            {filtered.map((r) => (
              <RestaurantMarker
                key={r.id}
                restaurant={r}
                onSelect={setSelectedRestaurant}
              />
            ))}
          </MapContainer>
        </motion.div>

        <p className="mt-3 hidden text-xs text-nutri-slate-500 md:block">
          Showing {filtered.length} {protocolLabel(protocol)}-tagged{" "}
          {filtered.length === 1 ? "venue" : "venues"} in{" "}
          {region === "lisbon" ? "Lisbon" : "the Algarve"}.
        </p>

        <button
          type="button"
          onClick={() => setFiltersOpen((prev) => !prev)}
          className="fixed bottom-24 right-4 z-[500] inline-flex items-center gap-2 rounded-full bg-nutri-slate-900 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-[0_12px_28px_-18px_rgba(15,23,42,0.65)] md:hidden"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
          Filter
        </button>

        <AnimatePresence>
          {filtersOpen ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-x-4 top-4 z-[450] rounded-2xl border border-nutri-slate-200/90 bg-white/95 p-4 shadow-luxury backdrop-blur-xl md:hidden"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-nutri-slate-500">
                Geospatial discovery
              </p>
              <label className="relative mt-3 block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-nutri-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search venues, neighborhoods, cuisine…"
                  className="w-full rounded-xl border border-nutri-slate-200 bg-nutri-slate-50/70 py-2.5 pl-10 pr-3 text-sm text-nutri-slate-900 outline-none ring-nutri-slate-300/60 placeholder:text-nutri-slate-400 focus:border-nutri-slate-300 focus:ring-2"
                />
              </label>
              <div className="mt-3 flex flex-wrap gap-2">
                {(
                  [
                    { id: "lisbon" as const, label: "Lisbon" },
                    { id: "algarve" as const, label: "Algarve" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setRegion(tab.id)}
                    className={[
                      "rounded-full px-3 py-1.5 text-xs font-medium tracking-wide transition-all",
                      region === tab.id
                        ? "bg-nutri-slate-900 text-white shadow-sm"
                        : "bg-white text-nutri-slate-600 ring-1 ring-nutri-slate-200",
                    ].join(" ")}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-nutri-slate-500">
                {filtered.length} {filtered.length === 1 ? "venue" : "venues"} matching{" "}
                {protocolLabel(protocol)}.
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {selectedRestaurant ? (
          <div className="mt-4 rounded-2xl border border-[#333333] bg-[#1a1a1a] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#d4af37]">
              Verified Kitchen Network
            </p>
            <p className="mt-1 text-lg font-semibold text-gray-100">{selectedRestaurant.name}</p>
            <p className="text-xs text-gray-400">
              {selectedRestaurant.neighborhood} · {selectedRestaurant.cuisine}
            </p>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
              Verified Kitchen Tags
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {["Seed Oil Free", "Verified Sourcing", "Metabolic Seal"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#d4af37] bg-[#d4af37]/10 px-2.5 py-1 text-xs text-[#d4af37]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function RestaurantMarker({
  restaurant,
  onSelect,
}: {
  restaurant: MockRestaurant;
  onSelect: (restaurant: MockRestaurant) => void;
}) {
  return (
    <Marker
      position={[restaurant.lat, restaurant.lng]}
      icon={venueDivIcon}
      eventHandlers={{ click: () => onSelect(restaurant) }}
    >
      <Popup className="nutri-map-popup" minWidth={280}>
        <div className="nutri-popup-card -m-1 p-1">
          <p className="flex items-center gap-2 text-base font-semibold tracking-tight text-nutri-slate-900">
            <MapPin className="h-4 w-4 shrink-0 text-[#d4af37]" aria-hidden />
            {restaurant.name}
          </p>
          <p className="mt-0.5 text-xs text-nutri-slate-500">
            {restaurant.neighborhood} · {restaurant.cuisine}
          </p>

          <div className="mt-4 rounded-xl border border-nutri-slate-200/90 bg-nutri-slate-50/90 px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-nutri-slate-600">
              Metabolic tip
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-nutri-slate-700">
              {restaurant.metabolicTip}
            </p>
          </div>

          <p className="mt-3 text-[11px] text-nutri-slate-500">
            Tagged:{" "}
            <span className="font-medium text-nutri-slate-700">
              {restaurant.compatibleProtocols.map((p) => protocolLabel(p)).join(" · ")}
            </span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Seed Oil Free", "Verified Sourcing", "Metabolic Seal"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#d4af37] bg-[#d4af37]/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#d4af37]"
              >
                {tag}
              </span>
            ))}
          </div>

          <Link
            href="/"
            className="mt-4 flex w-full items-center justify-center rounded-xl bg-nutri-slate-900 px-4 py-2.5 text-center text-xs font-semibold tracking-wide text-white shadow-sm transition-colors hover:bg-nutri-slate-800"
          >
            View in Chef Card
          </Link>
        </div>
      </Popup>
    </Marker>
  );
}
