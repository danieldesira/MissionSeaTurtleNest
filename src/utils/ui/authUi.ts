import { requestLogout } from "../../services/api";
import PrettyDialog from "../../webComponents/dialog/PrettyDialog";
import PrettyButton from "../../webComponents/form/PrettyButton";
import {
  clearCurrentPlayerStores,
  deleteSsoTokenInLocalStorage,
  getSsoTokenFromLocalStorage,
  handleGoogleAuthResponse,
  isAuthenticated,
} from "../authentication";
import { hideContinueGameBtn } from "./mainMenu";
import { setupSettingsDialog } from "./settingsDialog";

const initialiseGoogleSignInButton = () => {
  window.google?.accounts?.id?.initialize({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    callback: handleGoogleAuthResponse,
  });

  window.google?.accounts?.id?.renderButton(
    document.getElementById("googleSignInButton"),
    { theme: "outline", size: "large" }
  );
};

export const setupLoginButtons = () => {
  const loginBtn = document.getElementById("loginBtn") as PrettyButton;
  const loginDialog = document.getElementById("loginDialog") as PrettyDialog;

  initialiseGoogleSignInButton();

  loginDialog.closeButtonIds = ["closeLoginBtn"];
  loginBtn.callback = () => loginDialog.open();

  const ssoToken = getSsoTokenFromLocalStorage();
  if (ssoToken) {
    switch (ssoToken.service) {
      case "google":
        handleGoogleAuthResponse({ credential: ssoToken.token });
        break;
    }
  } else {
    loginDialog.open();
  }

  const logoutBtn = document.getElementById("logoutBtn") as PrettyButton;
  logoutBtn.callback = async () => {
    clearCurrentPlayerStores();
    updateAuthenticationUI();
    hideContinueGameBtn();
    deleteSsoTokenInLocalStorage();
    await requestLogout();
  };

  setupSettingsDialog();
};

export const hideLoginDialog = () => {
  const loginDialog = document.getElementById("loginDialog") as PrettyDialog;
  loginDialog.close();
};

export const updateAuthenticationUI = () => {
  const loginContainer = document.getElementById("loginContainer");
  const authenticatedContainer = document.getElementById(
    "authenticatedContainer"
  );
  if (isAuthenticated()) {
    loginContainer.classList.add("hidden");
    loginContainer.classList.remove("flex");
    authenticatedContainer.classList.add("flex");
    authenticatedContainer.classList.remove("hidden");
  } else {
    loginContainer.classList.add("flex");
    loginContainer.classList.remove("hidden");
    authenticatedContainer.classList.add("hidden");
    authenticatedContainer.classList.remove("flex");
  }
};
