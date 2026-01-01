import type PrettyDialog from "../../webComponents/dialog/PrettyDialog";
import type ImageUploader from "../../webComponents/form/ImageUploader";
import type PrettyButton from "../../webComponents/form/PrettyButton";
import type RadioSelection from "../../webComponents/form/RadioSelection";
import type TextInput from "../../webComponents/form/TextInput";
import type TabPill from "../../webComponents/tabs/TabPill";
import { updateProfile, uploadProfilePicture } from "../../services/api";
import { checkNotificationPermission } from "../notifications";
import { hideWaitingNotice, showWaitingNotice } from "./waitingNotice";
import { launchCustomDialog } from "./customDialog";
import { controlSettingsStore } from "../../inMemoryStores/ControlSettingsStore";
import { profileStore } from "../../inMemoryStores/ProfileStore";
import { version } from "../../../package.json";
import { isAuthenticated } from "../authentication";

export const setupControlSettings = () => {
  const screenControlPositionRadio = document.getElementById(
    "screenControlPositionRadio",
  ) as RadioSelection;
  screenControlPositionRadio.config = {
    name: "screenControlPosition",
    options: [
      { label: "Left", value: "Left" },
      { label: "Right", value: "Right" },
    ],
    selectedValue: controlSettingsStore.screenControlsPosition,
  };
};

const cacheControlSettings = async () => {
  const screenControlPositionRadio = document.getElementById(
    "screenControlPositionRadio",
  ) as RadioSelection;
  controlSettingsStore.screenControlsPosition =
    screenControlPositionRadio.currentSelection as "Left" | "Right";
};

const cacheProfileSettings = async () => {
  const playerNameInput = document.getElementById(
    "playerNameInput",
  ) as TextInput;
  const playerDobInput = document.getElementById("playerDobInput") as TextInput;
  profileStore.name = playerNameInput.value.toString();
  profileStore.date_of_birth = playerDobInput.value as Date;
};

const submitSettings = async () => {
  if (isSubmissionNeeded()) {
    cacheControlSettings();
    cacheProfileSettings();

    showWaitingNotice("Saving settings");
    try {
      await updateProfile({
        name: profileStore.name,
        date_of_birth: profileStore.date_of_birth.toISOString().split("T")[0],
        settings: {
          controlPosition: controlSettingsStore.screenControlsPosition,
        },
      });
    } catch {
      launchCustomDialog("Saving failed", "Failed to save settings!");
    } finally {
      hideWaitingNotice();
    }
  }
};

const handleSettingsDialogClose = () => {
  const form = document.getElementById("settingsForm") as HTMLFormElement;
  form.addEventListener("submit", async () => await submitSettings());
  if (form?.checkValidity()) {
    form?.requestSubmit();
  }
};

export const setupSettingsDialog = () => {
  const settingsBtn = document.getElementById("settingsBtn") as PrettyButton;
  const settingsDialog = document.getElementById(
    "settingsDialog",
  ) as PrettyDialog;
  settingsDialog.closeButtonIds = ["closeSettingsBtn"];
  settingsDialog.closeCallback = handleSettingsDialogClose;
  settingsBtn.callback = () => settingsDialog.open();
  setupPermissionsTab();
  setupAboutTab();
  showHideSettingsTabs();
};

export const setupSettingsProfileTab = () => {
  const playerEmailReadonlyField = document.getElementById(
    "playerEmailReadonlyField",
  );
  playerEmailReadonlyField.innerText = profileStore.email;

  const playerNameInput = document.getElementById(
    "playerNameInput",
  ) as TextInput;
  playerNameInput.value = profileStore.name;

  const playerDobInput = document.getElementById("playerDobInput") as TextInput;
  playerDobInput.value = profileStore.date_of_birth;

  const profilePicUploader = document.getElementById(
    "profilePicUploader",
  ) as ImageUploader;
  profilePicUploader.currentImageUrl = profileStore.profile_pic_url;
  profilePicUploader.changeCallback = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    try {
      showWaitingNotice("Uploading a new profile picture");
      const res = await uploadProfilePicture(target.files[0]);
      profilePicUploader.currentImageUrl = res.profilePicUrl;
    } catch {
      launchCustomDialog(
        "Upload Error",
        "Failed to upload profile picture. Please try again!",
      );
    } finally {
      hideWaitingNotice();
    }
  };
};

const setupPermissionsTab = () => {
  const desktopNotificationsBtn = document.getElementById(
    "desktopNotificationsBtn",
  ) as PrettyButton;
  desktopNotificationsBtn.callback = async () =>
    await checkNotificationPermission();
};

const isSubmissionNeeded = () => {
  const playerNameInput = document.getElementById(
    "playerNameInput",
  ) as TextInput;
  const playerDobInput = document.getElementById("playerDobInput") as TextInput;
  const screenControlPositionRadio = document.getElementById(
    "screenControlPositionRadio",
  ) as RadioSelection;

  return (
    isAuthenticated() &&
    (profileStore.name !== playerNameInput.value ||
      profileStore.date_of_birth.toISOString() !==
        new Date(playerDobInput.value).toISOString() ||
      controlSettingsStore.screenControlsPosition !==
        screenControlPositionRadio.currentSelection)
  );
};

const setupAboutTab = () => {
  const versionLink = document.getElementById("version");
  versionLink.innerText = version;
};

export const showHideSettingsTabs = () => {
  const controlsTab = document.querySelector(
    '[data-container="controls-tab"',
  ) as TabPill;
  const profileTab = document.querySelector(
    '[data-container="profile-tab"]',
  ) as TabPill;
  controlsTab.isVisible = isAuthenticated();
  profileTab.isVisible = isAuthenticated();
};
