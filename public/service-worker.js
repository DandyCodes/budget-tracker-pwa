const staticPaths = [
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/db.js",
  "/index.html",
  "/index.js",
  "/service-worker.js",
  "/styles.css",
];

const staticCache = "static-cache-v1";
const dynamicCache = "dynamic-cache-v1";

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(staticCache).then(cache => {
      return cache.addAll(staticPaths);
    })
  );
  self.skipWaiting();
});
