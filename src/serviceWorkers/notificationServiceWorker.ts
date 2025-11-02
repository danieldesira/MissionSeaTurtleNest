/// <reference lib="webworker" />

const notificationSW = self as unknown as ServiceWorkerGlobalScope;

const apiBaseUrl =
  location.hostname === "localhost"
    ? "https://localhost:32769"
    : "https://tochange.com";

const savePushSubscription = async (subscription: PushSubscription) => {
  const res = await fetch(
    `${apiBaseUrl}/api/subscription?appId=65033d73-3cdc-416d-9689-1b0b3e73cbad`,
    {
      method: "POST",
      headers: {
        "Accept-Content": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscription),
    }
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
});
