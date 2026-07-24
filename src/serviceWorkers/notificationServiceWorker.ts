/// <reference lib="webworker" />

export type {};

declare const self: ServiceWorkerGlobalScope;

const apiBaseUrl = "https://dpns.onrender.com";

const savePushSubscription = async (subscription: PushSubscription) => {
  const res = await fetch(
    `${apiBaseUrl}/api/subscription?appId=e2123b9c-cd5f-41ee-9884-c3ef121c3c3e`,
    {
      method: "POST",
      headers: {
        "Accept-Content": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscription),
    },
  );
  return await res.json();
};

const convertBase64ToUint8Array = (base64: string) => {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const rawData = atob(
    (base64 + padding).replace(/-/g, "+").replace(/_/g, "/"),
  );

  const result = new Uint8Array(rawData.length);
  for (let i = 0; i < result.length; i++) {
    result[i] = rawData.charCodeAt(i);
  }
  return result;
};

self.addEventListener("activate", async () => {
  const subscription = await self.registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertBase64ToUint8Array(
      "BLrELejSr9QQyKkwD7F843xuxa6mcJvBjEDHi6aijE3ceiunzgomR-adZlwANAiD0dIs6jfuWUPaOwwWQ8vGg90",
    ),
  });
  await savePushSubscription(subscription);
  self.clients
    .matchAll()
    .then((clients) =>
      clients.forEach((client) =>
        client.postMessage({ pushSubscriptionEndpoint: subscription.endpoint }),
      ),
    );
});

self.addEventListener("push", async (event) => {
  const data = event.data?.json();

  await self.registration.showNotification(data.title, {
    body: data.body,
    icon: "/favicon.svg",
  });
});
