import { $id } from "./domQuery";

export const showOverlay = (message: string) => {
  const overlay = $id("overlay") as HTMLDialogElement;
  overlay?.showModal();

  updateOverlayText(message);
};

const updateOverlayText = (message: string) => {
  const overlayText = $id("overlayText");
  if (overlayText) {
    overlayText.innerText = message;
  }
};

export const hideOverlay = () => {
  const overlay = $id("overlay") as HTMLDialogElement;
  overlay?.close();
};
