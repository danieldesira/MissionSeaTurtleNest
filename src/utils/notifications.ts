import { launchCustomDialog } from "./ui/customDialog";
import { friendlyName } from "../../package.json";
import { registerServiceWorker } from "./serviceWorkers";
import FetchRequest from "../services/FetchRequest";

export const checkNotificationPermission = async () => {
  if (!Notification) {
    launchCustomDialog(
      "Notifications",
      "Your browser does not support desktop notifications.",
    );
  } else {
    switch (Notification.permission) {
      case "granted":
        showNotification(
          friendlyName,
          "Desktop notifications are already enabled",
        );
        break;
      case "denied":
        launchCustomDialog(
          "Notifications",
          "Permissions have been denied. Please change through your browser settings for this page.",
        );
        break;
      case "default":
        await Notification.requestPermission();
        break;
    }
  }
};

const showNotification = (title: string, content: string) =>
  new Notification(title, { body: content, icon: "/favicon.svg" });

export const setupNotificationPermissionListener = async () => {
  const permission = await navigator.permissions.query({
    name: "notifications",
  });
  permission.onchange = async () => {
    if (permission.state === "granted") {
      await registerServiceWorker("notification");
      navigator.serviceWorker.addEventListener(
        "message",
        (event: MessageEvent) => {
          if (event.data?.pushSubscriptionEndpoint) {
            localStorage.setItem(
              "pushSubscriptionEndpoint",
              event.data.pushSubscriptionEndpoint,
            );
          }
        },
      );
      showNotification(
        friendlyName,
        "Desktop notifications have just been enabled.",
      );
    } else {
      const subscriptionEndpoint = localStorage.getItem(
        "pushSubscriptionEndpoint",
      );
      if (subscriptionEndpoint) {
        await FetchRequest.delete(
          `https://subnodulous-kaelyn-matrimonially.ngrok-free.dev/api/subscription`,
          { endpoint: subscriptionEndpoint },
          false,
        );
      }
    }
  };
};
