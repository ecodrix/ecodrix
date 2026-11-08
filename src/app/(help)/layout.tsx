import type { ReactNode } from "react";
import { HelpShell } from "@/components/help/HelpShell";

/** ERIX Help (doc.ecodrix.com): its own header and footer, not the brand site's. */
export default function HelpLayout({ children }: { children: ReactNode }) {
  return <HelpShell>{children}</HelpShell>;
}
