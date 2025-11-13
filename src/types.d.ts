import { Directions } from "./constants";

export {};

declare global {
  interface Window {
    google?: {
      accounts?: { id?: { initialize: Function; renderButton: Function } };
    };
    lucide?: {
      createIcons: () => void;
    };
  }
}

export type Direction = keyof typeof Directions;
