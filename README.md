# Lê

Lê is a European Portuguese pronunciation and reading trainer, built as an installable
Progressive Web App (PWA) for English speakers. It helps you learn to read Portuguese
text aloud with correct sounds and rhythm, even before you know what the words mean.
Spaced repetition (via FSRS) schedules what you practice so the tricky sounds stick.

## Tech stack

- **Vite 6** — build tooling and dev server
- **React 19** + **TypeScript** — UI
- **Tailwind CSS 4** — styling
- **Zustand** — state management
- **ts-fsrs** — FSRS spaced-repetition scheduling
- **Framer Motion** — animations
- **vite-plugin-pwa** (Workbox) — offline support and installability
- **Vitest** — unit tests
- **Playwright** — end-to-end tests (Chromium + WebKit/mobile Safari)

## Local development

```bash
npm install     # install dependencies
npm run dev     # start the Vite dev server
npm run build   # type-check and build to dist/
npm run preview # serve the production build locally (port 4173)
```

## Testing

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run test        # Vitest unit tests
npm run test:e2e    # Playwright e2e tests (builds + previews automatically)
```

## Docker

A multi-stage `Dockerfile` builds the static site with Node and serves it with nginx.

```bash
docker build -t le-portuguese .
docker run --rm -p 8080:80 le-portuguese
# open http://localhost:8080
```

The nginx config provides SPA history fallback, long-lived immutable caching for
fingerprinted assets, and `no-cache` for `index.html` and the service worker so updates
roll out promptly.

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`) runs on every push and pull request to `main`:

1. **quality** — `npm ci`, then `typecheck`, `lint`, and unit `test`. Fails fast.
2. **e2e** — installs Playwright browsers (cached on the lockfile hash) and runs the
   Playwright suite. On failure the `playwright-report/` is uploaded as an artifact.
3. **deploy** — runs only on push to `main` (skipped for pull requests). Builds the app
   and deploys `dist/` to Cloudflare Pages via `cloudflare/wrangler-action`.

A `concurrency` group keyed on the ref cancels superseded runs.

## Deployment

Deployment targets **Cloudflare Pages**. The Pages project must be named **`le-portuguese`**
(matching `--project-name=le-portuguese` in the deploy job).

Two GitHub repository secrets are required:

| Secret | Purpose |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with the **Cloudflare Pages: Edit** permission |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID |

Add them under **Settings → Secrets and variables → Actions** in the GitHub repo. Pushes to
`main` that pass quality and e2e checks deploy automatically to the production branch.
