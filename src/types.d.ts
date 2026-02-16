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
  }
}

export type Direction = keyof typeof Directions;

export type HorizontalDirection = "Left" | "Right";
