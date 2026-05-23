/* Mishka service worker.

   Стратегии:
   - HTML (navigation): network-first, fallback на cache, потом offline.
   - CSS / JS / шрифты / картинки: cache-first, asynchronously revalidate.

   Cache name содержит "v1" — увеличь, когда захочешь форсировать
   обновление у всех пользователей (например, при ребрендинге). */

const CACHE = 'mishka-v1';
/* OFFLINE_URL вычисляем динамически от scope, чтобы корректно работать
   на сайтах в subdir (baseURL вида https://example.com/blog/). */
const OFFLINE_URL = new URL('offline/', self.registration.scope).pathname;
const PRECACHE = [OFFLINE_URL];

/* Безопасное добавление в кэш: фильтр по http(s), пропуск ошибочных
   и opaque-партиальных ответов. Cache API бросает TypeError на
   chrome-extension://, data:, blob: и т.п. — отсекаем заранее. */
function shouldCache(req, res) {
  if (!req.url.startsWith('http')) return false;
  if (!res || !res.ok) return false;
  if (res.type === 'opaque' || res.type === 'opaqueredirect') return false;
  return true;
}

function safePut(req, res) {
  if (!shouldCache(req, res)) return Promise.resolve();
  const copy = res.clone();
  return caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
}

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
  if (!req.url.startsWith('http')) return; // skip chrome-extension://, data:, etc.

  const accept = req.headers.get('accept') || '';
  const isHTML = req.mode === 'navigate' || accept.indexOf('text/html') !== -1;

  if (isHTML) {
    // network-first для HTML — всегда стремимся к свежему
    event.respondWith(
      fetch(req)
        .then((res) => {
          safePut(req, res);
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
        safePut(req, res);
        return res;
      }).catch(() => hit);
      return hit || fetcher;
    })
  );
});
