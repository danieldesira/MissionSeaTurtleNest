import {
  updateProfile,
  updateSettings,
  uploadProfilePicture,
} from "../../services/api";
import ControlSettingsStore from "../../singletons/cacheStores/ControlSettingsStore";
import ProfileStore from "../../singletons/cacheStores/ProfileStore";
import PrettyDialog from "../../webComponents/dialog/PrettyDialog";
import ImageUploader from "../../webComponents/form/ImageUploader";
import PrettyButton from "../../webComponents/form/PrettyButton";
import RadioSelection from "../../webComponents/form/RadioSelection";
import TextInput from "../../webComponents/form/TextInput";
import { setupTabPills } from "./tabPills";
import { version } from "../../../package.json";
import { registerServiceWorker } from "../serviceWorkers";

export const setupControlSettings = () => {
  const screenControlPositionRadio = document.getElementById(
    "screenControlPositionRadio"
  ) as RadioSelection;
  screenControlPositionRadio.config = {
    name: "screenControlPosition",
    options: [
      { label: "Left", value: "Left" },
      { label: "Right", value: "Right" },
    ],
    selectedValue: ControlSettingsStore.instance.screenControlsPosition,
  };
};

const submitControlSettings = async () => {
  const screenControlPositionRadio = document.getElementById(
    "screenControlPositionRadio"
  ) as RadioSelection;
  ControlSettingsStore.instance.screenControlsPosition =
    screenControlPositionRadio.currentSelection as "Left" | "Right";
  await updateSettings({
    controlPosition: ControlSettingsStore.instance.screenControlsPosition,
  });
};

const submitProfileSettings = async () => {
  const playerNameInput = document.getElementById(
    "playerNameInput"
  ) as TextInput;
  const playerDobInput = document.getElementById("playerDobInput") as TextInput;
  ProfileStore.instance.name = playerNameInput.value.toString();
  ProfileStore.instance.date_of_birth = playerDobInput.value as Date;
  await updateProfile({
    name: ProfileStore.instance.name,
    date_of_birth: ProfileStore.instance.date_of_birth
      .toISOString()
      .split("T")[0],
  });
};

const handleSettingsDialogClose = () => {
  const form = document.getElementById("settingsForm") as HTMLFormElement;
  form.addEventListener(
    "submit",
    async () =>
      await Promise.all([submitControlSettings(), submitProfileSettings()])
  );
  if (form?.checkValidity()) {
    form?.requestSubmit();
  }
};

export const setupSettingsDialog = () => {
  const settingsBtn = document.getElementById("settingsBtn") as PrettyButton;
  const settingsDialog = document.getElementById(
    "settingsDialog"
  ) as PrettyDialog;
  settingsDialog.closeButtonIds = ["closeSettingsBtn"];
  settingsDialog.closeCallback = handleSettingsDialogClose;
  settingsBtn.callback = () => settingsDialog.show();
  setupTabPills("settings");
  setupAboutTab();
  setupNotificationsTab();
};

export const setupSettingsProfileTab = () => {
  const playerEmailReadonlyField = document.getElementById(
    "playerEmailReadonlyField"
  );
  playerEmailReadonlyField.innerText = ProfileStore.instance.email;

  const playerNameInput = document.getElementById(
    "playerNameInput"
  ) as TextInput;
  playerNameInput.value = ProfileStore.instance.name;

  const playerDobInput = document.getElementById("playerDobInput") as TextInput;
  playerDobInput.value = ProfileStore.instance.date_of_birth;

  const profilePicUploader = document.getElementById(
    "profilePicUploader"
  ) as ImageUploader;
  profilePicUploader.currentImageUrl = ProfileStore.instance.profile_pic_url;
  profilePicUploader.changeCallback = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const res = await uploadProfilePicture(target.files[0]);
    profilePicUploader.currentImageUrl = res.profilePicUrl;
  };
};

const setupAboutTab = () => {
  const versionLink = document.getElementById("version");
  versionLink.innerText = version;
};

const setupNotificationsTab = () => {
  const desktopNotificationsBtn = document.getElementById(
    "desktopNotificationsBtn"
  ) as PrettyButton;
  desktopNotificationsBtn.callback = async () => {
    await Notification?.requestPermission();
    if (Notification?.permission === "granted") {
      await registerServiceWorker("notification");
      launchDemoNotification();
    } else {
      throw new Error("Notification permission not granted");
    }
  };
};

const launchDemoNotification = () =>
  new Notification("Turtle Quest", {
    body: "Desktop notifications enabled!",
    icon: "/favicon.svg",
  });
