import { IoMdNotifications } from "react-icons/io";

const NotificationIcon = () => {
  const registerServiceWorker = async () =>
    await navigator.serviceWorker.register("notificationServiceWorker.js");

  const launchDemoNotification = () =>
    new Notification("Turtle Quest", {
      body: "Desktop notifications enabled!",
      icon: "/favicon.svg",
    });

  const handleClick = async () => {
    await Notification?.requestPermission();
    if (Notification?.permission === "granted") {
      await registerServiceWorker();
      launchDemoNotification();
    } else {
      throw new Error("Notification permission not granted");
    }
  };

  return (
    <IoMdNotifications
      className="text-primary text-4xl"
      role="button"
      title="Enable Desktop Notifications"
      onClick={handleClick}
    />
  );
};

export default NotificationIcon;
