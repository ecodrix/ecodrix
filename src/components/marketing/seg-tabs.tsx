"use client";

import { m } from "framer-motion";
import { createContext, type ReactNode, useContext, useId, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

/** `icon`/`iconActive`: drawn by the server (line and solid), so the tabs
 *  ship no icon data. */
export type SegTab = { id: string; label: string; icon?: ReactNode; iconActive?: ReactNode; panel: ReactNode };

const PanelSeen = createContext(true);

/**
 * Renders its children only once their tab has been opened. For the heavy,
 * decorative part of a panel (the redrawn product screens): the copy beside
 * it stays in the HTML for every tab, while the screens of unopened tabs
 * are neither parsed nor hydrated on load.
 */
export function OnceVisible({ children }: { children: ReactNode }) {
  return useContext(PanelSeen) ? children : null;
}

/**
 * shadcn Tabs (Radix: arrow keys, Home/End, automatic activation) drawn as
 * the DS segmented control. The selected pill glides between items with a
 * framer-motion `layoutId` (instant under reduced motion), and the panel
 * rises in. Every panel is in the server HTML; parts wrapped in
 * `OnceVisible` wait until their tab is first opened.
 */
export function SegTabs({ tabs, label, panelClassName }: { tabs: SegTab[]; label: string; panelClassName?: string }) {
  const [active, setActive] = useState(tabs[0].id);
  const [seen, setSeen] = useState<string[]>([tabs[0].id]);
  const pill = useId();

  return (
    <Tabs
      value={active}
      onValueChange={(v) => {
        setActive(v);
        setSeen((s) => (s.includes(v) ? s : [...s, v]));
      }}
    >
      <TabsList aria-label={label}>
        {tabs.map((t) => (
          <TabsTrigger key={t.id} value={t.id}>
            {t.id === active && (
              <m.span
                layoutId={pill}
                aria-hidden="true"
                data-seg-ind
                className="absolute inset-0 -z-1 rounded-full bg-surface shadow-sm"
                transition={{ type: "spring", bounce: 0.18, duration: 0.42 }}
              />
            )}
            {t.id === active ? (t.iconActive ?? t.icon) : t.icon}
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((t) => (
        <TabsContent key={t.id} value={t.id} className={cn("mt-8", panelClassName)}>
          <PanelSeen.Provider value={seen.includes(t.id)}>
            <m.div
              key={t.id === active ? "on" : "off"}
              initial={t.id === active && seen.length > 1 ? { opacity: 0, y: 8 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {t.panel}
            </m.div>
          </PanelSeen.Provider>
        </TabsContent>
      ))}
    </Tabs>
  );
}
