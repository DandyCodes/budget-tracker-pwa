const STATIC_PATHS = [
  "/",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/db.js",
  "/index.html",
  "/index.js",
  "/service-worker.js",
  "/styles.css",
  "/manifest.webmanifest",
];
const STATIC_CACHE_KEY = "static-cache-v1";
const RUNTIME_CACHE_KEY = "runtime-cache-v1";

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(STATIC_CACHE_KEY)
      .then(staticCache => staticCache.addAll(STATIC_PATHS))
      .then(_ => self.skipWaiting())
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(keyList => {
        return keyList.filter(
          key => key !== STATIC_CACHE_KEY && key !== RUNTIME_CACHE_KEY
        );
      })
      .then(unusedKeys => {
        return Promise.all(
          unusedKeys.map(unusedKey => {
            return caches.delete(unusedKey);
          })
        );
      })
      .then(_ => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      caches
        .open(RUNTIME_CACHE_KEY)
        .then(async dynamicCache => {
          try {
            const response = await fetch(event.request);
            if (response.status === 200) {
              dynamicCache.put(event.request.url, response.clone());
            }
            return response;
          } catch (err) {
            return await dynamicCache.match(event.request);
          }
        })
        .catch(err => console.log(err))
    );
  } else {
    event.respondWith(
      caches
        .match(event.request)
        .then(response => response || fetch(event.request))
    );
  }
});
