import { saveGame } from "../../services/api";
import { game } from "../../singletons/Game";
import type PrettyDialog from "../../webComponents/dialog/PrettyDialog";
import type PrettyButton from "../../webComponents/form/PrettyButton";
import type GameControl from "../../webComponents/gameplay/GameControl";
import type GameGauge from "../../webComponents/gameplay/GameGauge";
import { isAuthenticated } from "../authentication";
import { resizeCanvas } from "../generic";
import { toggleMode } from "./mainMenu";
import { launchCustomDialog } from "./customDialog";
import { hideWaitingNotice, showWaitingNotice } from "./waitingNotice";
import { showLoginInvitationDialog } from "./loginInvitationDialog";
import { deleteChildren } from "./ui";
import { formatLevelAsText } from "./scores";
import type { LevelCharacter } from "../../levels/types";
import { updateXpSpan } from "./xp";
import type { ILevel } from "../../levels/interfaces";
import type { CharacterGameClassification } from "../../characters/types";
import { controlSettingsStore } from "../../inMemoryStores/ControlSettingsStore";
import { lastGameStore } from "../../inMemoryStores/LastGameStore";

export const setupGameControls = () => {
  const upControl = document.getElementById("upControl") as GameControl;
  upControl.callback = () => game.turtle.moveUp();
  const downControl = document.getElementById("downControl") as GameControl;
  downControl.callback = () => game.turtle.moveDown();
  const leftControl = document.getElementById("leftControl") as GameControl;
  leftControl.callback = () => game.turtle.moveLeft();
  const rightControl = document.getElementById("rightControl") as GameControl;
  rightControl.callback = () => game.turtle.moveRight();
};

export const setupOnscreenControlsPosition = () => {
  const onscreenControls = document.getElementById("onscreenControls");
  if (controlSettingsStore.screenControlsPosition === "Left") {
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

  if (game.isPersonalBest) {
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
          text: `I just reached level ${game.currentLevelNo} with ${game.xp} points in Mission Sea Turtle Nest!`,
          url: window.location.href,
        });
      } catch {
        launchCustomDialog("Share failed", "Failed to share the game.");
      }
    }
  };
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
  gamePausedDialog.open();
};

export const setupPauseBtn = () => {
  const pauseBtn = document.getElementById("pauseBtn");
  pauseBtn.addEventListener("click", () => showGamePausedDialog());
};

export const initialiseGame = async (isNewGame: boolean) => {
  const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  await game.start({
    canvas,
    isNewGame,
  });
  updateXpSpan();
};

export const setupAppVisibilityHandler = () => {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && game.isGameScreenActive) {
      showGamePausedDialog();
    }
  });
};

const uploadGameProgress = async () => {
  showWaitingNotice("Uploading game progress...");
  try {
    await saveGame({
      lastGame: lastGameStore.store,
      timestamp: new Date().getTime(),
    });
    lastGameStore.isUploaded = true;
  } catch {
    launchCustomDialog(
      "Game progress upload",
      "There was a problem uploading game progress!"
    );
    setTimeout(uploadGameProgress, 500);
  } finally {
    hideWaitingNotice();
  }
};

export const setupBackToMenuBtn = () => {
  const backBtn = document.getElementById("backBtn") as PrettyButton;
  backBtn.callback = async () => {
    if (isAuthenticated()) {
      game.exit();
      toggleMode("menu");
      await uploadGameProgress();
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
      dialog.openCallback = () => game.pause();
      dialog.closeCallback = () => game.resume();
    }
  );

const addPersonalBestLineToGameEndDialog = (
  gameEndDialogContent: HTMLElement
) => {
  const br = document.createElement("br");
  gameEndDialogContent.appendChild(br);
  const messageSpan = document.createElement("span");
  messageSpan.innerText = `Congratulations, this is your personal best score! ${
    game.xp
  } points, ${formatLevelAsText(game.currentLevelNo)}.`;
  gameEndDialogContent.appendChild(messageSpan);
};

export const getCanvas = () =>
  document.getElementById("gameCanvas") as HTMLCanvasElement;

export const launchHeartMatingAnimation = async () => {
  const heartMatingAnimation = document.getElementById("heartMatingAnimation");
  heartMatingAnimation.classList.add("flex");
  heartMatingAnimation.classList.remove("hidden");
  game.pause();
  await new Promise((resolve) => setTimeout(resolve, 1500));
  game.resume();
  heartMatingAnimation.classList.add("hidden");
  heartMatingAnimation.classList.remove("flex");
};

export const launchLevelStartDialog = ({
  title,
  levelDescription,
  initialCharacters,
  spawnableObstaclesPer30Second,
}: ILevel) => {
  const levelStartDialog = document.getElementById(
    "levelStartDialog"
  ) as PrettyDialog;
  levelStartDialog.open();

  const levelStartDialogTitle = document.getElementById(
    "levelStartDialogTitle"
  );
  levelStartDialogTitle.innerText = `Level ${game.currentLevelNo} - ${title}`;

  const levelStartDialogMessage = document.getElementById(
    "levelStartDialogMessage"
  );
  levelStartDialogMessage.innerText = levelDescription;

  const levelStartDialogObstacles = document.getElementById(
    "levelStartDialogObstacles"
  );
  populateCharacterList(
    spawnableObstaclesPer30Second
      ? initialCharacters.concat(spawnableObstaclesPer30Second)
      : initialCharacters,
    ["Obstacle"],
    levelStartDialogObstacles
  );

  const levelStartDialogPrey = document.getElementById("levelStartDialogPrey");
  populateCharacterList(
    initialCharacters,
    ["Prey", "PackPrey"],
    levelStartDialogPrey
  );
};

const populateCharacterList = (
  levelCharacterList: LevelCharacter[],
  characterTypes: CharacterGameClassification[],
  container: HTMLElement
) => {
  deleteChildren(container);
  new Set(
    levelCharacterList
      .map(({ Constructor }) => Constructor)
      .filter((Constructor) =>
        characterTypes.includes(new Constructor().gameClassification)
      )
  ).forEach((Constructor) => {
    const characterContainer = document.createElement("div");
    characterContainer.classList.add(
      "flex",
      "items-center",
      "gap-1",
      "bg-slate-500",
      "rounded-sm",
      "p-1"
    );

    const { imagePath, type } = new Constructor();

    const image = document.createElement("img");
    image.height = 32;
    image.width = 32;
    image.src = imagePath;
    characterContainer.appendChild(image);

    const span = document.createElement("span");
    span.innerText = type;
    characterContainer.appendChild(span);

    container.appendChild(characterContainer);
  });
};

export const setupLevelStartDialog = () => {
  const levelStartDialog = document.getElementById(
    "levelStartDialog"
  ) as PrettyDialog;
  levelStartDialog.closeButtonIds = ["levelStartDialogCloseBtn"];
};
