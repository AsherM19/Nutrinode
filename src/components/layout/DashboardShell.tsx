"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Clock,
  LayoutDashboard,
  Menu,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { MsIcon } from "@/components/ui/MsIcon";

import {
  type MetabolicProtocol,
  protocolLabel,
  useMetabolic,
} from "@/context/MetabolicContext";
import { filterSiteSearch } from "@/lib/siteSearch";

const SIDEBAR_NAV = [
  {
    kind: "link" as const,
    href: "/",
    label: "Dashboard",
    icon: "dashboard",
    filledWhenActive: true,
  },
  {
    kind: "link" as const,
    href: "/map",
    label: "Metabolic Map",
    icon: "map",
    filledWhenActive: false,
  },
  {
    kind: "link" as const,
    href: "/staff/scan",
    label: "Intelligent Menu",
    icon: "camera",
    filledWhenActive: false,
  },
  {
    kind: "link" as const,
    href: "/protocol-lab",
    label: "Protocol Lab",
    icon: "biotech",
    filledWhenActive: false,
  },
];

const MOBILE_NAV = [
  { kind: "link" as const, href: "/", label: "Dashboard", icon: LayoutDashboard },
  { kind: "link" as const, href: "/staff/scan", label: "Scan", icon: Activity },
  { kind: "action" as const, key: "history", label: "History", icon: Clock },
  { kind: "action" as const, key: "profile", label: "Profile", icon: User },
] as const;

const PROTOCOLS: MetabolicProtocol[] = ["mediterranean", "keto", "vegan"];

