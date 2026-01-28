export const showAssetLoadingOverlay = (message: string) => {
  const overlay = document.getElementById(
    "assetLoadingOverlay",
  ) as HTMLDialogElement;
  overlay.showModal();

  updateAssetLoadingOverlayText(message);
};

const updateAssetLoadingOverlayText = (message: string) => {
  const overlayText = document.getElementById("assetLoadingOverlayText");
  overlayText.innerText = message;
};

export const hideAssetLoadingOverlay = () => {
  const overlay = document.getElementById(
    "assetLoadingOverlay",
  ) as HTMLDialogElement;
  overlay.close();
};

export const updateAssetLoadingProgressBar = (increment: number) => {
  const progressBar = document.getElementById(
    "assetLoadingProgressBar",
  ) as HTMLProgressElement;
  progressBar.value += increment;
};
