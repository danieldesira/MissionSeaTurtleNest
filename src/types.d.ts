import { Directions } from "./constants";

export {};

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (options: unknown) => void;
          renderButton: (element: HTMLElement, options: unknown) => void;
        };
      };
    };
    lucide?: {
      createIcons: () => void;
    };
    msal?: {
      PublicClientApplication: new (config: unknown) => unknown;
    };
    FB?: {
      getLoginStatus: (callback: (response: FBLoginResponse) => void) => void;
      login: (callback: (response: FBLoginResponse) => void) => void;
      logout: () => void;
      AppEvents: {
        logPageView: () => void;
      };
      init: (options: FBInitOptions) => void;
    };
    fbAsyncInit?: () => void;
  }
}

export type Direction = keyof typeof Directions;

export type HorizontalDirection = "Left" | "Right";

export interface FBLoginResponse {
  status: "connected" | "not_authorized" | "unknown";
  authResponse: {
    accessToken: string;
    expiresIn: string;
    signedRequest: string;
    userID: string;
  } | null;
}

type FBInitOptions = {
  appId: string;
  cookie: boolean;
  xfbml: boolean;
  version: "v25.0";
};
