/* Mishka service worker.

   Стратегии:
   - HTML (navigation): network-first, fallback на cache, потом /offline/.
   - CSS / JS / шрифты / картинки: cache-first, asynchronously revalidate.

   Cache name содержит "v1" — увеличь, когда захочешь форсировать
   обновление у всех пользователей (например, при ребрендинге). */

const CACHE = 'mishka-v1';
const OFFLINE_URL = '/offline/';
const PRECACHE = [OFFLINE_URL];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const accept = req.headers.get('accept') || '';
  const isHTML = req.mode === 'navigate' || accept.indexOf('text/html') !== -1;

  if (isHTML) {
    // network-first для HTML — всегда стремимся к свежему
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match(OFFLINE_URL)))
    );
    return;
  }

  // Cache-first для статики; в фоне обновляем кэш (stale-while-revalidate)
  event.respondWith(
    caches.match(req).then((hit) => {
      const fetcher = fetch(req).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => hit);
      return hit || fetcher;
    })
  );
});
