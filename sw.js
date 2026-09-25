/* Offline support for the study console.
   Pages, scripts and data: network first, cache as fallback (updates show up right away).
   Images: cache first. Videos are never cached (too large; YouTube can't be cached). */
const CACHE = "ailaw-v1";
const SHELL = [
  "./", "index.html", "css/base.css", "css/enhance.css",
  "js/data.js", "js/app.js", "js/enhance.js",
  "shorts-catalog.json", "shorts-meta.json", "decks-catalog.json",
  "manifest.webmanifest", "assets/hero.jpg", "assets/hero_light.jpg", "assets/icons/icon-192.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  if (/\.(mp4|webm|mov)$/i.test(url.pathname) || req.headers.has("range")) return;

  if (/\.(jpg|jpeg|png|webp|svg|gif)$/i.test(url.pathname)) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    })));
    return;
  }
  e.respondWith(fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  }).catch(() => caches.match(req, {ignoreSearch: true}).then(hit => hit || caches.match("index.html"))));
});
