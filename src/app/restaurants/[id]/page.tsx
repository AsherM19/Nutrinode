"use client";

import { ChefHat, CircleAlert, Leaf, MapPin, Salad } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { protocolLabel, useMetabolic } from "@/context/MetabolicContext";
import { MOCK_RESTAURANTS } from "@/lib/mockRestaurants";

const KETO_SWAPS = [
  "Cauliflower puree in place of potato or polenta",
  "Courgette ribbons in place of wheat pasta",
  "Olive oil herb emulsion instead of sweet glazes",
];

const VEGAN_PROTEINS = [
  "Grilled tempeh with lemon-herb marinade",
  "Lentil and pumpkin-seed crumble for texture",
  "Tofu medallions finished in extra-virgin olive oil",
];

function ProtocolFocus() {
  const { protocol } = useMetabolic();

  if (protocol === "keto") {
    return (
      <section className="mt-4 rounded-3xl border border-nutri-emerald-soft/80 bg-white p-8 shadow-card">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-nutri-slate-500">
          Keto low-carb swaps
        </p>
        <ul className="mt-4 space-y-3">
          {KETO_SWAPS.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-relaxed text-nutri-slate-700">
              <Salad className="mt-0.5 h-4 w-4 shrink-0 text-nutri-emerald-deep" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  if (protocol === "vegan") {
    return (
      <section className="mt-4 rounded-3xl border border-nutri-emerald-soft/80 bg-white p-8 shadow-card">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-nutri-slate-500">
          Vegan protein strategy
        </p>
        <ul className="mt-4 space-y-3">
          {VEGAN_PROTEINS.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-relaxed text-nutri-slate-700">
              <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-nutri-emerald-deep" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section className="mt-4 rounded-3xl border border-nutri-slate-200/90 bg-white p-8 shadow-card">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-nutri-slate-500">
        Mediterranean brief
      </p>
      <p className="mt-3 text-sm leading-relaxed text-nutri-slate-700">
        Prioritize extra-virgin olive oil, grilled fish, legumes, and seasonal produce while
        keeping sauces clean and minimally processed.
      </p>
    </section>
  );
}

export default function RestaurantDetailPage() {
  const params = useParams<{ id: string }>();
  const { protocol } = useMetabolic();
  const restaurant = MOCK_RESTAURANTS.find((entry) => entry.id === params.id);

  if (!restaurant) {
    return (
      <div className="mx-auto max-w-3xl py-12">
        <article className="rounded-3xl border border-nutri-slate-200/90 bg-white p-10 shadow-card">
          <CircleAlert className="h-5 w-5 text-nutri-slate-500" aria-hidden />
          <h1 className="mt-4 font-display text-3xl tracking-tight text-nutri-slate-900">
            Restaurant not found
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-nutri-slate-600">
            This venue record is not available. Return to the map and choose an active listing.
          </p>
          <Link
            href="/map"
            className="mt-6 inline-flex rounded-xl border border-nutri-slate-200 bg-white px-4 py-2 text-sm font-medium text-nutri-slate-700 transition-colors hover:bg-nutri-slate-50"
          >
            Back to map
          </Link>
        </article>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl py-10">
      <article className="rounded-3xl border border-nutri-slate-200/80 bg-white p-10 shadow-luxury">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-nutri-slate-500">
          Restaurant protocol
        </p>
        <h1 className="mt-4 font-display text-4xl tracking-tight text-nutri-slate-900 sm:text-5xl">
          {restaurant.name}
        </h1>
        <p className="mt-2 text-sm text-nutri-slate-500">
          {restaurant.neighborhood} · {restaurant.cuisine}
        </p>

        <section className="mt-10 border-t border-nutri-slate-200 pt-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-nutri-emerald-soft bg-nutri-emerald-soft/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-nutri-slate-700">
            <ChefHat className="h-3.5 w-3.5 text-nutri-emerald-deep" aria-hidden />
            Chef&apos;s brief
          </p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-nutri-slate-900">
            {protocolLabel(protocol)} customization
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-nutri-slate-600">
            {restaurant.metabolicTip}
          </p>
        </section>

        <section className="mt-10 border-t border-nutri-slate-200 pt-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-nutri-emerald-soft bg-nutri-emerald-soft/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-nutri-slate-700">
            <ChefHat className="h-3.5 w-3.5 text-nutri-emerald-deep" aria-hidden />
            Chef&apos;s recommendations
          </p>
          <ProtocolFocus />
        </section>

        <section className="mt-10 border-t border-nutri-slate-200 pt-8">
          <h3 className="text-lg font-semibold tracking-tight text-nutri-slate-900">Restaurant details</h3>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-nutri-slate-200/80 bg-white p-4">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-nutri-slate-500">
                ID
              </dt>
              <dd className="mt-1 text-sm text-nutri-slate-800">{restaurant.id}</dd>
            </div>
            <div className="rounded-2xl border border-nutri-slate-200/80 bg-white p-4">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-nutri-slate-500">
                Region
              </dt>
              <dd className="mt-1 text-sm capitalize text-nutri-slate-800">{restaurant.region}</dd>
            </div>
            <div className="rounded-2xl border border-nutri-slate-200/80 bg-white p-4 sm:col-span-2">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-nutri-slate-500">
                Coordinates
              </dt>
              <dd className="mt-1 flex items-center gap-2 text-sm text-nutri-slate-800">
                <MapPin className="h-4 w-4 text-nutri-emerald-deep" aria-hidden />
                {restaurant.lat}, {restaurant.lng}
              </dd>
            </div>
            <div className="rounded-2xl border border-nutri-slate-200/80 bg-white p-4 sm:col-span-2">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-nutri-slate-500">
                Compatible protocols
              </dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {restaurant.compatibleProtocols.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-nutri-emerald-soft bg-nutri-emerald-soft/30 px-3 py-1 text-xs font-medium text-nutri-slate-700"
                  >
                    {protocolLabel(item)}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </section>

        <div className="mt-10">
          <Link
            href="/map"
            className="inline-flex rounded-xl bg-nutri-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-nutri-slate-800"
          >
            Return to map
          </Link>
        </div>
      </article>
    </div>
  );
}