function ProtocolPill({
  active,
  protocol,
  onSelect,
}: {
  active: boolean;
  protocol: MetabolicProtocol;
  onSelect: (p: MetabolicProtocol) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(protocol)}
      className={[
        "rounded-full px-3 py-1.5 font-label-sm text-label-sm tracking-wide transition-colors duration-300",
        active
          ? "border border-[#333333] bg-[#2a2a2a] text-primary shadow-nav"
          : "border border-transparent bg-transparent text-gray-400 hover:bg-[#2a2a2a] hover:text-gray-200",
      ].join(" ")}
    >
      {protocolLabel(protocol)}
    </button>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { protocol, setProtocol } = useMetabolic();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const isMapRoute = pathname === "/map";
  const isAuthRoute = pathname === "/login";

  const searchResults = filterSiteSearch(searchQuery);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!searchWrapRef.current?.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  if (isAuthRoute) {
    return <>{children}</>;
  }

  const linkActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="relative flex min-h-screen w-full overflow-x-hidden font-body-base text-on-surface">
      <nav
        key="nutrinode-nav"
        className={[
          "fixed z-50 flex flex-col p-6 shadow-[0_2px_4px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.08)] transition-transform duration-300",
          "bottom-0 left-0 top-0 w-[min(100vw-2rem,16rem)] rounded-r-[24px] border border-[#dee4de] bg-white",
          "md:bottom-auto md:m-8 md:h-[calc(100vh-64px)] md:w-64 md:rounded-[24px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          mobileOpen ? "flex" : "hidden md:flex",
        ].join(" ")}
        aria-label="Main navigation"
      >
        <div className="mb-10 flex items-center gap-3">
          <Link
            href="/"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#059669] font-headline-md text-lg font-bold text-white"
            onClick={() => setMobileOpen(false)}
          >
            N
          </Link>
          <div>
            <h1 className="font-headline-md text-xl font-bold text-gray-100">NutriNode</h1>
            <p className="font-label-sm text-label-sm text-gray-400">Premium Metabolic</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          {SIDEBAR_NAV.map((item) => {
            const active =
              item.kind === "link"
                ? linkActive(item.href)
                : false;

            const rowClass = [
              "group flex items-center gap-4 rounded-xl px-4 py-3 font-body-base text-body-base transition-colors",
              active
                ? "bg-[#2a2a2a] font-body-bold text-body-bold text-primary"
                : "text-gray-400 hover:bg-[#2a2a2a] hover:text-gray-200",
            ].join(" ");

            if (item.kind === "link") {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={rowClass}
                  onClick={() => setMobileOpen(false)}
                >
                  <MsIcon name={item.icon} filled={item.filledWhenActive && active} className="text-[22px]" />
                  <span>{item.label}</span>
                </Link>
              );
            }

            return (
              <button
                key={item.href}
                type="button"
                className={rowClass}
                onClick={() => {
                  console.log(item.href);
                  setMobileOpen(false);
                }}
              >
                <MsIcon name={item.icon} className="text-[22px]" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <Link
            href="/settings"
            className="mt-auto flex items-center gap-4 rounded-xl px-4 py-3 font-body-base text-body-base text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-gray-200"
            onClick={() => setMobileOpen(false)}
          >
            <MsIcon name="settings" className="text-[22px]" />
            <span>Settings</span>
          </Link>
        </div>

        <div className="mt-8 rounded-2xl border border-[#333333] bg-[#222222]/40 p-4 shadow-float md:hidden">
          <p className="mb-3 flex items-center gap-2 font-label-sm text-label-sm uppercase tracking-[0.14em] text-gray-400">
            <Activity className="h-3.5 w-3.5" aria-hidden />
            Active protocol
          </p>
          <div className="flex flex-wrap gap-2">
            {PROTOCOLS.map((p) => (
              <ProtocolPill
                key={p}
                protocol={p}
                active={protocol === p}
                onSelect={setProtocol}
              />
            ))}
          </div>
        </div>
      </nav>

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          aria-label="Dismiss menu"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <div className="flex h-screen flex-1 flex-col overflow-y-auto overflow-x-hidden md:ml-[calc(256px+64px)]">
        <header
          ref={searchWrapRef}
          className={[
            "sticky top-0 z-40 mt-8 flex w-full flex-col gap-3 bg-transparent px-8 md:gap-0",
            isMapRoute ? "hidden" : "",
          ].join(" ")}
        >
          <div className="flex w-full items-center justify-between gap-4 md:h-[56px]">
            <div className="flex items-center gap-3 md:hidden">
              <button
                type="button"
                className="rounded-full border border-[#333333] bg-[#1a1a1a] p-2 text-gray-200 shadow-nav transition-opacity hover:opacity-90"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" aria-hidden />
              </button>
              <span className="font-headline-md text-lg font-black tracking-tight text-gray-100">
                NutriNode Premium
              </span>
            </div>

            <div className="relative hidden w-full max-w-md flex-1 md:flex">
              <label className="relative w-full">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <MsIcon name="search" className="text-sm" />
                </span>
                <span className="sr-only">Search NutriNode</span>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                  placeholder="Search pages and features…"
                  className="w-full rounded-full border border-[#333333] bg-[#1a1a1a] py-2 pl-10 pr-4 text-sm font-body-base text-gray-200 shadow-nav placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#059669]"
                />
              </label>
              {searchOpen && searchResults.length > 0 ? (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-[#333333] bg-[#1a1a1a] py-1 shadow-float">
                  {searchResults.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="block px-4 py-3 text-left transition-colors hover:bg-[#2a2a2a]"
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                    >
                      <p className="text-sm font-semibold text-gray-100">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-4 md:ml-auto">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#333333] bg-[#1a1a1a] text-gray-200 shadow-nav transition-opacity hover:opacity-80"
                aria-label="Notifications"
              >
                <MsIcon name="notifications" className="text-[22px]" />
              </button>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#333333] bg-[#1a1a1a] text-gray-200 shadow-nav transition-opacity hover:opacity-80"
                aria-label="Account"
              >
                <MsIcon name="account_circle" className="text-[22px]" />
              </button>
            </div>
          </div>

          <div className="relative w-full md:hidden">
            <label className="relative w-full">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <MsIcon name="search" className="text-sm" />
              </span>
              <span className="sr-only">Search NutriNode</span>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                placeholder="Search pages and features…"
                className="w-full rounded-full border border-[#333333] bg-[#1a1a1a] py-2 pl-10 pr-4 text-sm font-body-base text-gray-200 shadow-nav placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </label>
            {searchOpen && searchResults.length > 0 ? (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-[#333333] bg-[#1a1a1a] py-1 shadow-float">
                {searchResults.map((item) => (
                  <Link
                    key={`m-${item.id}`}
                    href={item.href}
                    className="block px-4 py-3 text-left transition-colors hover:bg-[#2a2a2a]"
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                  >
                    <p className="text-sm font-semibold text-gray-100">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </header>

        <motion.main
          className={[
            "flex-1 overflow-y-auto overflow-x-hidden",
            isMapRoute
              ? "p-0 pb-0"
              : "p-page-margin pb-24 pt-6 md:pb-12",
          ].join(" ")}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={isMapRoute ? "" : "mx-auto flex w-full max-w-[1600px] flex-col gap-scale-7"}>
            {children}
          </div>
        </motion.main>
      </div>

      <nav
        className="fixed bottom-6 left-1/2 z-[100] flex w-[92%] max-w-md -translate-x-1/2 items-center justify-around rounded-full border border-[#333333] bg-[#1a1a1a] p-3 pb-safe shadow-float md:hidden"
        aria-label="Primary"
      >
        {MOBILE_NAV.map((item) => {
          const Icon = item.icon;
          const active =
            item.kind === "link"
              ? pathname === item.href || pathname.startsWith(`${item.href}/`)
              : false;
          const baseClass = [
            "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all duration-300",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#059669]",
          ].join(" ");
          const stateClass =
            item.kind === "action"
              ? "text-gray-400 hover:bg-[#2a2a2a]"
              : active
                ? "bg-[#2a2a2a] text-primary shadow-nav"
                : "text-gray-400 hover:bg-[#2a2a2a]";

          const icon = (
            <Icon
              className={[
                "h-5 w-5 transition-colors duration-300",
                active ? "text-primary" : "text-gray-400",
              ].join(" ")}
              aria-hidden
            />
          );

          return item.kind === "link" ? (
            <Link
              key={item.href}
              href={item.href}
              className={[baseClass, stateClass].join(" ")}
            >
              {icon}
              <span className="sr-only">{item.label}</span>
            </Link>
          ) : (
            <button
              key={item.key}
              type="button"
              onClick={() => console.log(item.key)}
              className={[baseClass, stateClass].join(" ")}
            >
              {icon}
              <span className="sr-only">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
