import { $id } from "./domQuery";

export const showAssetLoadingOverlay = (message: string) => {
  const overlay = $id("assetLoadingOverlay") as HTMLDialogElement;
  overlay?.showModal();

  updateAssetLoadingOverlayText(message);
};

const updateAssetLoadingOverlayText = (message: string) => {
  const overlayText = $id("assetLoadingOverlayText");
  if (overlayText) {
    overlayText.innerText = message;
  }
};

export const hideAssetLoadingOverlay = () => {
  const overlay = $id("assetLoadingOverlay") as HTMLDialogElement;
  overlay?.close();
};

export const updateAssetLoadingProgressBar = (increment: number) => {
  const progressBar = $id("assetLoadingProgressBar") as HTMLProgressElement;
  if (progressBar) {
    progressBar.value += increment;
  }
};
