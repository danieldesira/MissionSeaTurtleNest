/// <reference lib="webworker" />

const notificationSW = self as unknown as ServiceWorkerGlobalScope;

const apiBaseUrl =
  location.hostname === "localhost"
    ? "https://subnodulous-kaelyn-matrimonially.ngrok-free.dev"
    : "https://tochange.com";

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

notificationSW.addEventListener("activate", async () => {
  const subscription = await notificationSW.registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey:
      "BEfuj-su_7dqT40eFWTa4wh8FZDJ5oPUiu8AqxFQ260hZotE3i0ZH5B8Esc2J126zJgxLSEKSBRsrtFbKPXRo4Y",
  });
  await savePushSubscription(subscription);
  notificationSW.clients
    .matchAll()
    .then((clients) =>
      clients.forEach((client) =>
        client.postMessage({ pushSubscriptionEndpoint: subscription.endpoint }),
      ),
    );
});

notificationSW.addEventListener("push", async (event) => {
  const data = event.data?.json();

  await notificationSW.registration.showNotification(data.title, {
    body: data.body,
    icon: "/favicon.svg",
  });
});
