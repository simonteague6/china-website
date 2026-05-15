// Service worker — network-first with cache fallback
const CACHE = "china2026-v1";

const PRE_CACHE = [
  "/",
  "/index.html",
  "/styles.css",
  "/app.js",
  "/data.json",
  "/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRE_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  // Skip external URLs (Google Fonts, etc.)
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(networkFirst(event.request));
});

async function networkFirst(request) {
  try {
    // Try network first
    const response = await fetch(request);
    // Cache the fresh response
    const cache = await caches.open(CACHE);
    cache.put(request, response.clone());
    return response;
  } catch (e) {
    // Network failed — serve from cache
    const cached = await caches.match(request);
    if (cached) return cached;

    // If it's an image, return a placeholder
    if (request.url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="#1a1714" width="400" height="300"/><text fill="#5c5550" font-family="sans-serif" font-size="14" text-anchor="middle" x="200" y="155">📷</text></svg>',
        { headers: { "Content-Type": "image/svg+xml" } }
      );
    }

    // For pages, return the cached index
    const index = await caches.match("/index.html");
    if (index) return index;

    return new Response("Offline — content not cached", { status: 503 });
  }
}
