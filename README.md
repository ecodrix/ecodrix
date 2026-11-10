# ecodrix.com

The public website of ECODrIx and, from the same app, ERIX Help.

| Address | What it serves | Source |
|---|---|---|
| `ecodrix.com`, `www.ecodrix.com` | Home, platform, pricing, compare, guides, resources, blog, about, founder, legal pages | `src/app/(brand)` |
| `ecodrix.com/docs`, `/changelog`, `/status` | Developer docs, release notes, platform status | `src/app/(docs)` |
| `doc.ecodrix.com` | ERIX Help for customers | `src/app/(help)` |

`next.config.ts` routes by host: `doc.ecodrix.com` serves the Help pages at its
root, and `ecodrix.com/help/...` redirects there. Locally `doc.localhost`
works the same way.

The site reads two settings, both defaulting to `https://api.ecodrix.com`:

| Variable | Used for |
|---|---|
| `API_URL` | Server-rendered pages (blog, pages regenerated in the background) |
| `NEXT_PUBLIC_ERIX_SOCKET_URL` | The browser: visit tracking, waitlist, newsletter, status page, pricing. It is the REST API, despite the name. |

## Run it locally

Locally this app is a member of the pnpm workspace in the parent folder
(`~/ecodrix`). Install there, run here:

```bash
cd ~/ecodrix && pnpm install
cd ECOD/ecodrix && pnpm dev     # http://localhost:3000, Help at http://doc.localhost:3000
```

Copy `.env.example` to `.env.local` only to point at the local API
(`http://localhost:4000`).

| Command | What it does |
|---|---|
| `pnpm dev` | Development server |
| `pnpm build` | Production build (Next.js standalone server) |
| `pnpm lint` | Biome lint |
| `pnpm analyze` | Build with the bundle analyzer |

## Deploy

Push to `main`. That is the whole release:

1. The Cloud Build trigger `marketing-trigger` runs `cloudbuild.yaml`. It
   writes the browser-visible values (`NEXT_PUBLIC_*`, kept in Secret Manager
   as `ecodrix-site-build-env`) to `.env.production`, builds the `Dockerfile`
   and pushes `gcr.io/<project>/ecodrix-site` as `:latest` and the build id.
   About 6 minutes.
2. The release agent on the `ecodrix-web` VM notices the new image within a
   minute and swaps the `site` container. A container that is not healthy
   within 5 minutes is put back on the previous image.

Server-side settings live in `/opt/ecodrix-web/web.env` on the VM. To change
one, edit `ECOD/infra/web/web.env`, then `SYNC_ENV=1 bash release.sh site`.

Build notes:

- `next.config.ts` sets `output: "standalone"`; the image runs `server.js`.
  Do not add `outputFileTracingRoot`: locally the app is a workspace member and
  the build breaks.
- No lockfile is committed, so the image installs without one (`npm install`).
  Commit a lockfile and switch the Dockerfile to `npm ci` to pin installs.

Runbook and fix-it guide: `ECOD/infra/web/README.md`.
