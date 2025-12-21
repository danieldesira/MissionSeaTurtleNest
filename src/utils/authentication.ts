import { login } from "../services/api";
import type { LoginResponse } from "../services/interfaces";
import { profileStore } from "../singletons/cacheStores/ProfileStore";
import {
  deleteLastGameLocalStorage,
  deleteLastGameTimestampLocalStorage,
  getLastGameLocalStorage,
  getLastGameTimestampLocalStorage,
  saveLastGameLocalStorage,
  saveLastGameTimestampLocalStorage,
} from "./lastGameLocalStorage";
import { hideLoginDialog, updateAuthenticationUI } from "./ui/authUi";
import { toggleContinueGameBtn } from "./ui/mainMenu";
import { hideOverlay, showOverlay } from "./ui/overlay";
import { updatePersonalBestPlaceholders } from "./ui/scores";
import {
  setupControlSettings,
  setupSettingsProfileTab,
} from "./ui/settingsDialog";
import { launchCustomDialog } from "./ui/customDialog";
import { controlSettingsStore } from "../singletons/cacheStores/ControlSettingsStore";
import { personalBestStore } from "../singletons/cacheStores/PersonalBestStore";

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
      "There was an issue logging in. Please try again."
    );
  } finally {
    hideOverlay();
  }
};

const populateGameData = (accountData: LoginResponse) => {
  if (accountData.lastGame) {
    const locallySavedGame = getLastGameLocalStorage();
    const localTimestamp = getLastGameTimestampLocalStorage();
    if (locallySavedGame && localTimestamp) {
      if (Number(localTimestamp) <= accountData.player.last_game_saved_on) {
        storeAccountGameDataLocally(accountData);
      }
    } else {
      storeAccountGameDataLocally(accountData);
    }
  } else {
    deleteLastGameLocalStorage();
    deleteLastGameTimestampLocalStorage();
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

const storeAccountGameDataLocally = (accountData: LoginResponse) => {
  saveLastGameLocalStorage(JSON.stringify(accountData.lastGame));
  saveLastGameTimestampLocalStorage(accountData.player.last_game_saved_on);
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
