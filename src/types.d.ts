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
