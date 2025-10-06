import Game from "../singletons/Game";
import PrettyDialog from "../webComponents/dialog/PrettyDialog";
import PrettyButton from "../webComponents/form/PrettyButton";
import GameControl from "../webComponents/gameplay/GameControl";
import { version } from "../../package.json";
import MenuItem from "../webComponents/mainMenu/MenuItem";
import GameGauge from "../webComponents/gameplay/GameGauge";
import { resizeCanvas } from "./generic";
import { getLastGameLocalStorage } from "./lastGameLocalStorage";
import { runGameLoop } from "../gameLoop";
import GameData from "../restoreGame/GameData";

export const launchCustomDialog = (title: string, text: string) => {
  const customDialog = document.getElementById("customDialog") as PrettyDialog;
  customDialog.isVisible = true;
  const customDialogTitle = document.getElementById("customDialogTitle");
  customDialogTitle.innerText = title;
  const customDialogContent = document.getElementById("customDialogContent");
  customDialogContent.innerText = text;
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

export const toggleMode = (mode: "game" | "menu") => {
  const menuContainer = document.getElementById("menuContainer");
  const gameContainer = document.getElementById("gameContainer");

  switch (mode) {
    case "game":
      menuContainer.classList.add("hidden");
      menuContainer.classList.remove("flex");
      gameContainer.classList.add("flex");
      gameContainer.classList.remove("hidden");
      break;
    case "menu":
      menuContainer.classList.add("flex");
      menuContainer.classList.remove("hidden");
      gameContainer.classList.add("hidden");
      gameContainer.classList.remove("flex");
      break;
  }
};

export const launchGameEndDialog = (title: string, text: string) => {
  const gameEndDialog = document.getElementById(
    "gameEndDialog"
  ) as PrettyDialog;
  gameEndDialog.isVisible = true;
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
  const aboutDialog = document.getElementById("aboutDialog") as PrettyDialog;
  aboutDialog.closeButtonIds = ["closeAboutBtn"];

  const title = document.getElementById("title");
  title.addEventListener("click", () => {
    aboutDialog.isVisible = true;
  });

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
  instructionsBtn.callback = () => {
    instructionsDialog.isVisible = true;
  };
};

export const showOverlay = (message: string) => {
  const overlay = document.getElementById("overlay");
  overlay.classList.remove("opacity-0");
  overlay.classList.add("opacity-90");
  overlay.classList.remove("hidden");
  overlay.classList.add("flex");

  updateOverlayText(message);
};

const updateOverlayText = (message: string) => {
  const overlayText = document.getElementById("overlayText");
  overlayText.innerText = message;
};

export const hideOverlay = () => {
  const overlay = document.getElementById("overlay");
  overlay.classList.add("opacity-0");
  overlay.classList.remove("opacity-90");
  overlay.classList.remove("flex");
  overlay.classList.add("hidden");
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
  const resumeBtn = document.getElementById("resumeBtn") as PrettyButton;
  resumeBtn.callback = () => Game.instance.resume();

  const gamePausedDialog = document.getElementById(
    "gamePausedDialog"
  ) as PrettyDialog;
  gamePausedDialog.closeButtonIds = ["resumeBtn"];
};

const showGamePausedDialog = () => {
  const gamePausedDialog = document.getElementById(
    "gamePausedDialog"
  ) as PrettyDialog;
  gamePausedDialog.isVisible = true;
};

export const setupPauseBtn = () => {
  const pauseBtn = document.getElementById("pauseBtn");
  pauseBtn.addEventListener("click", () => {
    Game.instance.pause();
    showGamePausedDialog();
  });
};

const initialiseGame = async (isNewGame: boolean) => {
  const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  window.addEventListener("resize", () => resizeCanvas(canvas));
  window.addEventListener("beforeunload", (event) => {
    // Display default dialog before closing
    event.preventDefault();
    event.returnValue = false; // Required by Chrome
  });

  await Game.instance.start({
    canvas,
    isNewGame,
    gameData: JSON.parse(getLastGameLocalStorage()) as GameData,
  });
  await runGameLoop(canvas);
};

export const setupNewGameMenuBtn = () => {
  const newGameBtn = document.getElementById("newGameBtn") as MenuItem;
  newGameBtn.callback = async () => {
    toggleMode("game");
    await initialiseGame(true);
  };
};
