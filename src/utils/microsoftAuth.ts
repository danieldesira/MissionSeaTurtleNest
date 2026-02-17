import { handleSsoAuthResponse } from "./authentication";

interface MsalBrowser {
  PublicClientApplication: new (config: unknown) => unknown;
}

interface MsalInstance {
  initialize: () => Promise<void>;
  loginPopup: (options: unknown) => Promise<unknown>;
  loginRedirect: (options: unknown) => Promise<unknown>;
  logout: () => Promise<void>;
  getAllAccounts: () => unknown[];
  acquireTokenSilent: (options: unknown) => Promise<unknown>;
}

let msalInstance: MsalInstance | null = null;

export const initializeMsalBrowser = async () => {
  // Access MSAL from the window object (loaded via script tag)
  const msalBrowser = (window as unknown as Record<string, unknown>)
    .msal as MsalBrowser;
  if (!msalBrowser || !msalBrowser.PublicClientApplication) {
    console.error("MSAL Browser library not loaded");
    return;
  }

  const msalConfig = {
    auth: {
      clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID as string,
      authority: "https://login.microsoftonline.com/common",
      redirectUri: window.location.origin,
    },
  };

  msalInstance = new msalBrowser.PublicClientApplication(
    msalConfig,
  ) as unknown as MsalInstance;
  await msalInstance.initialize();

  return msalInstance;
};

export const getMsalInstance = () => msalInstance;

export const handleMicrosoftSignIn = async () => {
  const instance = getMsalInstance();
  if (!instance) {
    console.error("MSAL instance not initialized");
    return;
  }

  try {
    const response = await instance.loginPopup({
      scopes: ["openid", "profile", "email"],
    }) as { idToken: string };

    if (response.idToken) {
      await handleSsoAuthResponse({
        provider: "microsoft",
        credential: response.idToken,
      });
    }
  } catch (error) {
    console.error("Microsoft login error:", error);
    throw error;
  }
};

export const handleMicrosoftSignInRedirect = async () => {
  const instance = getMsalInstance();
  if (!instance) {
    console.error("MSAL instance not initialized");
    return;
  }

  try {
    const response = await instance.loginRedirect({
      scopes: ["openid", "profile", "email"],
    });

    return response;
  } catch (error) {
    console.error("Microsoft login redirect error:", error);
    throw error;
  }
};

export const getMicrosoftAccessToken = async () => {
  const instance = getMsalInstance();
  if (!instance) {
    console.error("MSAL instance not initialized");
    return null;
  }

  const accounts = instance.getAllAccounts();
  if (accounts.length === 0) {
    return null;
  }

  try {
    const response = (await instance.acquireTokenSilent({
      scopes: ["openid", "profile", "email"],
      account: accounts[0],
    })) as { accessToken: string };

    return response.accessToken;
  } catch (error) {
    console.error("Failed to acquire token silently:", error);
    return null;
  }
};

export const handleMicrosoftLogout = async () => {
  const instance = getMsalInstance();
  if (!instance) {
    return;
  }

  try {
    await instance.logout();
  } catch (error) {
    console.error("Microsoft logout error:", error);
  }
};
