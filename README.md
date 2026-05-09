# Birthday countdown

A small, mobile-first birthday countdown site: live timer, hourly photo rotation, and AI captions with several “voices.” The UI is a Vite + React SPA; captions and admin vision run on Vercel serverless routes under `/api`.

## Architecture

- **Frontend:** React, Vite, TypeScript, CSS Modules (`src/`).
- **Static data:** JSON in `public/data/` plus images in `public/photos/` (no database).
- **API:** `api/caption.ts` and `api/analyze-photos.ts` (Node serverless on Vercel).
- **AI:** OpenAI for most caption modes and for vision analysis in admin; xAI (Grok) for boyfriend, husband, and flirty caption modes. Routing is defined in code (`api/lib/ai/providers.ts`).
- **Caching:** In-memory caption cache (10-minute buckets) and last-five caption history per photo + mode, both per serverless instance (best-effort on cold starts).

```
Browser → /data/*.json, /photos/*
Browser → POST /api/caption (JSON)
Admin   → POST /api/analyze-photos (multipart images)
```

## Setup

1. **Install**

   ```bash
   npm install
   ```

2. **Environment**

   Copy `.env.example` to `.env.local` (or configure vars in the Vercel dashboard):

   ```env
   OPENAI_API_KEY=...
   XAI_API_KEY=...
   ```

   - `OPENAI_API_KEY` is required for admin vision analysis and for caption modes: dad, mom, brother, best_friend, enemy.
   - `XAI_API_KEY` is required for caption modes: boyfriend, husband, flirty.

## Local development

### Frontend only (no API)

```bash
npm run dev
```

Opens Vite on `http://localhost:5173`. `/api/*` calls fail unless you also run a compatible backend (see below).

### Full stack (recommended)

Use the Vercel CLI so `/api` routes work locally:

```bash
npx vercel dev
```

This serves the app and serverless functions (default port is often `3000`). **`vite.config.ts` does not set a default `/api` proxy** so `vercel dev` never proxies API traffic back into Vite (which used to break with “invalid JS syntax” on `index.html` when the guessed port matched Vite’s real `--port`).

For a **split** setup (Vite HMR on `5173` + `vercel dev` for APIs), run `vercel dev` in one terminal, then in another:

```bash
VITE_API_PROXY_TARGET=http://127.0.0.1:3000 npm run dev
```

Use the host/port that `vercel dev` prints (not necessarily `3000`).

## Configuring the countdown

Edit `public/data/app-config.json`:

- `birthday` — local date/time in the `timezone` zone (ISO-like string, e.g. `2026-12-31T18:30:00`).
- `timezone` — IANA name (e.g. `America/New_York`).

## Photos and captions

1. Put image files under `public/photos/`.
2. Describe them in `public/data/photos.json` (see the sample entry). Fields `summary`, `visible_details`, `mood`, `setting`, and `tags` drive the caption prompt.
3. Caption style per mode lives in `public/data/mode-config.json` (`model`, `temperature`, `max_tokens`, `style_instructions`).

**Hourly rotation:** the active photo is chosen deterministically from `displayOrder` and the current wall-clock hour in `app-config.timezone` (same logic in `src/lib/hourlyPhoto.ts`).

## Internal admin (`/admin`)

No authentication (keep the URL private). You can:

1. Upload one or more images.
2. Run **Analyze with AI** (OpenAI vision) to draft metadata.
3. Edit fields, drag rows to reorder (`displayOrder` updates automatically).
4. Download `photos.json` and merge into `public/data/photos.json`.
5. Copy image files into `public/photos/` to match the `file` paths in the JSON, then commit/deploy.

The production server does not persist uploaded binaries; treat images as repo assets.

## Deployment (Vercel)

1. Connect the Git repository to Vercel (framework: Vite, or use the included `vercel.json`).
2. Set `OPENAI_API_KEY` and `XAI_API_KEY` in **Project → Settings → Environment Variables**.
3. Deploy. Build command: `npm run build`; output: `dist`.

Serverless functions live in `/api`; static assets and JSON are served from `dist/` (Vite copies `public/` into `dist/`). The API handlers read `public/data/*.json` in development and `dist/data/*.json` after build when deployed.

## Scripts

| Script            | Purpose                          |
| ----------------- | -------------------------------- |
| `npm run dev`     | Vite dev server                  |
| `npm run build`   | `tsc -b` + production bundle     |
| `npm run preview` | Preview the production build     |
| `npm run lint`    | ESLint                           |
| `npm run typecheck:api` | Typecheck `api/` only      |

## Project layout

```
public/
  data/           # app-config, mode-config, photos
  photos/         # image assets
src/
  components/     # UI pieces
  pages/          # Home + Admin
  hooks/          # data, countdown, captions warmup
  lib/            # hourly selection, countdown math
  services/       # fetch wrappers for APIs
  types/          # shared TS types
api/
  caption.ts
  analyze-photos.ts
  lib/            # cache, logging, AI helpers
```
