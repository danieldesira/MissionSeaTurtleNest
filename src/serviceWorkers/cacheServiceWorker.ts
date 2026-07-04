/// <reference lib="webworker" />

import precacheResources from "./precacheResources.json";

const cacheSW = self as unknown as ServiceWorkerGlobalScope;

// Choose a cache name
const cacheName = "cache-v1";

// When the service worker is installing, open the cache and add the precache resources to it
cacheSW.addEventListener("install", (event) => {
  console.info("Service worker install event!");
  event.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll(precacheResources)),
  );
});

// When there's an incoming fetch request, try and respond with a precached resource, otherwise fall back to the network
cacheSW.addEventListener("fetch", (event) => {
  console.info("Fetch intercepted for:", event.request.url);
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    }),
  );
});
