import PrettyDialog from "../../webComponents/dialog/PrettyDialog";
import PrettyButton from "../../webComponents/form/PrettyButton";
import {
  getSsoTokenFromLocalStorage,
  handleSsoAuthResponse,
  isAuthenticated,
  logout,
} from "../authentication";
import {
  initializeMsalBrowser,
  handleMicrosoftSignIn,
} from "../microsoftAuth";
import { setupSettingsDialog } from "./settingsDialog";
import { showErrorNotice } from "./waitingNotice";

const initialiseGoogleSignInButton = () => {
  window.google?.accounts?.id?.initialize({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    callback: ({ credential }) =>
      handleSsoAuthResponse({ provider: "google", credential }),
  });

  window.google?.accounts?.id?.renderButton(
    document.getElementById("googleSignInButton"),
    { theme: "outline", size: "large" },
  );
};

const initialiseMicrosoftSignInButton = async () => {
  try {
    await initializeMsalBrowser();

    const microsoftSignInButton = document.getElementById(
      "microsoftSignInButton",
    );
    if (microsoftSignInButton) {
      microsoftSignInButton.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
          await handleMicrosoftSignIn();
        } catch (error) {
          console.error("Microsoft sign-in failed:", error);
          showErrorNotice("Microsoft sign-in failed. Please try again.", 500);
        }
      });
    }
  } catch (error) {
    console.error("Failed to initialize Microsoft Sign-in:", error);
  }
};

export const setupLoginButtons = () => {
  const loginBtn = document.getElementById("loginBtn") as PrettyButton;
  const loginDialog = document.getElementById("loginDialog") as PrettyDialog;

  initialiseGoogleSignInButton();
  initialiseMicrosoftSignInButton();

  loginDialog.closeButtonIds = ["closeLoginBtn"];
  loginBtn.callback = () => loginDialog.open();

  const ssoToken = getSsoTokenFromLocalStorage();
  if (ssoToken) {
    handleSsoAuthResponse(ssoToken);
  } else {
    loginDialog.open();
  }

  const logoutBtn = document.getElementById("logoutBtn") as PrettyButton;
  logoutBtn.callback = async () => await logout();

  setupSettingsDialog();
};

export const hideLoginDialog = () => {
  const loginDialog = document.getElementById("loginDialog") as PrettyDialog;
  loginDialog.close();
};

export const updateAuthenticationUI = () => {
  const loginContainer = document.getElementById("loginContainer");
  const authenticatedContainer = document.getElementById(
    "authenticatedContainer",
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
