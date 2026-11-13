"use client";

/**
 * The Platform menu after admin › Catalog (Hidden items dropped, Coming soon
 * badged). BrandShell fetches it on the server (`getPlatformNav`, ISR 300 s,
 * static fallback) and provides it here, so the header menus (desktop and
 * mobile) list exactly what the footer and the platform page list. Without a
 * provider the static list is used.
 */

import { createContext, type ReactNode, useContext } from "react";
import { type ModuleStatus, PLATFORM_NAV } from "@/lib/site";

export type PlatformNavItem = Omit<(typeof PLATFORM_NAV)[number], "status" | "summary"> & {
  status: ModuleStatus;
  summary: string;
  isNew?: boolean;
};

const PlatformNavContext = createContext<readonly PlatformNavItem[]>(PLATFORM_NAV);

export function PlatformNavProvider({ nav, children }: { nav: readonly PlatformNavItem[]; children: ReactNode }) {
  return <PlatformNavContext.Provider value={nav}>{children}</PlatformNavContext.Provider>;
}

export const usePlatformNav = () => useContext(PlatformNavContext);
