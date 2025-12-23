import { lastGameStore } from "../../inMemoryStores/LastGameStore";
import PrettyDialog from "../../webComponents/dialog/PrettyDialog";
import PrettyButton from "../../webComponents/form/PrettyButton";
import MenuItem from "../../webComponents/mainMenu/MenuItem";
import { isAuthenticated } from "../authentication";
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
  instructionsBtn.callback = () => instructionsDialog.open();
};

export const setupNewGameMenuBtn = () => {
  const newGameBtn = document.getElementById("newGameBtn") as MenuItem;
  newGameBtn.callback = async () => {
    if (isAuthenticated() && lastGameStore.hasData()) {
      showGameOverwriteDialog();
    } else {
      await initGame(true);
    }
  };
};

export const setupContinueGameBtn = () => {
  const continueGameBtn = document.getElementById(
    "continueGameBtn"
  ) as MenuItem;
  continueGameBtn.hide();
  continueGameBtn.callback = async () => await initGame(false);
};

export const toggleContinueGameBtn = () => {
  const continueGameBtn = document.getElementById(
    "continueGameBtn"
  ) as MenuItem;
  if (isAuthenticated() && lastGameStore.hasData()) {
    continueGameBtn.show();
  } else {
    continueGameBtn.hide();
  }
};

export const hideContinueGameBtn = () => {
  const continueGameBtn = document.getElementById(
    "continueGameBtn"
  ) as MenuItem;
  continueGameBtn.hide();
};

const showGameOverwriteDialog = () => {
  const gameOverwriteDialog = document.getElementById(
    "gameOverwriteDialog"
  ) as PrettyDialog;
  gameOverwriteDialog.open();
};

export const setupGameOverwriteDialog = () => {
  const gameOverwriteDialog = document.getElementById(
    "gameOverwriteDialog"
  ) as PrettyDialog;
  gameOverwriteDialog.closeButtonIds = [
    "cancelNewGameBtn",
    "confirmNewGameBtn",
  ];

  const confirmNewGameBtn = document.getElementById(
    "confirmNewGameBtn"
  ) as PrettyButton;
  confirmNewGameBtn.callback = async () => await initGame(true);
};

const initGame = async (newGame: boolean) => {
  toggleMode("game");
  await initialiseGame(newGame);
};
