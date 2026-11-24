# Where is what (website source)

Read this when you see something on ecodrix.com and want the file behind it.

## The rule

The folders read like the site. `app/` folders are URLs and never move. Everything else is grouped by the area a visitor sees, one folder per page or section inside it.

```
app/<url>/page.tsx            the route (a folder in brackets is a URL part, in parentheses it is not in the URL)
components/<area>/<page>/     what the page draws
lib/<area>/                   its data and helpers, no React in them
```

- A file is named after what it exports (`ModulePage.tsx` exports `ModulePage`; hooks start with `use`).
- `shared/` inside an area holds what two of its pages use.
- Building blocks used on many pages are in `components/marketing/`, `ui/`, `icons/`, `motion/`. Never import one area's folder from another area unless it is one of these.
- Tests sit next to the file they test (`lib/platform/catalog.test.ts`).

## From the site to a folder

| You see on ecodrix.com | URL | Route file under `app/` | Components | Data in `lib/` |
| --- | --- | --- | --- | --- |
| Home | `/` | `(brand)/page.tsx` | `components/home/` (hero in `home/hero/`) | `lib/site.ts` |
| Platform (header menu) | `/platform` | `(brand)/platform/page.tsx` | `components/platform/shared/` (`ModuleRow`) | `lib/platform/platform-modules.ts`, `catalog.ts` |
| ERIX CRM, Connect, Flow, Voice | `/platform/erix-crm`, `erix-connect`, `erix-flow`, `erix-voice` | `(brand)/platform/<module>/page.tsx` | `platform/shared/ModulePage.tsx`, tours in `platform/shared/module-tours.tsx` | `lib/platform/platform-modules.ts` |
| Their sub-pages (guides, industries) | `/platform/erix-crm/real-estate` ... | `(brand)/platform/<module>/[slug]/page.tsx` | `platform/shared/SubPageLayout.tsx` | `lib/platform/product-pages.ts` |
| Voice samples | `/platform/erix-voice/voices` | `(brand)/platform/erix-voice/voices/page.tsx` | `components/platform/voice/` | `platform/voice/voice-*.json` |
| AI employee (WhatsApp, chat, Instagram, email) | `/platform/ai-employee/...` | `(brand)/platform/ai-employee/` | `components/platform/ai-employee/` | `lib/platform/employee-pages.ts` |
| Industries (header menu) | `/platform/erix-crm/<industry>` | same as sub-pages | same | `lib/platform/product-pages.ts` |
| Pricing (not in the header) | `/pricing` | `(brand)/pricing/page.tsx` | `components/pricing/` | `lib/pricing.ts` |
| Resources: Blog | `/blog` | `(brand)/blog/` | `components/resources/blog/` | `lib/api.ts` (SDK) |
| Resources: Compare, Guides | `/compare`, `/guides` | `(brand)/compare/`, `(brand)/guides/` | `marketing/kit.tsx`, `ModulePage` | `lib/resources/comparisons.ts` |
| Help, API reference, Changelog (doc.ecodrix.com, one shell) | doc host `/`, `/api`, `/api/<section>`, `/changelog`; ecodrix.com links out and redirects the old `/help`, `/docs`, `/changelog`, `/whats-new` | `(docs)/layout.tsx` (shell), `(docs)/doc-host/` (rewritten to the host's root: `page.tsx` Help home, `[collection]/`, `api/`, `changelog/`, `sitemap.ts`) | `components/docs/` (`DocsShell` → `DocsFrame`, `DocsSidebar`, `DocToc`, `DocLead`, `ApiSection`), `components/help/` | `lib/docs/nav.ts` (sidebar + search), `lib/docs/docs.ts` (API), `lib/help/`, `lib/resources/changelog.ts` |
| Company: About, Founder | `/about`, `/founder` | `(brand)/about/`, `(brand)/founder/` | built from `marketing/kit.tsx` in the page | `lib/site.ts` |
| Legal | `/legal/...` | `(brand)/legal/<doc>/page.tsx` | `components/legal/` (also the cookie banner) | `lib/legal/` |
| Status page | status host `/` | `(statushost)/status-host/page.tsx` | `components/status/` | `lib/status/status-page.ts` |
| Header, footer, menus | every brand page | `(brand)/layout.tsx` | `components/layout/` | menu items in `lib/site.ts` (`PLATFORM_NAV` ...) |

The demo screens inside pages (inbox, pipeline, flow editor, chat, story scenes) are in `components/product-screens/`; `lazy-screen.tsx` loads them on demand. Page and module folders for CRM, Connect and Flow have no own components: they render through `ModulePage` with data from `lib/platform/`.

## Shared pieces

- `components/marketing/kit.tsx`: the CTAs (`PrimaryCta`, `EmailCta`), `MkHero`, `MkSection`, `CtaBand`, `BrowserFrame`, `PhoneFrame`, `Faq`.
- `components/layout/`: `BrandShell`, header (`Navbar`, `DesktopNav`, `MobileNav`), `Footer`.
- `components/ui/` shadcn-style primitives; `components/icons/` the only icon source; `components/motion/` animation helpers.
- `components/analytics/`, `components/seo/JsonLd.tsx`: scripts and structured data loaded from `app/layout.tsx`.
- Tokens, colours and theme scopes: `app/globals.css`. The one site config (name, URLs, menus, socials): `lib/site.ts`.
- `lib/seo/` (page metadata, JSON-LD), `lib/api.ts` (SDK calls), `lib/track.ts`, `lib/utils.ts`.
- Voice render script: `scripts/voice-samples.py` reads and writes `components/platform/voice/voice-*.json`. Check with `python3 scripts/voice-samples.py --plan` (and `--set library --plan`): both must say 0 not cached.

## Add a new page

1. Add the route: `app/(brand)/<url>/page.tsx` (use `(brand)` for pages with the header and footer).
2. Put its parts in `components/<area>/<page>/`; its text and lists in `lib/<area>/`.
3. Build it from `marketing/kit.tsx` and `ui/`; do not copy a section from another page.
4. Add it to the menu in `lib/site.ts` and to `app/sitemap.ts` if it should be indexed.
5. Add a row to the table above.

## Hero, navy band, header height

- Navy band: any section with class `band-navy` remaps the colour tokens to navy (`app/globals.css`).
- One-screen hero: `MkHero` in `marketing/kit.tsx` is exactly `100svh` tall on desktop (900px and wider); phones keep auto height.
- Header height: `--header-h` in `app/globals.css`; the navbar spacer, the first navy section on a page and the home hero all read it, so never hard-code the header size.
