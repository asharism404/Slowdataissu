const V = "asharchives-v8", SHELL = V + "-shell", RUNTIME = V + "-runtime";
const PRECACHE = ["./", "index.html", "lecture.html", "flashcards.html", "notes.html", "qbank.html", "focus.html",
  "styles.css", "glass.css", "nav.css", "anim.css", "theme.css", "pyq-day.css", "features.css", "lecture.css", "qbank.css",
  "videos.js", "subjects.js", "nav.js", "glass.js", "anim.js", "app.js", "pyq-day.js", "lecture.js", "flashcards.js", "notes.js", "focus.js", "qbank.js",
  "pwa.js", "manifest.webmanifest", "favicon-32.png", "apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png"];

self.addEventListener("install", e => {
  // cache:"reload" skips the browser's HTTP cache so a redeploy never precaches stale files
  e.waitUntil(caches.open(SHELL).then(c => Promise.all(PRECACHE.map(u => fetch(new Request(u, { cache: "reload" })).then(r => r.ok && c.put(u, r)).catch(() => {})))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => !k.startsWith(V)).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

// network first (always revalidated) so new deploys show immediately; cache only when offline
const fresh = async (req, cacheName) => {
  const cache = await caches.open(cacheName);
  try {
    // pass the original request through (keeps redirect handling intact for page navigations)
    const r = await fetch(req, { cache: "no-cache" });
    if (r.ok) cache.put(req, r.clone());
    return r;
  } catch {
    return (await cache.match(req, { ignoreSearch: true })) || (await caches.match(req, { ignoreSearch: true })) || Response.error();
  }
};

// big question files: serve instantly from cache, refresh in the background
const swr = async (req, cacheName) => {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  const net = fetch(req.url, { cache: "no-cache" }).then(r => { if (r.ok || r.type === "opaque") cache.put(req, r.clone()); return r; }).catch(() => null);
  return hit || (await net) || Response.error();
};

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (req.mode === "navigate") {
    e.respondWith(fresh(req, SHELL).then(r => r.type === "error" ? caches.match("index.html") : r));
    return;
  }
  if (url.origin === location.origin) { e.respondWith(url.pathname.includes("/qbank/") ? swr(req, RUNTIME) : fresh(req, SHELL)); return; }
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") e.respondWith(swr(req, RUNTIME));
});
