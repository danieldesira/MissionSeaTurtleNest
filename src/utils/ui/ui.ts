import PrettyDialog from "../../webComponents/dialog/PrettyDialog";
import MenuItem from "../../webComponents/mainMenu/MenuItem";
import { getLastGameLocalStorage } from "../lastGameLocalStorage";
import { isAuthenticated } from "../authentication";
import { initialiseGame, setupOnscreenControlsPosition } from "./gameplay";

export const launchCustomDialog = (title: string, text: string | string[]) => {
  const customDialog = document.getElementById("customDialog") as PrettyDialog;
  customDialog.show();
  customDialog.closeButtonIds = ["closeCustomDialogBtn"];
  const customDialogTitle = document.getElementById("customDialogTitle");
  customDialogTitle.innerText = title;
  const customDialogContent = document.getElementById("customDialogContent");
  if (typeof text === "string") {
    customDialogContent.innerText = text;
  } else {
    customDialogContent.innerText = "";
    text.forEach((line) => {
      const textNode = document.createTextNode(line);
      customDialogContent.appendChild(textNode);
      const br = document.createElement("br");
      customDialogContent.appendChild(br);
    });
  }
};

export const toggleMode = (mode: "game" | "menu") => {
  const menuContainer = document.getElementById("menuContainer");
  const gameContainer = document.getElementById("gameContainer");

  switch (mode) {
    case "game":
      menuContainer.classList.add("hidden");
      menuContainer.classList.remove("flex");
      gameContainer.classList.add("flex");
      gameContainer.classList.remove("hidden");
      setupOnscreenControlsPosition();
      break;
    case "menu":
      menuContainer.classList.add("flex");
      menuContainer.classList.remove("hidden");
      gameContainer.classList.add("hidden");
      gameContainer.classList.remove("flex");
      toggleContinueGameBtn();
      break;
  }
};

export const setupInstructionsDialog = () => {
  const instructionsDialog = document.getElementById(
    "instructionsDialog"
  ) as PrettyDialog;
  instructionsDialog.closeButtonIds = ["closeInstructionsBtn"];

  const instructionsBtn = document.getElementById(
    "instructionsBtn"
  ) as MenuItem;
  instructionsBtn.callback = () => instructionsDialog.show();
};

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

export const disableContextMenu = () =>
  document.body.addEventListener("contextmenu", (event) =>
    event.preventDefault()
  );

export const setupNewGameMenuBtn = () => {
  const newGameBtn = document.getElementById("newGameBtn") as MenuItem;
  newGameBtn.callback = async () => {
    toggleMode("game");
    await initialiseGame(true);
  };
};

export const preventNavigation = () => {
  window.addEventListener("beforeunload", (event) => {
    // Display default dialog before closing
    event.preventDefault();
    event.returnValue = false; // Required by Chrome
  });
};

export const setupContinueGameBtn = () => {
  const continueGameBtn = document.getElementById(
    "continueGameBtn"
  ) as MenuItem;
  continueGameBtn.hide();
  continueGameBtn.callback = async () => {
    toggleMode("game");
    await initialiseGame(false);
  };
};

export const toggleContinueGameBtn = () => {
  const continueGameBtn = document.getElementById(
    "continueGameBtn"
  ) as MenuItem;
  if (isAuthenticated() && getLastGameLocalStorage() !== null) {
    continueGameBtn.show();
  } else {
    continueGameBtn.hide();
  }
};

export const deleteChildren = (parent: HTMLElement) =>
  Array.from(parent.children).forEach((child) => parent.removeChild(child));
