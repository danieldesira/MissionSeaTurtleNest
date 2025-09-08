/// <reference lib="webworker" />

const swSelf = self as unknown as ServiceWorkerGlobalScope;

interface SaveSubPayload {
  endpoint: string;
  p256dh: ArrayBuffer | null;
  auth: ArrayBuffer | null;
}

const savePushSubscription = async (subscription: SaveSubPayload) => {
  const res = await fetch("http://localhost:32768/api/subscription", {
    method: "POST",
    headers: {
      "Accept-Content": "application/json",
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
  await savePushSubscription({
    endpoint: subscription.endpoint,
    p256dh: subscription.getKey("p256dh"),
    auth: subscription.getKey("auth"),
  });
});

swSelf.addEventListener("push", () => {
  swSelf.registration.getNotifications();
});
