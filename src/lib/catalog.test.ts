/** Run: npx tsx --test src/lib/catalog.test.ts (no test runner is installed in this repo). */
import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { applyCatalog, type CatalogItem, getModuleView, getPlatformNav, isNewBadge, NEW_BADGE_DAYS } from "./catalog";
import { PLATFORM_NAV } from "./site";

const item = (id: string, status: "listed" | "soon"): CatalogItem => ({
  id,
  kind: "product",
  label: id,
  description: "",
  status,
});
const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

describe("applyCatalog", () => {
  it("keeps the static list when the catalog is null or empty", () => {
    assert.deepEqual(applyCatalog(PLATFORM_NAV, null), [...PLATFORM_NAV]);
    assert.deepEqual(applyCatalog(PLATFORM_NAV, []), [...PLATFORM_NAV]);
  });

  it("drops what the catalog leaves out, badges Coming soon, keeps Listed live", () => {
    const out = applyCatalog(PLATFORM_NAV, [item("crm", "listed"), item("flow", "soon"), item("inbox", "listed")]);
    assert.deepEqual(
      out.map((m) => [m.key, m.status]),
      [
        ["crm", "live"],
        ["connect", "live"],
        ["voice", "invite"],
        ["flow", "soon"],
      ],
    );
  });
});

describe("live flag", () => {
  it("available only when Listed AND live: going live never announces a module by itself", () => {
    const out = applyCatalog(PLATFORM_NAV, [
      { ...item("crm", "listed"), live: false },
      { ...item("flow", "soon"), live: true },
      { ...item("agents", "listed"), live: true },
    ]);
    assert.deepEqual(
      out.map((m) => [m.key, m.status]),
      [
        ["crm", "soon"],
        ["agents", "live"],
        ["voice", "invite"],
        ["flow", "soon"],
      ].sort((a, b) => out.findIndex((m) => m.key === a[0]) - out.findIndex((m) => m.key === b[0])),
    );
  });
});

describe("getPlatformNav fallback", () => {
  it("serves the static list when the API is down", async () => {
    globalThis.fetch = (async () => {
      throw new Error("down");
    }) as typeof fetch;
    assert.deepEqual(await getPlatformNav(), [...PLATFORM_NAV]);
  });

  it("serves the static list on a non-OK answer", async () => {
    globalThis.fetch = (async () => new Response("{}", { status: 502 })) as typeof fetch;
    assert.deepEqual(await getPlatformNav(), [...PLATFORM_NAV]);
  });

  it("follows the catalog when the API answers", async () => {
    globalThis.fetch = (async () =>
      new Response(JSON.stringify({ success: true, data: [item("agents", "soon")] }))) as typeof fetch;
    const nav = await getPlatformNav();
    assert.deepEqual(
      nav.map((m) => [m.key, m.status]),
      [
        ["agents", "soon"],
        ["voice", "invite"],
      ],
    );
  });
});

describe("marketing copy and New badge", () => {
  const now = Date.parse("2026-11-20T00:00:00Z");
  const day = 86_400_000;
  const since = (d: number) => new Date(now - d * day).toISOString();

  it("uses marketing.summary and falls back to the static summary", () => {
    const out = applyCatalog(
      PLATFORM_NAV,
      [
        { ...item("crm", "listed"), marketing: { summary: "  Admin words  " } },
        { ...item("flow", "listed"), marketing: null },
        { ...item("agents", "listed"), marketing: { summary: "" } },
      ],
      now,
    );
    const by = (k: string) => out.find((m) => m.key === k)?.summary;
    assert.equal(by("crm"), "Admin words");
    assert.equal(by("flow"), PLATFORM_NAV.find((m) => m.key === "flow")?.summary);
    assert.equal(by("agents"), PLATFORM_NAV.find((m) => m.key === "agents")?.summary);
  });

  it("badges New for 14 days after liveSince, then not", () => {
    assert.equal(NEW_BADGE_DAYS, 14);
    assert.equal(isNewBadge(since(13.9), now), true);
    assert.equal(isNewBadge(since(14), now), false);
    assert.equal(isNewBadge(null, now), false);
    assert.equal(isNewBadge("garbage", now), false);
    assert.equal(isNewBadge(new Date(now + day).toISOString(), now), false);
  });

  it("New only on available items; unavailable stay Coming soon", () => {
    const out = applyCatalog(
      PLATFORM_NAV,
      [
        { ...item("crm", "listed"), live: true, liveSince: since(2) },
        { ...item("flow", "listed"), live: true, liveSince: since(30) },
        { ...item("agents", "listed"), live: false, liveSince: since(1) },
        { ...item("inbox", "soon"), live: true, liveSince: since(1) },
      ],
      now,
    );
    const by = (k: string) => out.find((m) => m.key === k);
    assert.deepEqual([by("crm")?.status, by("crm")?.isNew], ["live", true]);
    assert.deepEqual([by("flow")?.status, by("flow")?.isNew], ["live", false]);
    assert.deepEqual([by("agents")?.status, by("agents")?.isNew], ["soon", false]);
    assert.deepEqual([by("connect")?.status, by("connect")?.isNew], ["soon", false]);
  });
});

describe("getModuleView", () => {
  it("maps the module slug to its item and carries marketing", async () => {
    globalThis.fetch = (async () =>
      new Response(
        JSON.stringify({
          success: true,
          data: [
            { ...item("inbox", "listed"), live: true, marketing: { summary: "S", body: "<p>b</p>" } },
            item("crm", "soon"),
          ],
        }),
      )) as typeof fetch;
    const c = await getModuleView("erix-connect", "live");
    assert.equal(c.status, "live");
    assert.equal(c.marketing?.body, "<p>b</p>");
    assert.equal((await getModuleView("erix-crm", "live")).status, "soon");
  });

  it("keeps the static status when the API is down", async () => {
    globalThis.fetch = (async () => {
      throw new Error("down");
    }) as typeof fetch;
    assert.deepEqual(await getModuleView("erix-crm", "live"), { status: "live", isNew: false, marketing: null });
  });
});
