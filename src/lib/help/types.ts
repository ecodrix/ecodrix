/**
 * ERIX Help (doc.ecodrix.com): the content model. Articles are our own static
 * copy; inline text supports `code`, **bold** and [label](href) (see Rich).
 * Kinds follow Diátaxis: a tutorial teaches by doing, a how-to does one job,
 * reference lists facts, an explanation says why. Keep each article to one.
 */

import type { IconName } from "@/components/icons/Icon";

export type HelpKind = "tutorial" | "how-to" | "reference" | "explanation";

/** A real screen from the console (fictional demo clinic, light theme). */
export interface Shot {
  /** File name under /help/img/, without the extension. */
  src: string;
  alt: string;
  caption?: string;
}

export type HelpBlock =
  | { kind: "p"; text: string }
  | { kind: "h"; text: string }
  | { kind: "steps"; steps: { text: string; shot?: Shot }[] }
  | { kind: "shot"; shot: Shot }
  | { kind: "list"; items: string[] }
  | { kind: "note"; tone: "tip" | "info" | "warn"; title?: string; text: string }
  | { kind: "table"; head: string[]; rows: string[][] };

export interface HelpArticle {
  /** URL segment inside its collection. */
  slug: string;
  collection: string;
  title: string;
  /** One sentence: what the reader will be able to do. Shown in lists and search. */
  summary: string;
  kind: HelpKind;
  /** ISO date the steps and screens were last checked against the console. */
  updated: string;
  minutes: number;
  /** "Before you start": what the reader needs first. */
  before?: string[];
  blocks: HelpBlock[];
  /** Questions people hit on this job, answered in a line or two. */
  problems?: { q: string; a: string }[];
  /** Other articles, as "collection/slug". */
  related?: string[];
}

export interface HelpCollection {
  slug: string;
  title: string;
  /** What jobs live here, in the owner's words. */
  summary: string;
  icon: IconName;
}
