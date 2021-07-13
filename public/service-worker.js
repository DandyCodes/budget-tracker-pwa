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
    const staticCache = await caches.open(staticCacheName);
    await staticCache.addAll(staticPaths);
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

self.addEventListener("fetch", async event => {
  const response = await getResponse(event);
  event.respondWith(response || fetch(event.request));
});

async function getResponse(event) {
  try {
    if (!event.request.url.includes("/api/")) {
      throw "Not an api request: respond from static cache.";
    }
    const apiResponse = await fetch(event.request);
    if (apiResponse.status === 200) {
      cache.put(event.request.url, apiResponse.clone());
    }
    return apiResponse;
  } catch (err) {
    return await caches.match(event.request);
  }
}
