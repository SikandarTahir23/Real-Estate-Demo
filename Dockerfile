# syntax=docker/dockerfile:1

# Meridian Estates — production image for the Next.js 14 App Router app.
# Next.js is a unified full-stack framework: the "backend" (the /api/matcher
# route, Server Components, and SSR) runs in the same Node process as the
# frontend, so this single image serves the entire application.
#
# Multi-stage build using Next.js "standalone" output (see next.config.mjs) to
# keep the final image minimal — it contains only the traced runtime deps, not
# the full node_modules or the toolchain used to build.

# ---- Stage 1: install dependencies ----------------------------------------
FROM node:20-alpine AS deps
WORKDIR /app

# Install with the lockfile for reproducible builds. Copy only manifests first
# so this layer is cached until dependencies actually change.
COPY package.json package-lock.json ./
RUN npm ci

# ---- Stage 2: build the application ----------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* vars are inlined into the client bundle at BUILD time, so the
# WhatsApp number must be present here to be embedded. Server-only secrets like
# GROK_API_KEY / DATABASE_URL are read at request time and are injected at runtime
# (locally via `docker run -e`; on Hugging Face Spaces via the Space's Secrets).
ARG NEXT_PUBLIC_WHATSAPP_NUMBER=""
ENV NEXT_PUBLIC_WHATSAPP_NUMBER=$NEXT_PUBLIC_WHATSAPP_NUMBER

# Skip Next.js anonymous telemetry inside CI/containers.
ENV NEXT_TELEMETRY_DISABLED=1

# Generate the Prisma client so any code path importing it resolves at build time.
# Harmless if unused; required once a route imports lib/db. No DB connection needed.
RUN npx prisma generate

RUN npm run build

# ---- Stage 3: minimal production runner ------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Bind to all interfaces so the container is reachable via the published port.
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Run as an unprivileged user rather than root.
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# The standalone output already includes a minimal node_modules and server.js.
# Static assets and the public/ folder are not part of standalone and must be
# copied alongside it at the paths Next.js expects.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

# server.js is emitted by Next.js standalone output; it boots the same Node
# server that handles SSR, Server Components, and the /api/matcher backend.
CMD ["node", "server.js"]
