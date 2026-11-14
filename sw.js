const V = "asharchives-v1", SHELL = V + "-shell", RUNTIME = V + "-runtime";
const PRECACHE = ["./", "index.html", "lecture.html", "flashcards.html", "notes.html", "qbank.html", "focus.html",
  "styles.css", "glass.css", "nav.css", "neumorphism.css", "anim.css", "theme.css", "pyq-day.css", "features.css", "lecture.css", "qbank.css",
  "videos.js", "subjects.js", "nav.js", "glass.js", "anim.js", "app.js", "pyq-day.js", "lecture.js", "flashcards.js", "notes.js", "focus.js", "qbank.js",
  "pwa.js", "manifest.webmanifest", "favicon-32.png", "apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(SHELL).then(c => Promise.all(PRECACHE.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => !k.startsWith(V)).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

const swr = async (req, cacheName, ignoreSearch) => {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req, { ignoreSearch });
  const net = fetch(req).then(r => { if (r && (r.ok || r.type === "opaque")) cache.put(req, r.clone()); return r; }).catch(() => null);
  return hit || (await net) || Response.error();
};

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (req.mode === "navigate") {
    // network first so updates show up, cached page when offline (lecture.html?subject=… falls back to lecture.html)
    e.respondWith(fetch(req).then(r => { if (r.ok) caches.open(SHELL).then(c => c.put(req, r.clone())); return r; })
      .catch(async () => (await caches.match(req, { ignoreSearch: true })) || (await caches.match("index.html")) || Response.error()));
    return;
  }
  if (url.origin === location.origin) { e.respondWith(swr(req, url.pathname.includes("/qbank/") ? RUNTIME : SHELL, false)); return; }
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") e.respondWith(swr(req, RUNTIME, false));
});
