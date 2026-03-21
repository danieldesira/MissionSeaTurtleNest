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
    };
  }
}

export type Direction = keyof typeof Directions;

export type HorizontalDirection = "Left" | "Right";

interface FBLoginResponse {
  status: "connected" | "not_authorized" | "unknown";
  authResponse: {
    accessToken: string;
    expiresIn: string;
    signedRequest: string;
    userID: string;
  } | null;
}
