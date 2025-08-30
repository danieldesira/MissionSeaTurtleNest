// Choose a cache name
const cacheName = "cache-v1";
// List the files to precache
const precacheResources = [
  "",
  "index.html",
  "dist/bundle.js",
  "dist/bundle.css",
  "favicon.svg",
  "images/backgrounds/level1.png",
  "images/backgrounds/level2.png",
  "images/characters/turtle.svg",
  "images/characters/benthicCrab.svg",
  "images/characters/boat.svg",
  "images/characters/neptuneGrass.svg",
  "images/characters/plasticBag.svg",
  "images/characters/sardine.svg",
  "images/characters/shrimp.svg",
  "images/backgrounds/hatchingTurtles.svg",
];

const savePushSubscription = async (subscription) => {
  const res = await fetch("/save-subscription", {
    method: "POST",
    headers: {
      "Accept-Content": "application/json",
    },
    body: JSON.stringify(subscription),
  });
  return await res.json();
};

// When the service worker is installing, open the cache and add the precache resources to it
self.addEventListener("install", (event) => {
  console.log("Service worker install event!");
  event.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll(precacheResources))
  );
});

self.addEventListener("activate", async (event) => {
  const subscription = await self.registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: "",
  });
  await savePushSubscription(subscription);
});

// When there's an incoming fetch request, try and respond with a precached resource, otherwise fall back to the network
self.addEventListener("fetch", (event) => {
  const ignoreHosts = ["localhost"];

  const { hostname } = new URL(event.request.url);

  if (ignoreHosts.includes(hostname)) {
    return;
  }

  console.log("Fetch intercepted for:", event.request.url);
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse && !navigator.onLine) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});

self.addEventListener("push", (event) => {
  self.registration.sendNotification(event);
});
