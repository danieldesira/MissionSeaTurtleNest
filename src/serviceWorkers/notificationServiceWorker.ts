/// <reference lib="webworker" />

const notificationSW = self as unknown as ServiceWorkerGlobalScope;

const apiBaseUrl =
  location.hostname === "localhost"
    ? "https://subnodulous-kaelyn-matrimonially.ngrok-free.dev"
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
    },
  );
  return await res.json();
};

notificationSW.addEventListener("activate", async () => {
  const subscription = await notificationSW.registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey:
      "BJIUt7Pt_XgjUCatT8Vuu7Tyj0kVaT0t4OaUuWzdLtoINF95-LiI7LR0RzpIBRhmRTp0W9g2dI_OlWWy_OyMMgo",
  });
  await savePushSubscription(subscription);
});
