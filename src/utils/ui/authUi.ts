import PrettyDialog from "../../webComponents/dialog/PrettyDialog";
import PrettyButton from "../../webComponents/form/PrettyButton";
import {
  getSsoTokenFromLocalStorage,
  handleSsoAuthResponse,
  isAuthenticated,
  logout,
} from "../authentication";
import { initializeMsalBrowser, handleMicrosoftSignIn } from "../microsoftAuth";
import { $id } from "./domQuery";
import { setupSettingsDialog } from "./settingsDialog";
import { showErrorNotice } from "./waitingNotice";

const initialiseGoogleSignInButton = () => {
  window.google?.accounts?.id?.initialize({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    callback: ({ credential }: { credential: string }) =>
      handleSsoAuthResponse({ provider: "google", credential }),
  });

  window.google?.accounts?.id?.renderButton(
    $id("googleSignInButton") as HTMLElement,
    {
      theme: "outline",
      size: "large",
    },
  );
};

const initialiseMicrosoftSignInButton = async () => {
  try {
    await initializeMsalBrowser();

    const microsoftSignInButton = $id("microsoftSignInButton");
    if (microsoftSignInButton) {
      microsoftSignInButton?.addEventListener("click", async (e) => {
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

const initialiseFacebookSignInButton = () => {
  window.fbAsyncInit = () => {
    window.FB?.init({
      appId: import.meta.env.VITE_FB_APP_ID,
      cookie: true,
      xfbml: true,
      version: "v25.0",
    });

    window.FB?.AppEvents.logPageView();
  };
  window.fbAsyncInit();
  const facebookSignInButton = $id("facebookSignInButton");
  facebookSignInButton?.addEventListener("click", () =>
    window.FB?.login((response) => {
      if (response.authResponse) {
        handleSsoAuthResponse({
          provider: "facebook",
          credential: response.authResponse.accessToken,
        });
      }
    }),
  );
};

export const setupLoginButtons = () => {
  const loginBtn = $id("loginBtn") as PrettyButton;
  const loginDialog = $id("loginDialog") as PrettyDialog;

  initialiseGoogleSignInButton();
  initialiseMicrosoftSignInButton();
  initialiseFacebookSignInButton();

  if (loginDialog) {
    loginDialog.closeButtonIds = ["closeLoginBtn"];
  }
  loginBtn?.on("click", () => loginDialog.open());

  const ssoToken = getSsoTokenFromLocalStorage();
  if (ssoToken) {
    handleSsoAuthResponse(ssoToken);
  } else {
    loginDialog?.open();
  }

  const logoutBtn = $id("logoutBtn") as PrettyButton;
  logoutBtn?.on("click", async () => await logout());

  setupSettingsDialog();
};

export const hideLoginDialog = () => {
  const loginDialog = $id("loginDialog") as PrettyDialog;
  loginDialog?.close();
};

export const updateAuthenticationUI = () => {
  const loginContainer = $id("loginContainer");
  const authenticatedContainer = $id("authenticatedContainer");
  if (isAuthenticated()) {
    loginContainer?.classList.add("hidden");
    loginContainer?.classList.remove("flex");
    authenticatedContainer?.classList.add("flex");
    authenticatedContainer?.classList.remove("hidden");
  } else {
    loginContainer?.classList.add("flex");
    loginContainer?.classList.remove("hidden");
    authenticatedContainer?.classList.add("hidden");
    authenticatedContainer?.classList.remove("flex");
  }
};
