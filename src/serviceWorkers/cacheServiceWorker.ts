/// <reference lib="webworker" />

import precacheResources from "./precacheResources.json";

const version = "0.9.0build1";

declare const self: ServiceWorkerGlobalScope;

const cacheName = `cache-v${version}`;

self.addEventListener("install", (event) => {
  console.info("Service worker install event!");
  event.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll(precacheResources)),
  );
});

self.addEventListener("activate", (event) => {
  console.info("Service worker activate event!");
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (name !== cacheName) {
            console.info("Deleting old cache:", name);
            return caches.delete(name);
          }
          return Promise.resolve();
        }),
      ),
    ),
  );
});

// When there's an incoming fetch request, try and respond with a precached resource, otherwise fall back to the network
self.addEventListener("fetch", (event) => {
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
