import type { ReactNode } from "react";
import { DocsShell } from "@/components/docs/DocsShell";

/** doc.ecodrix.com: Help, the API reference and the changelog in one shell. */
export default function DocsLayout({ children }: { children: ReactNode }) {
  return <DocsShell>{children}</DocsShell>;
}
