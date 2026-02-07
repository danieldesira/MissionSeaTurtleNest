import { login } from "../services/api";
import type { LoginResponse, SsoToken } from "../services/interfaces";
import { profileStore } from "../inMemoryStores/ProfileStore";
import { hideLoginDialog, updateAuthenticationUI } from "./ui/authUi";
import { toggleContinueGameBtn } from "./ui/mainMenu";
import { hideOverlay, showOverlay } from "./ui/overlay";
import { updatePersonalBestPlaceholders } from "./ui/scores";
import {
  setupControlSettings,
  setupSettingsProfileTab,
} from "./ui/settingsDialog";
import { controlSettingsStore } from "../inMemoryStores/ControlSettingsStore";
import { personalBestStore } from "../inMemoryStores/PersonalBestStore";
import { lastGameStore } from "../inMemoryStores/LastGameStore";
import { showErrorNotice } from "./ui/waitingNotice";

export const handleGoogleAuthResponse = async ({
  credential,
}: {
  credential: string;
}) => {
  try {
    showOverlay("Logging in...");

    const ssoToken: SsoToken = { service: "google", token: credential };

    const loginResult = await login(ssoToken);

    saveSsoTokenToLocalStorage(ssoToken);

    populatePlayerProfile(loginResult);
    populateGameData(loginResult);
    populatePersonalBest(loginResult);
    populateControlSettings(loginResult);

    hideLoginDialog();
    updateAuthenticationUI();
  } catch (e) {
    console.error(e);
    showErrorNotice("There was an issue logging in. Please try again.", 500);
    deleteSsoTokenInLocalStorage();
  } finally {
    hideOverlay();
  }
};

const populateGameData = (accountData: LoginResponse) => {
  if (accountData.player.lastGame) {
    lastGameStore.store = accountData.player.lastGame;
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
    personalBestStore.duration = personalBest.duration;
    personalBestStore.outcome = personalBest.outcome;

    updatePersonalBestPlaceholders();
  }
};

const populatePlayerProfile = (accountData: LoginResponse) => {
  const { player } = accountData;
  if (player) {
    profileStore.email = player.email;
    profileStore.name = player.name;
    profileStore.profilePicUrl = player.profilePicUrl;
    profileStore.dateOfBirth = player.dateOfBirth
      ? new Date(player.dateOfBirth)
      : null;
    profileStore.playerIdentifier = `${player.externalId}-${player.ssoPlatform}`;
    setupSettingsProfileTab();
  }
};

const populateControlSettings = (accountData: LoginResponse) => {
  const { player } = accountData;
  if (player.settings) {
    controlSettingsStore.screenControlsPosition =
      player.settings.controlPosition;
    controlSettingsStore.audioVolume = player.settings.audioVolume;
    setupControlSettings();
  }
};

export const isAuthenticated = () => !!profileStore.email;

export const clearCurrentPlayerStores = () => {
  profileStore.reset();
  personalBestStore.reset();
  controlSettingsStore.reset();
};

const saveSsoTokenToLocalStorage = (ssoToken: SsoToken) =>
  localStorage.setItem("ssoToken", JSON.stringify(ssoToken));

export const deleteSsoTokenInLocalStorage = () =>
  localStorage.removeItem("ssoToken");

export const getSsoTokenFromLocalStorage = () =>
  JSON.parse(localStorage.getItem("ssoToken")) as SsoToken;
