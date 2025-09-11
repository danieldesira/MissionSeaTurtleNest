/// <reference lib="webworker" />

const swSelf = self as unknown as ServiceWorkerGlobalScope;

const apiBaseUrl =
  location.hostname === "localhost"
    ? "https://localhost:32769"
    : "https://tochange.com";

const savePushSubscription = async (subscription: PushSubscription) => {
  const res = await fetch(`${apiBaseUrl}/api/subscription`, {
    method: "POST",
    headers: {
      "Accept-Content": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  });
  return await res.json();
};

swSelf.addEventListener("activate", async () => {
  const subscription = await swSelf.registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey:
      "BDRd50z5ESS32mFqaLVJIT-Ap-EgwELoHWo2BFa5_oZSGHKLtQcM3w4-nEA2XOnM6QMN1zYApbs4SjjQgt56rQk",
  });
  await savePushSubscription(subscription);
});

swSelf.addEventListener("push", () => {
  swSelf.registration.getNotifications();
});
