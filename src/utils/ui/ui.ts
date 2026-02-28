import type PrettyButton from "../../webComponents/form/PrettyButton";
import type SocialLink from "../../webComponents/links/SocialLink";
import {
  checkNotificationPermission,
  setupNotificationPermissionListener,
} from "../notifications";

export const disableContextMenu = () =>
  document.body.addEventListener("contextmenu", (event) =>
    event.preventDefault(),
  );

export const preventNavigation = () => {
  window.addEventListener("beforeunload", (event) => {
    // Display default dialog before closing
    event.preventDefault();
    event.returnValue = false; // Required by Chrome
  });
};

export const deleteChildren = (parent: HTMLElement) =>
  Array.from(parent.children).forEach((child) => parent.removeChild(child));

export const setupFullscreenBtn = async () => {
  const fullscreenBtn = document.getElementById(
    "fullscreenBtn",
  ) as PrettyButton;
  fullscreenBtn.on("click", async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.body.requestFullscreen();
    }
  });
};

export const setupNotifications = async () => {
  const notificationsIcon = document.getElementById(
    "notificationsIcon",
  ) as SocialLink;
  notificationsIcon.action = async () => await checkNotificationPermission();

  await setupNotificationPermissionListener();
};
