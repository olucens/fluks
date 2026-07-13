# Roadmap

## v1.1.0 (planned)

### More video sources
Today `extract-video-id` and the player are YouTube-only.

- Introduce a `VideoSource` union (`youtube | vimeo | file`) resolved by the URL parser; store `{ source, videoId, url }` in playlist items (backend already passes `url` through).
- Player becomes a host component that picks an adapter: YouTube IFrame API (existing), Vimeo Player SDK, and a plain `<video>` element for direct `.mp4`/HLS links — the same `stateChange`/`sync` contract for all three.
- Sync logic (`playback-sync.ts`) is already player-agnostic; only the adapters differ.

### PWA
Installable app with offline shell — see the step-by-step guide in [PWA.md](PWA.md).

### Smaller items
- Periodic authoritative playback re-sync from the host (drift correction every ~10 s).
- Persist playlists to Postgres so a backend restart does not wipe them (Redis keeps only live state).
- Route backend logs to stdout only (Render's filesystem is ephemeral; `LOG_DIR` files are lost).
- Viewer list ("who's in the room") from the data already carried in JWTs.
- Swagger UI at `/api/docs` (`@nestjs/swagger` is already a dependency).
- E2E smoke (Playwright): register → create room → second client → playback sync, wired into CI.
- Keep-alive pinger or paid instance to avoid Render free-tier cold starts.

## Done in v1.0

- Monorepo migration (Vejas → Fluks), GitHub Pages + Render + Neon deployment.
- Mobile/theme CSS fixes across all screens.
- Manual light/dark theme toggle with persisted choice.
- Access-token auto-refresh (HTTP interceptor + socket reconnect with fresh token).
- Helmet security headers and request body-size limits; global rate limiting.
- DVD-style room loading screen.
- Guest access: a shared room link works without registration — `POST /auth/guest` issues a throwaway JWT identity (readable name like `bright-otter-42`, `guest` role, no DB row); the room route silently signs visitors in as guests; guests can watch and chat but get 403 on room mutations. Possible follow-ups: "Continue as guest" button on the login screen, upgrade path that keeps the nickname.
- Original SVG logo (potion flask with a flux wave) in the header and as favicon.
