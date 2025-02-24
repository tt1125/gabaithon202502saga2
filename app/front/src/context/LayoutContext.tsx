"use client";

import { Tab } from "@/components/Tab";
import { createContext, useContext, ReactNode } from "react";

const LayoutContext = createContext<{}>({});

export function useLayoutContext() {
  return useContext(LayoutContext);
}

export function LayoutProvider({ children }: { children: ReactNode }) {
  return (
    <LayoutContext.Provider value={{}}>
      {children}
      <Tab />
    </LayoutContext.Provider>
  );
}
