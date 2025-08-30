import { IoMdNotifications } from "react-icons/io";

const NotificationIcon = () => {
  const handleClick = async () => {
    await Notification?.requestPermission();
    if (Notification?.permission === "granted") {
      new Notification("Turtle Quest", {
        body: "Desktop notifications enabled!",
        icon: "/favicon.svg",
      });
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
