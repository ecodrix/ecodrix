/**
 * The docs shell's navigation and search index (doc.ecodrix.com), built from
 * the section data: Help collections, the API sections and the changelog.
 * Plain serialisable data, so the client shell never imports the content.
 */

import type { SearchEntry } from "@/components/docs/DocsSearch";
import type { IconName } from "@/components/icons";
import { articleHref, articlesIn, byKey, HELP_COLLECTIONS, HELP_SEARCH, helpHref, START_HERE } from "@/lib/help";
import { RELEASES, versionAnchor } from "@/lib/resources/changelog";
import { DOC_SEARCH, DOC_SECTIONS } from "./docs";

export interface NavItem {
  label: string;
  href: string;
  icon?: IconName;
  /** Shown only while the reader is inside `href` (a collection's articles). */
  children?: { label: string; href: string }[];
}

export interface NavGroup {
  label: string;
  /** "Start here": items carry 1, 2, 3 instead of icons. */
  numbered?: boolean;
  items: NavItem[];
}

export interface DocsNav {
  help: NavGroup[];
  api: NavGroup[];
}

const collectionItem = (slug: string): NavItem => {
  const c = HELP_COLLECTIONS.find((x) => x.slug === slug);
  if (!c) throw new Error(`Unknown help collection: ${slug}`);
  return {
    label: c.title,
    href: helpHref(`/${c.slug}`),
    icon: c.icon,
    children: articlesIn(c.slug).map((a) => ({ label: a.title, href: articleHref(a) })),
  };
};

/** Help collections in sidebar groups; the small uppercase label is the group's name. */
const HELP_GROUPS: [label: string, slugs: string[]][] = [
  ["Run your day", ["inbox", "customers"]],
  ["Automate", ["agents", "automations"]],
  ["Set up and manage", ["getting-started", "channels", "account"]],
  ["Good to know", ["reference"]],
];

const API_ICON: Record<string, IconName> = {
  "Getting started": "rocket",
  CRM: "users",
  Automation: "workflow",
  Messaging: "message-circle",
  Platform: "layout-grid",
};

export function buildDocsNav(): DocsNav {
  const start = START_HERE.slice(0, 3)
    .map(byKey)
    .filter((a) => a !== undefined)
    .map((a) => ({ label: a.title, href: articleHref(a) }));
  const apiGroups = [...new Set(DOC_SECTIONS.map((s) => s.group))].map((group) => ({
    label: group,
    items: DOC_SECTIONS.filter((s) => s.group === group).map((s) => ({
      label: s.title,
      href: `/api/${s.id}`,
      icon: API_ICON[group],
    })),
  }));
  return {
    help: [
      { label: "Start here", numbered: true, items: start },
      ...HELP_GROUPS.map(([label, slugs]) => ({ label, items: slugs.map(collectionItem) })),
      { label: "Releases", items: [{ label: "Changelog", href: "/changelog", icon: "history" as const }] },
    ],
    api: [
      {
        label: "API reference",
        items: [
          { label: "Overview", href: "/api", icon: "code" },
          { label: "Back to Help", href: helpHref("/"), icon: "book-open" },
        ],
      },
      ...apiGroups,
    ],
  };
}

/** Everything the top bar's search looks through. */
export const ALL_SEARCH: SearchEntry[] = [
  ...HELP_SEARCH,
  ...DOC_SEARCH,
  ...RELEASES.map((r) => ({
    href: `/changelog#${versionAnchor(r.version)}`,
    title: r.version,
    kind: "Changelog",
    hint: r.items.map((i) => i.title).join(", "),
  })),
];
