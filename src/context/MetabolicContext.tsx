"use client";

import {
  createContext,
  useEffect,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type MetabolicProtocol = "keto" | "vegan" | "mediterranean";

export type MetabolicState = {
  protocol: MetabolicProtocol;
  setProtocol: (p: MetabolicProtocol) => void;
};

const MetabolicContext = createContext<MetabolicState | null>(null);

const PROTOCOL_LABELS: Record<MetabolicProtocol, string> = {
  keto: "Ketogenic",
  vegan: "Vegan",
  mediterranean: "Mediterranean",
};

const STORAGE_KEY = "nutri-node:protocol";

function isMetabolicProtocol(value: string): value is MetabolicProtocol {
  return value === "keto" || value === "vegan" || value === "mediterranean";
}

export function MetabolicProvider({ children }: { children: ReactNode }) {
  const [protocol, setProtocolState] = useState<MetabolicProtocol>("mediterranean");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && isMetabolicProtocol(saved)) {
      setProtocolState(saved);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, protocol);
  }, [protocol]);

  const setProtocol = useCallback((p: MetabolicProtocol) => {
    setProtocolState(p);
  }, []);

  const value = useMemo(
    () => ({ protocol, setProtocol }),
    [protocol, setProtocol],
  );

  return (
    <MetabolicContext.Provider value={value}>{children}</MetabolicContext.Provider>
  );
}

export function useMetabolic(): MetabolicState {
  const ctx = useContext(MetabolicContext);
  if (!ctx) {
    throw new Error("useMetabolic must be used within MetabolicProvider");
  }
  return ctx;
}

export function protocolLabel(protocol: MetabolicProtocol): string {
  return PROTOCOL_LABELS[protocol];
}
