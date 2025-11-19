import { saveGame } from "../../services/api";
import ControlSettingsStore from "../../singletons/cacheStores/ControlSettingsStore";
import Game from "../../singletons/Game";
import PrettyDialog from "../../webComponents/dialog/PrettyDialog";
import PrettyButton from "../../webComponents/form/PrettyButton";
import GameControl from "../../webComponents/gameplay/GameControl";
import GameGauge from "../../webComponents/gameplay/GameGauge";
import { isAuthenticated } from "../authentication";
import { resizeCanvas } from "../generic";
import {
  getLastGameLocalStorage,
  getLastGameTimestampLocalStorage,
} from "../lastGameLocalStorage";
import { toggleMode } from "./mainMenu";
import { launchCustomDialog } from "./customDialog";
import { hideWaitingNotice, showWaitingNotice } from "./waitingNotice";
import { showLoginInvitationDialog } from "./loginInvitationDialog";
import { deleteChildren } from "./ui";
import { formatLevelAsText } from "./scores";

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

export const setupOnscreenControlsPosition = () => {
  const onscreenControls = document.getElementById("onscreenControls");
  if (ControlSettingsStore.instance.screenControlsPosition === "Left") {
    onscreenControls.classList.add("left-1");
    onscreenControls.classList.remove("right-1");
  } else {
    onscreenControls.classList.add("right-1");
    onscreenControls.classList.remove("left-1");
  }
};

export const launchGameEndDialog = (title: string, text: string) => {
  const gameEndDialog = document.getElementById(
    "gameEndDialog"
  ) as PrettyDialog;
  gameEndDialog.open();
  gameEndDialog.closeButtonIds = ["gameEndDialogCloseBtn"];
  const gameEndDialogTitle = document.getElementById("gameEndDialogTitle");
  gameEndDialogTitle.innerText = title;
  const gameEndDialogContent = document.getElementById("gameEndDialogContent");
  deleteChildren(gameEndDialogContent);
  const messageSpan = document.createElement("span");
  messageSpan.innerText = text;
  gameEndDialogContent.appendChild(messageSpan);

  if (Game.instance.isPersonalBest) {
    addPersonalBestLineToGameEndDialog(gameEndDialogContent);
  }
};

export const setupGameShareBtn = () => {
  const shareGameBtn = document.getElementById(
    "gameEndDialogShareBtn"
  ) as PrettyButton;
  shareGameBtn.callback = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Mission Sea Turtle Nest",
          text: `I just reached level ${Game.instance.currentLevelNo} with ${Game.instance.xp} points in Mission Sea Turtle Nest!`,
          url: window.location.href,
        });
      } catch {
        launchCustomDialog("Share failed", "Failed to share the game.");
      }
    }
  };
};

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
  gamePausedDialog.openCallback = () => Game.instance.pause();
  gamePausedDialog.closeCallback = () => Game.instance.resume();
};

const showGamePausedDialog = () => {
  const gamePausedDialog = document.getElementById(
    "gamePausedDialog"
  ) as PrettyDialog;
  gamePausedDialog.open();
};

export const setupPauseBtn = () => {
  const pauseBtn = document.getElementById("pauseBtn");
  pauseBtn.addEventListener("click", () => showGamePausedDialog());
};

export const initialiseGame = async (isNewGame: boolean) => {
  const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  await Game.instance.start({
    canvas,
    isNewGame,
  });
  updateXpSpan();
};

export const setupAppVisibilityHandler = () => {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && Game.instance.isGameScreenActive) {
      showGamePausedDialog();
    }
  });
};

export const setupBackToMenuBtn = () => {
  const backBtn = document.getElementById("backBtn") as PrettyButton;
  backBtn.callback = async () => {
    if (isAuthenticated()) {
      Game.instance.exit();
      toggleMode("menu");
      showWaitingNotice("Uploading game progress...");
      try {
        await saveGame({
          lastGame: JSON.parse(getLastGameLocalStorage()),
          timestamp: Number(getLastGameTimestampLocalStorage()),
        });
      } catch {
        launchCustomDialog(
          "Game progress upload",
          "There was a problem uploading game progress!"
        );
      } finally {
        hideWaitingNotice();
      }
    } else {
      showLoginInvitationDialog();
    }
  };
};

export const setupCanvasSize = () => {
  const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  window.addEventListener("resize", () => resizeCanvas(canvas));
};

export const setupGamePauseOnDialogOpen = () =>
  Array.from(document.querySelectorAll("pretty-dialog")).forEach(
    (dialog: PrettyDialog) => {
      dialog.openCallback = () => Game.instance.pause();
      dialog.closeCallback = () => Game.instance.resume();
    }
  );

const addPersonalBestLineToGameEndDialog = (
  gameEndDialogContent: HTMLElement
) => {
  const br = document.createElement("br");
  gameEndDialogContent.appendChild(br);
  const messageSpan = document.createElement("span");
  messageSpan.innerText = `Congratulations, this is your personal best score! ${
    Game.instance.xp
  } points, ${formatLevelAsText(Game.instance.currentLevelNo)}.`;
  gameEndDialogContent.appendChild(messageSpan);
};

export const getCanvas = () =>
  document.getElementById("gameCanvas") as HTMLCanvasElement;

export const launchHeartMatingAnimation = async () => {
  const heartMatingAnimation = document.getElementById("heartMatingAnimation");
  heartMatingAnimation.classList.add("flex");
  heartMatingAnimation.classList.remove("hidden");
  Game.instance.pause();
  await new Promise((resolve) => setTimeout(resolve, 1500));
  Game.instance.resume();
  heartMatingAnimation.classList.add("hidden");
  heartMatingAnimation.classList.remove("flex");
};
