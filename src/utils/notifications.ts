import { launchCustomDialog } from "./ui/ui";
import { friendlyName } from "../../package.json";

export const checkNotificationPermission = async () => {
  if (!Notification) {
    launchCustomDialog(
      "Notifications",
      "Your browser does not support desktop notifications."
    );
  } else {
    switch (Notification.permission) {
      case "granted":
        showNotification(
          friendlyName,
          "Desktop notifications are already enabled"
        );
        break;
      case "denied":
        launchCustomDialog(
          "Notifications",
          "Permissions have been denied. Please change through your browser settings for this page."
        );
      case "default":
        await Notification.requestPermission();
        handlePermissionJustGranted();
        break;
    }
  }
};

const showNotification = (title: string, content: string) =>
  new Notification(title, { body: content, icon: "/favicon.svg" });

const handlePermissionJustGranted = () => {
  if (Notification.permission === "granted") {
    showNotification(
      friendlyName,
      "Desktop notifications have just been enabled."
    );
  }
};
