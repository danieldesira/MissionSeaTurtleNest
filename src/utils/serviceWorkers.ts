export const registerServiceWorker = async (workerType: "cache") => {
  if (navigator.serviceWorker) {
    try {
      const registration = await navigator.serviceWorker.register(
        `/${workerType}ServiceWorker.js`,
        { type: "module" },
      );
      await registration.update();
      console.log(`Registered service worker ${registration.scope}`);
    } catch (error) {
      console.error("Unable to register service worker", error);
    }
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
