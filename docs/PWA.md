# Making Fluks a PWA

Step-by-step guide to turn the Angular frontend into an installable PWA with an offline shell. Not yet implemented — planned for v1.1.0 (see [ROADMAP.md](ROADMAP.md)).

## 1. Add the Angular service worker package

```bash
cd frontend
ng add @angular/pwa
```

This single schematic:
- adds `@angular/service-worker` and registers `provideServiceWorker('ngsw-worker.js', { enabled: !isDevMode(), registrationStrategy: 'registerWhenStable:30000' })` in `app.config.ts`;
- creates `public/manifest.webmanifest` and a set of placeholder icons under `public/icons/`;
- creates `ngsw-config.json` (caching rules) and wires it into `angular.json`;
- adds `<link rel="manifest">` and a `theme-color` meta tag to `index.html`.

## 2. Replace the placeholder icons

Generate maskable icons from the Fluks logo (512, 384, 192, 152, 144, 128, 96, 72 px). Set `"purpose": "any maskable"` in the manifest. Match `theme_color` / `background_color` to the app tokens (`#0ea5e9` accent on `#06111f` dark background works well).

## 3. Tune `ngsw-config.json`

The default config caches the app shell (index.html, JS, CSS) — keep it. Add a data group so API reads feel instant but never go stale for long:

```json
{
  "dataGroups": [
    {
      "name": "rooms-api",
      "urls": ["https://fluks-api.onrender.com/rooms**"],
      "cacheConfig": {
        "strategy": "freshness",
        "timeout": "4s",
        "maxSize": 40,
        "maxAge": "1h"
      }
    }
  ]
}
```

Do **not** cache `/auth/**`. WebSocket traffic is unaffected by the service worker.

## 4. GitHub Pages specifics

- The service worker scope is the origin root — fine, since the app deploys with `--base-href /` on flusk.org.
- The deploy workflow copies `index.html` → `404.html`; `ngsw-worker.js` and `manifest.webmanifest` are emitted into the same `dist/fluks-frontend/browser` folder and need no extra handling.
- HTTPS is required for service workers — Pages provides it once "Enforce HTTPS" is on.

## 5. Update flow

`SwUpdate` from `@angular/service-worker` should prompt users when a new version is deployed:

```ts
const updates = inject(SwUpdate);
updates.versionUpdates
  .pipe(filter((e) => e.type === 'VERSION_READY'))
  .subscribe(() => {
    // show a "New version — reload?" toast, then:
    document.location.reload();
  });
```

Without this, users keep the old bundle until every tab is closed.

## 6. Verify

1. `ng build` and serve `dist/fluks-frontend/browser` statically (`npx http-server -p 8080`), open Chrome DevTools → Application → Service Workers.
2. Lighthouse → PWA category — expect "Installable" to pass.
3. Kill the network; reload — the shell must render (the rooms list may show the offline/error state).
4. On a phone: "Add to Home Screen", launch, check the standalone window and splash screen.

## Gotchas

- The offline experience for a *watch-together* app is inherently limited (no sockets, no YouTube) — the goal is instant shell load and installability, not offline playback.
- A room screen loaded offline should show the regular connection error state; test it.
- After changing `ngsw-config.json`, hard-refresh twice or use "Update on reload" in DevTools — stale workers routinely confuse manual testing.
