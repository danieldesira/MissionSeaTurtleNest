import PrettyDialog from "../../webComponents/dialog/PrettyDialog";
import MenuItem from "../../webComponents/mainMenu/MenuItem";
import { isAuthenticated } from "../authentication";
import { getLastGameLocalStorage } from "../lastGameLocalStorage";
import { initialiseGame, setupOnscreenControlsPosition } from "./gameplay";

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

export const setupNewGameMenuBtn = () => {
  const newGameBtn = document.getElementById("newGameBtn") as MenuItem;
  newGameBtn.callback = async () => {
    toggleMode("game");
    await initialiseGame(true);
  };
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
