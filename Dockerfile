# ─── ecodrix.com + doc.ecodrix.com (website, ERIX Help) ───
# Next.js standalone server (`output: "standalone"` in next.config.ts), run on
# the web VM (ECOD/infra/web).
#
# Three stages:
#   deps    installs dependencies (cached until package.json or the lockfile change)
#   build   `next build` with the browser-visible NEXT_PUBLIC_* values
#   runner  only .next/standalone + static + public, as a non-root user
#
# NEXT_PUBLIC_* values are compiled into the browser bundle, so they must be
# present at BUILD time: the pipeline writes them to `.env.production` before
# this build (cloudbuild.yaml). Server-only secrets are never in the image;
# they live in the service's env file on the VM.
# ──────────────────────────────────────────────────────────────────────────────

FROM node:24.22.1-alpine AS base
# Next's native pieces (sharp, swc) want glibc shims on Alpine.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ─── Stage 1: dependencies ────────────────────────────────────────────────────
FROM base AS deps
# ponytail: no lockfile is committed in this repo (Vercel also installed without one), so installs are not pinned — commit a lockfile and switch to `npm ci`.
COPY package.json ./
# Retried: native postinstalls download binaries from hosts that time out now and then.
RUN for i in 1 2 3; do npm install --no-audit --no-fund && break; \
    [ "$i" -eq 3 ] && exit 1; echo "npm install failed (attempt $i), retrying in 20s"; sleep 20; done

# ─── Stage 2: build ───────────────────────────────────────────────────────────
FROM base AS build
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# `.env.production` (NEXT_PUBLIC_* only) is read by `next build` when present.
RUN node_modules/.bin/next build

# ─── Stage 3: runtime ─────────────────────────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup -S app && adduser -S app -G app
COPY --from=build /app/public ./public
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
USER app
EXPOSE 3000
CMD ["node", "server.js"]
