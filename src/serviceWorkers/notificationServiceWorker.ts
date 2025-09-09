/// <reference lib="webworker" />

const swSelf = self as unknown as ServiceWorkerGlobalScope;

interface SaveSubPayload {
  endpoint: string;
  p256dh: string;
  auth: string;
}

const apiBaseUrl =
  location.hostname === "localhost"
    ? "https://localhost:32769"
    : "https://tochange.com";

const savePushSubscription = async (subscription: SaveSubPayload) => {
  const res = await fetch(`${apiBaseUrl}/api/subscription`, {
    method: "POST",
    headers: {
      "Accept-Content": "application/json",
    },
    body: JSON.stringify(subscription),
  });
  return await res.json();
};

const convertArrayBufferToString = (buffer: ArrayBuffer | null) => {
  if (!buffer) {
    return "";
  }

  const decoder = new TextDecoder("utf-8");
  return decoder.decode(buffer);
};

swSelf.addEventListener("activate", async () => {
  const subscription = await swSelf.registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey:
      "BDRd50z5ESS32mFqaLVJIT-Ap-EgwELoHWo2BFa5_oZSGHKLtQcM3w4-nEA2XOnM6QMN1zYApbs4SjjQgt56rQk",
  });
  await savePushSubscription({
    endpoint: subscription.endpoint,
    p256dh: convertArrayBufferToString(subscription.getKey("p256dh")),
    auth: convertArrayBufferToString(subscription.getKey("auth")),
  });
});

swSelf.addEventListener("push", () => {
  swSelf.registration.getNotifications();
});
