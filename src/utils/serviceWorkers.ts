export const registerServiceWorker = async (workerType: "cache") => {
  if (navigator.serviceWorker) {
    const worker = await navigator.serviceWorker.register(
      `${workerType}ServiceWorker.js`,
      { type: "module" },
    );
    console.log(`Registered service worker ${worker}`);
  }
};

export const clearServiceWorkers = async () => {
  if (!navigator.serviceWorker) {
    return;
  }

  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((registration) => registration.unregister()));

  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
};
