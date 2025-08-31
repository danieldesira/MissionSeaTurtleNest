/// <reference lib="webworker" />

const swSelf = self as unknown as ServiceWorkerGlobalScope;

const savePushSubscription = async (subscription: PushSubscription) => {
  const res = await fetch("/save-subscription", {
    method: "POST",
    headers: {
      "Accept-Content": "application/json",
    },
    body: JSON.stringify(subscription),
  });
  return await res.json();
};

swSelf.addEventListener("activate", async () => {
  console.log("activate notifications");
  const subscription = await swSelf.registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: "",
  });
  console.log(subscription);
  await savePushSubscription(subscription);
});

swSelf.addEventListener("push", () => {
  swSelf.registration.getNotifications();
});
