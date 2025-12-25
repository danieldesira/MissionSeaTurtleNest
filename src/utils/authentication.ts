import { login } from "../services/api";
import type { LoginResponse } from "../services/interfaces";
import { profileStore } from "../inMemoryStores/ProfileStore";
import { hideLoginDialog, updateAuthenticationUI } from "./ui/authUi";
import { toggleContinueGameBtn } from "./ui/mainMenu";
import { hideOverlay, showOverlay } from "./ui/overlay";
import { updatePersonalBestPlaceholders } from "./ui/scores";
import {
  setupControlSettings,
  setupSettingsProfileTab,
} from "./ui/settingsDialog";
import { launchCustomDialog } from "./ui/customDialog";
import { controlSettingsStore } from "../inMemoryStores/ControlSettingsStore";
import { personalBestStore } from "../inMemoryStores/PersonalBestStore";
import { lastGameStore } from "../inMemoryStores/LastGameStore";

export const handleGoogleAuthResponse = async ({
  credential,
}: {
  credential: string;
}) => {
  try {
    showOverlay("Logging in...");

    const loginResult = await login(credential);

    populatePlayerProfile(loginResult);
    populateGameData(loginResult);
    populatePersonalBest(loginResult);
    populateControlSettings(loginResult);

    hideLoginDialog();
    updateAuthenticationUI();
  } catch {
    launchCustomDialog(
      "Login failed",
      "There was an issue logging in. Please try again.",
    );
  } finally {
    hideOverlay();
  }
};

const populateGameData = (accountData: LoginResponse) => {
  if (accountData.lastGame) {
    lastGameStore.store = accountData.lastGame;
  } else {
    lastGameStore.reset();
  }
  toggleContinueGameBtn();
};

const populatePersonalBest = (accountData: LoginResponse) => {
  const { personalBest } = accountData;
  if (personalBest) {
    personalBestStore.level = personalBest.level;
    personalBestStore.points = personalBest.points;

    updatePersonalBestPlaceholders();
  }
};

const populatePlayerProfile = (accountData: LoginResponse) => {
  const { player } = accountData;
  if (player) {
    profileStore.email = player.email;
    profileStore.name = player.name;
    profileStore.profile_pic_url = player.profile_pic_url;
    profileStore.date_of_birth = new Date(player.date_of_birth);
    setupSettingsProfileTab();
  }
};

const populateControlSettings = (accountData: LoginResponse) => {
  const { player } = accountData;
  if (player.settings) {
    controlSettingsStore.screenControlsPosition =
      player.settings.controlPosition;
    setupControlSettings();
  }
};

export const isAuthenticated = () => !!profileStore.email;

export const clearCurrentPlayerStores = () => {
  profileStore.reset();
  personalBestStore.reset();
  controlSettingsStore.reset();
};
