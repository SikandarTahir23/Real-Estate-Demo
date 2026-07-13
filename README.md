---
title: Meridian Estates
emoji: 🏙️
colorFrom: yellow
colorTo: gray
sdk: docker
app_port: 3000
pinned: false
short_description: Concept UAE real-estate portal with an AI property matcher & chatbot.
---

# Meridian Estates — concept UAE real-estate portal

A production-quality **concept/demo** portfolio project: a bilingual (English/Arabic)
Dubai & Abu Dhabi property portal built with **Next.js 14 (App Router)** and TypeScript.
It demonstrates the web + AI patterns a modern property portal needs — dense structured
filtering, an AI property matcher, real detail pages, interactive financial tooling, and
an AI concierge chatbot — end to end.

> **Disclosure:** Listings, pricing, developers, advisors, and client reviews are
> **illustrative** and not affiliated with any real brokerage. This is an engineering
> demonstration.

## Deployment (Hugging Face Spaces — Docker SDK)

This Space runs as a **Docker** Space. On push, Hugging Face builds the `Dockerfile` and
serves the container on the port declared above (`app_port: 3000`). The image uses
Next.js **standalone output** (`output: 'standalone'` in `next.config.mjs`) for a small
runtime image and boots via `node server.js`.

The app is designed to run **with or without** the optional services below — missing keys
never crash it; the AI features degrade gracefully to deterministic fallbacks.

## Environment variables

Set these as **Space Secrets** (Settings → Variables and secrets). None are baked into
the image. See [`.env.example`](./.env.example) for the full template.

| Variable | Required | Purpose |
| --- | --- | --- |
| `GROK_API_KEY` | optional | xAI Grok key powering the AI matcher (`/api/matcher`) and chatbot (`/api/chat`). If absent/invalid, both degrade to deterministic fallbacks. |
| `AI_API_KEY` | optional | Generic key; takes precedence over `GROK_API_KEY`. Lets you point at any OpenAI-compatible endpoint. |
| `AI_BASE_URL` | optional | Provider base URL. Default `https://api.x.ai/v1`. |
| `AI_MODEL` | optional | Model id. Default `grok-3`. |
| `AI_PROVIDER` | optional | Diagnostics label. Default `grok`. |
| `DATABASE_URL` | optional | PostgreSQL (Neon) connection string for the Prisma data layer. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | optional | WhatsApp advisor number (digits only, no `+`). **Build-time**: set as a build arg / Space variable, since `NEXT_PUBLIC_*` is inlined into the client bundle. |

> **Security:** Never commit real secrets. `.env` / `.env.local` are gitignored and
> excluded from the Docker image via `.dockerignore`. Rotate any key that has been shared.

## Tech stack

- **Next.js 14** App Router, strict TypeScript, Tailwind CSS
- **next-intl** bilingual EN/AR (RTL-aware), no-routing locale mode
- **Prisma** + PostgreSQL (Neon) data layer
- **xAI Grok** via a provider-agnostic client (`lib/ai.ts`), OpenAI-compatible

## Local development

```bash
npm install
cp .env.example .env.local   # fill in what you have; all are optional
npm run dev                  # http://localhost:3000
```

## Production build (same as the Space)

```bash
docker build -t meridian-estates .
docker run -p 3000:3000 -e GROK_API_KEY=... -e DATABASE_URL=... meridian-estates
```
