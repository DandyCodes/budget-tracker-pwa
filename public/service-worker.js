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

self.addEventListener("install", async () => {
  try {
    const cache = await caches.open(staticCacheName);
    await cache.addAll(staticPaths);
    self.skipWaiting();
  } catch (err) {
    console.log(err);
  }
});

self.addEventListener("activate", async () => {
  try {
    const keyList = await caches.keys();
    for (const key of keyList) {
      if (key !== staticCacheName && key !== dynamicCacheName) {
        await caches.delete(key);
      }
    }
    self.clients.claim();
  } catch (err) {
    console.log(err);
  }
});
