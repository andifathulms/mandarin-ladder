/* Service worker generated from @ladder/core/sw/sw.template.js by scripts/make-sw.mjs.
   Bump the version on every release. */
const CACHE_VERSION = 'v1.0.0';
const CACHE = `mandarin-ladder-${CACHE_VERSION}`;
const PREFIX = 'mandarin-ladder-';
// Works under any base path: everything is relative to the registration scope.
const SCOPE = self.registration.scope;
const SHELL = [
  '',
  'rung/dasar-1/',
  'rung/dasar-2/',
  'rung/easy-1/',
  'placement/',
  'review/',
  'words/',
  'me/',
  'settings/',
  'about/',
  'manifest.webmanifest',
  'icons/icon.svg',
  'audio/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((c) => Promise.all(SHELL.map((p) => c.add(new URL(p, SCOPE)).catch(() => {}))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith(PREFIX) && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || !req.url.startsWith(SCOPE)) return;

  // Recorded audio is cache-first, stored on first play. File names carry a content hash.
  if (url.pathname.includes('/audio/') && url.pathname.endsWith('.mp3')) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) caches.open(CACHE).then((c) => c.put(req, res.clone()));
            return res;
          }),
      ),
    );
    return;
  }

  // strokes files are cache-first, stored when first used (never precached).
  if (url.pathname.includes('/strokes/') && url.pathname.endsWith('.json')) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) caches.open(CACHE).then((c) => c.put(req, res.clone()));
            return res;
          }),
      ),
    );
    return;
  }

  // Hashed build assets and fonts never change: cache first.
  if (url.pathname.includes('/_next/static/')) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) caches.open(CACHE).then((c) => c.put(req, res.clone()));
            return res;
          }),
      ),
    );
    return;
  }

  // Pages and RSC payloads: stale-while-revalidate, so opened lessons work offline.
  event.respondWith(
    caches.open(CACHE).then((c) =>
      c.match(req, { ignoreSearch: url.searchParams.has('_rsc') }).then((hit) => {
        const fresh = fetch(req)
          .then((res) => {
            if (res.ok) c.put(req, res.clone());
            return res;
          })
          .catch(() => hit || c.match(new URL('', SCOPE)));
        return hit || fresh;
      }),
    ),
  );
});
