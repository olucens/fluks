# Flusk API

NestJS backend for [Flusk](../README.md) — synchronized watch-together rooms. PostgreSQL (Prisma) for durable data, Redis for live room state, socket.io for real-time events, JWT auth with refresh tokens.

## Quick start

```bash
cp .env.example .env
docker compose up -d --build     # API + Postgres + Redis, migrations run automatically
```

Or against your own Postgres/Redis:

```bash
npm ci
npx prisma migrate dev
npm run start:dev
```

Health check: `GET /health`

## Environment variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | HTTP/WS port | `4000` |
| `CORS_ORIGIN` | Comma-separated list of allowed origins | `https://flusk.org,http://localhost:4200` |
| `DATABASE_URL` | Postgres connection string (Neon: add `sslmode=require`) | `postgresql://user:pass@host:5432/flusk_db?schema=public` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `JWT_SECRET_KEY` / `JWT_SECRET_REFRESH_KEY` | Token signing secrets | — |
| `TOKEN_EXPIRE_TIME` / `TOKEN_REFRESH_EXPIRE_TIME` | Token lifetimes | `1h` / `24h` |
| `CRYPT_SALT` | bcrypt salt rounds | `10` |
| `LOG_LEVEL`, `LOG_DIR` | Logging verbosity and file directory | `2`, `logs` |

## REST API

All routes are JWT-protected unless marked public. Global rate limit: 100 req/min.

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/health` | public | Health check |
| POST | `/auth/signup` | public | Register (`login`, `password`) |
| POST | `/auth/login` | public | Get access + refresh tokens |
| POST | `/auth/guest` | public | Throwaway guest identity (JWT only, no DB row, no refresh token) |
| POST | `/auth/refresh` | public | Rotate tokens (`refreshToken`) |
| GET | `/user/me` | ✔ | Current user profile |
| PATCH | `/user/me` | ✔ | Update profile (nickname, …) |
| PUT | `/user/:id/password` | ✔ | Change password |
| GET | `/rooms` | public | List rooms |
| GET | `/rooms/:id` | public | Room details |
| POST | `/rooms` | ✔ registered | Create room (`allowGuestControl` optional; guests get 403) |
| PUT | `/rooms/:id` | ✔ registered (admin) | Update room |
| DELETE | `/rooms/:id` | ✔ registered (admin) | Delete room |

## WebSocket events (socket.io)

Connect with `auth: { token: <accessToken> }` — connections without a valid JWT are dropped.

| Client → Server | Server → Client | Notes |
|---|---|---|
| `joinRoom` / `leaveRoom` | `roomState`, `viewersCount` | Join emits a full state snapshot |
| `playbackUpdate` | `playbackUpdate` | Admin only, unless room has `allowGuestControl` |
| `chatMessage` | `chatMessage` | Broadcast to the room |
| `playlistAdd` / `playlistSelect` / `playlistRemove` | `playlistUpdate` | Admin only |

## Database

Prisma schema in [prisma/schema.prisma](prisma/schema.prisma): `User` (login, hashed password, nickname, profile fields) and `Room` (name, admin, `allowGuestControl`). Migrations run via `prisma migrate deploy` on container start (see [Dockerfile](Dockerfile)).

```bash
npm run prisma:migrate    # create/apply migration in dev
npm run prisma:generate   # regenerate client
```

## Tests

```bash
npm test          # unit (Jest)
npm run test:e2e  # e2e (requires running database)
```
