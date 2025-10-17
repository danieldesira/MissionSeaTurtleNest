import Game from "../../singletons/Game";
import PrettyDialog from "../../webComponents/dialog/PrettyDialog";
import PrettyButton from "../../webComponents/form/PrettyButton";
import GameControl from "../../webComponents/gameplay/GameControl";
import { version } from "../../../package.json";
import MenuItem from "../../webComponents/mainMenu/MenuItem";
import GameGauge from "../../webComponents/gameplay/GameGauge";
import { resizeCanvas } from "../generic";
import { getLastGameLocalStorage } from "../lastGameLocalStorage";
import { runGameLoop } from "../../gameLoop";
import GameData from "../../restoreGame/GameData";
import {
  clearCurrentPlayerStores,
  handleGoogleAuthResponse,
  isAuthenticated,
} from "../authentication";
import { requestLogout } from "../../services/api";
import ControlSettingsStore from "../../singletons/cacheStores/ControlSettingsStore";
import { setupSettingsDialog } from "./settingsDialog";

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

export const setupGameControls = () => {
  const upControl = document.getElementById("upControl") as GameControl;
  upControl.callback = () => Game.instance.turtle.moveUp();
  const downControl = document.getElementById("downControl") as GameControl;
  downControl.callback = () => Game.instance.turtle.moveDown();
  const leftControl = document.getElementById("leftControl") as GameControl;
  leftControl.callback = () => Game.instance.turtle.moveLeft();
  const rightControl = document.getElementById("rightControl") as GameControl;
  rightControl.callback = () => Game.instance.turtle.moveRight();
};

const setupOnscreenControlsPosition = () => {
  const onscreenControls = document.getElementById("onscreenControls");
  if (ControlSettingsStore.instance.screenControlsPosition === "Left") {
    onscreenControls.classList.add("left-1");
    onscreenControls.classList.remove("right-1");
  } else {
    onscreenControls.classList.add("right-1");
    onscreenControls.classList.remove("left-1");
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

export const launchGameEndDialog = (title: string, text: string) => {
  const gameEndDialog = document.getElementById(
    "gameEndDialog"
  ) as PrettyDialog;
  gameEndDialog.show();
  gameEndDialog.closeButtonIds = ["gameEndDialogCloseBtn"];
  const gameEndDialogTitle = document.getElementById("gameEndDialogTitle");
  gameEndDialogTitle.innerText = title;
  const gameEndDialogContent = document.getElementById("gameEndDialogContent");
  gameEndDialogContent.innerText = text;
};

export const setupGameShareBtn = () => {
  const shareGameBtn = document.getElementById(
    "gameEndDialogShareBtn"
  ) as PrettyButton;
  shareGameBtn.callback = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Turtle Core",
          text: `I just reached level ${Game.instance.currentLevelNo} with ${Game.instance.xp} points in Turtle Core!`,
          url: window.location.href,
        });
      } catch {
        launchCustomDialog("Share failed", "Failed to share the game.");
      }
    }
  };
};

export const setupAboutDialog = () => {
  const versionLink = document.getElementById("version");
  versionLink.innerText = version;
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

export const updateXpSpan = () => {
  const xpSpan = document.getElementById("xpSpan");
  xpSpan.innerText = Game.instance.xp.toString();
};

export const updateGauge = (
  id: "lifeGauge" | "foodGauge" | "apetiteGauge" | "oxygenGauge",
  value: number
) => {
  const gauge = document.getElementById(id) as GameGauge;
  gauge.currentValue = value;
};

export const setupResumeBtn = () => {
  const gamePausedDialog = document.getElementById(
    "gamePausedDialog"
  ) as PrettyDialog;
  gamePausedDialog.closeButtonIds = ["resumeBtn"];
};

const showGamePausedDialog = () => {
  const gamePausedDialog = document.getElementById(
    "gamePausedDialog"
  ) as PrettyDialog;
  gamePausedDialog.show();
};

export const setupPauseBtn = () => {
  const pauseBtn = document.getElementById("pauseBtn");
  pauseBtn.addEventListener("click", () => showGamePausedDialog());
};

const initialiseGame = async (isNewGame: boolean) => {
  const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  await Game.instance.start({
    canvas,
    isNewGame,
    gameData: JSON.parse(getLastGameLocalStorage()) as GameData,
  });
  await runGameLoop(canvas);
  updateXpSpan();
};

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

export const setupCanvasSize = () => {
  const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  window.addEventListener("resize", () => resizeCanvas(canvas));
};

export const setupContinueGameBtn = () => {
  const continueGameBtn = document.getElementById(
    "continueGameBtn"
  ) as MenuItem;
  continueGameBtn.hide();
  continueGameBtn.callback = () => {
    toggleMode("game");
    // Add logic to start a new game here
  };
};

export const setupBackToMenuBtn = () => {
  const backBtn = document.getElementById("backBtn") as PrettyButton;
  backBtn.callback = () => {
    Game.instance.exit();
    toggleMode("menu");
  };
};

export const setupAppVisibilityHandler = () => {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && Game.instance.isGameScreenActive) {
      showGamePausedDialog();
    }
  });
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
