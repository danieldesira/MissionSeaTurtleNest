import { lastGameStore } from "../../inMemoryStores/LastGameStore";
import type PrettyDialog from "../../webComponents/dialog/PrettyDialog";
import type PrettyButton from "../../webComponents/form/PrettyButton";
import type MenuItem from "../../webComponents/mainMenu/MenuItem";
import { isAuthenticated } from "../authentication";
import { $id } from "./domQuery";
import { initialiseGame, setupOnscreenControlsPosition } from "./gameplay";
import { showRandomHint } from "./hints";

export const toggleMode = (mode: "game" | "menu") => {
  const menuContainer = $id("menuContainer");
  const gameContainer = $id("gameContainer");

  switch (mode) {
    case "game":
      menuContainer?.classList.add("hidden");
      menuContainer?.classList.remove("flex");
      gameContainer?.classList.add("flex");
      gameContainer?.classList.remove("hidden");
      setupOnscreenControlsPosition();
      break;
    case "menu":
      menuContainer?.classList.add("flex");
      menuContainer?.classList.remove("hidden");
      gameContainer?.classList.add("hidden");
      gameContainer?.classList.remove("flex");
      toggleContinueGameBtn();
      showRandomHint();
      break;
  }
};

export const setupNewGameMenuBtn = () => {
  const newGameBtn = $id("newGameBtn") as MenuItem;
  newGameBtn?.on("click", async () => {
    if (isAuthenticated() && lastGameStore.hasData()) {
      showGameOverwriteDialog();
    } else {
      await initGame(true);
    }
  });
};

export const setupContinueGameBtn = () => {
  const continueGameBtn = $id("continueGameBtn") as MenuItem;
  continueGameBtn.hide();
  continueGameBtn?.on("click", async () => await initGame(false));
};

export const toggleContinueGameBtn = () => {
  const continueGameBtn = $id("continueGameBtn") as MenuItem;
  if (isAuthenticated() && lastGameStore.hasData()) {
    continueGameBtn?.show();
  } else {
    continueGameBtn?.hide();
  }
};

export const hideContinueGameBtn = () => {
  const continueGameBtn = $id("continueGameBtn") as MenuItem;
  continueGameBtn?.hide();
};

const showGameOverwriteDialog = () => {
  const gameOverwriteDialog = $id("gameOverwriteDialog") as PrettyDialog;
  gameOverwriteDialog?.open();
};

export const setupGameOverwriteDialog = () => {
  const confirmNewGameBtn = $id("confirmNewGameBtn") as PrettyButton;
  confirmNewGameBtn?.on("click", async () => await initGame(true));
};

const initGame = async (newGame: boolean) => {
  toggleMode("game");
  await initialiseGame(newGame);
};
