const staticPaths = [
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/db.js",
  "/index.html",
  "/index.js",
  "/service-worker.js",
  "/styles.css",
];

const staticCacheName = "static-cache-v1";
const dynamicCacheName = "dynamic-cache-v1";

self.addEventListener("install", async event => {
  try {
    const cache = await caches.open(staticCacheName);
    await cache.addAll(staticPaths);
  } catch (err) {
    console.log(err);
  }
  self.skipWaiting();
});
