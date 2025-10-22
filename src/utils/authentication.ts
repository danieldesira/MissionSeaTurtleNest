import { login } from "../services/api";
import { LoginResponse } from "../services/interfaces";
import ControlSettingsStore from "../singletons/cacheStores/ControlSettingsStore";
import PersonalBestStore from "../singletons/cacheStores/PersonalBestStore";
import ProfileStore from "../singletons/cacheStores/ProfileStore";
import {
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
import { launchCustomDialog } from "./ui/ui";

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

    toggleContinueGameBtn();
  }
};

const populatePersonalBest = (accountData: LoginResponse) => {
  const { personalBest } = accountData;
  if (personalBest) {
    PersonalBestStore.instance.level = personalBest.level;
    PersonalBestStore.instance.points = personalBest.points;

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
    ProfileStore.instance.email = player.email;
    ProfileStore.instance.name = player.name;
    ProfileStore.instance.profile_pic_url = player.profile_pic_url;
    ProfileStore.instance.date_of_birth = new Date(player.date_of_birth);
    setupSettingsProfileTab();
  }
};

const populateControlSettings = (accountData: LoginResponse) => {
  const { player } = accountData;
  if (player.settings) {
    ControlSettingsStore.instance.screenControlsPosition =
      player.settings.controlPosition;
    setupControlSettings();
  }
};

export const isAuthenticated = () => !!ProfileStore.instance.email;

export const clearCurrentPlayerStores = () => {
  ProfileStore.instance.reset();
  PersonalBestStore.instance.reset();
  ControlSettingsStore.instance.reset();
};
