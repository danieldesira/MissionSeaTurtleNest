import {
  AirVent,
  BellRing,
  ChevronLeft,
  CircleChevronDown,
  CircleChevronLeft,
  CircleChevronRight,
  CircleChevronUp,
  Fullscreen,
  Heart,
  HeartPulse,
  Link,
  LogIn,
  LogOut,
  Pause,
  Settings,
  Shrimp,
  Trophy,
  Wallet,
} from "lucide";
import type PrettyButton from "../webComponents/form/PrettyButton";
import type SocialLink from "../webComponents/links/SocialLink";
import {
  checkNotificationPermission,
  setupNotificationPermissionListener,
} from "../utils/notifications";
import { $id } from "./domQuery";

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
  const fullscreenBtn = $id("fullscreenBtn") as PrettyButton;
  fullscreenBtn.on("click", async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.body.requestFullscreen();
    }
  });
};

export const setupNotifications = async () => {
  const notificationsIcon = $id("notificationsIcon") as SocialLink;
  notificationsIcon.on(
    "click",
    async () => await checkNotificationPermission(),
  );

  await setupNotificationPermissionListener();
};

export const removeNoJsClass = () => document.body.classList.remove("no-js");

export const lucideIcons = {
  CircleChevronLeft,
  CircleChevronRight,
  CircleChevronUp,
  CircleChevronDown,
  Pause,
  ChevronLeft,
  Shrimp,
  Heart,
  Fullscreen,
  Trophy,
  LogIn,
  Settings,
  LogOut,
  Link,
  BellRing,
  HeartPulse,
  Wallet,
  AirVent,
};
