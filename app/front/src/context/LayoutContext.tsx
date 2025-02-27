"use client";

import { Tab } from "@/components/Tab";
import { createContext, useContext, ReactNode } from "react";

type LayoutContextType = null;

const LayoutContext = createContext<LayoutContextType>(null);

export function useLayoutContext() {
  return useContext(LayoutContext);
}

export function LayoutProvider({ children }: { children: ReactNode }) {
  return (
    <LayoutContext.Provider value={null}>
      {children}
      <Tab />
    </LayoutContext.Provider>
  );
}
