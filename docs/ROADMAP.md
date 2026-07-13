# Roadmap

## v1.1.0 (planned)

### Guest access without registration
Let visitors join a room straight from a shared link.

- Backend: `POST /auth/guest` issues a short-lived JWT with a generated identity (`guest-<random>` login, `guest` role, no DB row — or a throwaway row with a TTL cleanup job). The socket gateway already validates any JWT signed with `JWT_SECRET_KEY`, so no gateway changes are needed for read-only participation.
- Restrictions: guests can watch and chat; they cannot create rooms (`RolesGuard` already scopes by role) or control playback unless the room has `allowGuestControl`.
- Frontend: "Continue as guest" button on the room join screen and on `auth/login`; a random readable nickname (e.g. `bright-otter-42`); guest state clearly shown in the header with an upsell to register.
- Origin note: the original team design assumed channel-ownership transfer; without it, randomly generated guest identities are acceptable.

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
