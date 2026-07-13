# Fluks Frontend

Angular 22 SPA for [Fluks](../README.md) — synchronized watch-together rooms. Standalone components, signals, SCSS design-token theming (light/dark), socket.io client for real-time room events.

**Live:** [https://fluks.org](https://fluks.org)

## Development

```bash
npm ci
npm start          # http://localhost:4200
```

The dev build talks to the API at `http://localhost:3000` (`src/environments/environment.ts`); production points at `https://fluks-api.onrender.com` (`environment.prod.ts`). To run the API locally, see [backend/README.md](../backend/README.md).

## Scripts

| Command | What it does |
|---|---|
| `npm start` | Dev server with live reload |
| `npm run build` | Production build → `dist/fluks-frontend/browser` |
| `npm test` | Unit tests (Vitest) |
| `npm run lint` | ESLint over `src` |

## Structure

```
src/app/
├── core/        # guards, interceptors (auth, errors), services, pipes
├── models/      # shared interfaces
├── screens/     # routed pages: home, auth, room, create-room, profile, 404
├── shared/      # reusable UI: header, footer, chat, playlist, video-player, inputs
└── utils/       # playback sync, video id extraction
```

## Theming

All components use semantic CSS custom properties defined in `src/styles.scss` (`--app-*` tokens). Light/dark palettes follow `prefers-color-scheme` and can be forced via `[data-theme]` on the root element.

## Deployment

Deployed to GitHub Pages by `.github/workflows/deploy-frontend.yml` on every push to `main` that touches `frontend/`: production build with `--base-href /`, a `CNAME` for the custom domain, and a `404.html` SPA fallback. Details in [docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md).
