export const showOverlay = (message: string) => {
  const overlay = document.getElementById("overlay") as HTMLDialogElement;
  overlay.showModal();

  updateOverlayText(message);
};

const updateOverlayText = (message: string) => {
  const overlayText = document.getElementById("overlayText");
  overlayText.innerText = message;
};

export const hideOverlay = () => {
  const overlay = document.getElementById("overlay") as HTMLDialogElement;
  overlay.close();
};
