import cacheVersion from "./cacheVersion.json";
import precacheResources from "./precacheResources.json";

declare const self: ServiceWorkerGlobalScope;

const cacheName = `cache-v${cacheVersion.version}-c${cacheVersion.timestamp}`;
const criticalResources = [
  "/",
  "/index.html",
  "/index.js",
  "/index.css",
  "/manifest.json",
];

self.addEventListener("install", (event) => {
  console.info("Service worker install event!");
  event.waitUntil(
    caches.open(cacheName).then(async (cache) => {
      await Promise.all(
        precacheResources.map(async (resource) => {
          try {
            await cache.add(resource);
          } catch (error) {
            console.error(`Unable to precache ${resource}`, error);
          }
        }),
      );

      const missingResources = (
        await Promise.all(
          criticalResources.map(async (resource) =>
            (await cache.match(resource)) ? null : resource,
          ),
        )
      ).filter((resource): resource is string => resource !== null);

      if (missingResources.length > 0) {
        throw new Error(
          `Critical resources were not cached: ${missingResources.join(", ")}`,
        );
      }

      await self.skipWaiting();
    }),
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
  event.waitUntil(self.clients.claim());
});

// When there's an incoming fetch request, try and respond with a precached resource, otherwise fall back to the network
self.addEventListener("fetch", (event) => {
  console.info("Fetch intercepted for:", event.request.url);

  event.respondWith(
    (async () => {
      try {
        const requestUrl = new URL(event.request.url);
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(requestUrl.pathname, {
          ignoreSearch: true,
        });
        if (cachedResponse) {
          return cachedResponse;
        }
        return await fetch(event.request);
      } catch (error) {
        console.error(`Unable to respond to ${event.request.url}`, error);
        return new Response(null, {
          status: 503,
          statusText: "Offline resource unavailable",
        });
      }
    })(),
  );
});
