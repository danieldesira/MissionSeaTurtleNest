import { saveGame } from "../../services/api";
import { game } from "../../singletons/Game";
import PrettyDialog from "../../webComponents/dialog/PrettyDialog";
import type PrettyButton from "../../webComponents/form/PrettyButton";
import type GameControl from "../../webComponents/gameplay/GameControl";
import type GameGauge from "../../webComponents/gameplay/GameGauge";
import { isAuthenticated } from "../authentication";
import { resizeCanvas } from "../generic";
import { toggleMode } from "./mainMenu";
import {
  hideWaitingNotice,
  showErrorNotice,
  showWaitingNotice,
} from "./waitingNotice";
import { showLoginInvitationDialog } from "./loginInvitationDialog";
import { deleteChildren } from "./ui";
import { formatLevel } from "./scores";
import type { LevelCharacter } from "../../levels/types";
import { updateXpSpan } from "./xp";
import type { ILevel } from "../../levels/interfaces";
import type { CharacterGameClassification } from "../../characters/types";
import { controlSettingsStore } from "../../inMemoryStores/ControlSettingsStore";
import { lastGameStore } from "../../inMemoryStores/LastGameStore";
import { $, $id } from "./domQuery";

export const setupGameControls = () => {
  const upControl = $id("upControl") as GameControl;
  upControl.callback = () => game.turtle.moveUp();
  const downControl = $id("downControl") as GameControl;
  downControl.callback = () => game.turtle.moveDown();
  const leftControl = $id("leftControl") as GameControl;
  leftControl.callback = () => game.turtle.moveLeft();
  const rightControl = $id("rightControl") as GameControl;
  rightControl.callback = () => game.turtle.moveRight();
};

export const setupOnscreenControlsPosition = () => {
  const onscreenControls = $id("onscreenControls");
  if (controlSettingsStore.screenControlsPosition === "Left") {
    onscreenControls?.classList.add("left-1");
    onscreenControls?.classList.remove("right-1");
  } else {
    onscreenControls?.classList.add("right-1");
    onscreenControls?.classList.remove("left-1");
  }
};

type GameEndDialogOptions = {
  title: string;
  text: string;
  completeWithin5Mins?: boolean;
  remainingResetsRewards?: number;
  perfectGame?: boolean;
};

export const launchGameEndDialog = ({
  title,
  text,
  completeWithin5Mins = false,
  remainingResetsRewards = 0,
  perfectGame = false,
}: GameEndDialogOptions) => {
  const gameEndDialog = $id("gameEndDialog") as PrettyDialog;
  gameEndDialog.open();
  gameEndDialog.closeButtonIds = ["gameEndDialogCloseBtn"];
  const gameEndDialogTitle = $id("gameEndDialogTitle");
  if (gameEndDialogTitle) {
    gameEndDialogTitle.innerText = title;
  }
  const gameEndDialogContent = $id("gameEndDialogContent");
  if (gameEndDialogContent) {
    deleteChildren(gameEndDialogContent);
  }
  const messageSpan = document.createElement("span");
  messageSpan.innerText = text;
  gameEndDialogContent?.appendChild(messageSpan);

  if (completeWithin5Mins) {
    gameEndDialogContent?.appendChild(document.createElement("br"));
    const messageSpan = document.createElement("span");
    messageSpan.innerText = "Under 5 minutes: +300XP";
    gameEndDialogContent?.appendChild(messageSpan);
  }

  if (remainingResetsRewards) {
    gameEndDialogContent?.appendChild(document.createElement("br"));
    const messageSpan = document.createElement("span");
    messageSpan.innerText = `Remaining resets rewards: +${remainingResetsRewards}`;
    gameEndDialogContent?.appendChild(messageSpan);
  }

  if (perfectGame) {
    gameEndDialogContent?.appendChild(document.createElement("br"));
    const messageSpan = document.createElement("span");
    messageSpan.innerText = "Perfect game: +200XP";
    gameEndDialogContent?.appendChild(messageSpan);
  }

  if (game.isPersonalBest && gameEndDialogContent) {
    addPersonalBestLineToGameEndDialog(gameEndDialogContent);
  }
};

export const setupGameShareBtn = () => {
  const shareGameBtn = $id("gameEndDialogShareBtn") as PrettyButton;
  shareGameBtn.on("click", async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Mission Sea Turtle Nest",
          text: `I just ${game.currentLevelNo === 9 ? "won" : `reached level ${game.currentLevelNo}`} with ${game.xp} points in Mission Sea Turtle Nest!`,
          url: window.location.href,
        });
      } catch {
        showErrorNotice("Failed to share the game.", 500);
      }
    }
  });
};

export const updateGauge = (
  id: "lifeGauge" | "foodGauge" | "apetiteGauge" | "oxygenGauge",
  value: number,
) => {
  const gauge = $id(id) as GameGauge;
  gauge.currentValue = value;
};

export const setupResumeBtn = () => {
  const gamePausedDialog = $id("gamePausedDialog") as PrettyDialog;
  gamePausedDialog.closeButtonIds = ["resumeBtn"];
};

const showGamePausedDialog = () => {
  const gamePausedDialog = $id("gamePausedDialog") as PrettyDialog;
  gamePausedDialog.open();
};

export const setupPauseBtn = () => {
  const pauseBtn = $id("pauseBtn") as PrettyButton;
  pauseBtn.on("click", () => showGamePausedDialog());
};

export const initialiseGame = async (isNewGame: boolean) => {
  const canvas = $id("gameCanvas") as HTMLCanvasElement;
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
      lastGame: lastGameStore.store!,
      timestamp: new Date().getTime(),
    });
    lastGameStore.isUploaded = true;
  } catch {
    await showErrorNotice("There was a problem uploading game progress!", 300);
    setTimeout(uploadGameProgress, 500);
  } finally {
    hideWaitingNotice();
  }
};

export const setupBackToMenuBtn = () => {
  const backBtn = $id("backBtn") as PrettyButton;
  backBtn.on("click", async () => await handleBackToMainMenu());
};

const handleBackToMainMenu = async () => {
  if (isAuthenticated()) {
    game.exit();
    toggleMode("menu");
    await uploadGameProgress();
  } else {
    showLoginInvitationDialog();
  }
};

export const setupCanvasSize = () => {
  window.addEventListener("resize", () => {
    if (game.level?.bgImg) {
      const canvas = $id("gameCanvas") as HTMLCanvasElement;
      resizeCanvas(canvas, game.level.bgImg);
    }
  });
};

export const setupGamePauseOnDialogOpen = () =>
  Array.from($("pretty-dialog")).forEach((dialog) => {
    (dialog as PrettyDialog).openCallback = () => game.pause();
    (dialog as PrettyDialog).closeCallback = () => {
      if (!PrettyDialog.isAnyDialogOpen()) {
        game.resume();
      }
    };
  });

const addPersonalBestLineToGameEndDialog = (
  gameEndDialogContent: HTMLElement,
) => {
  const br = document.createElement("br");
  gameEndDialogContent.appendChild(br);
  const messageSpan = document.createElement("span");
  messageSpan.innerText = `Congratulations, this is your personal best score! ${
    game.xp
  } points, ${formatLevel(game.currentLevelNo)}.`;
  gameEndDialogContent.appendChild(messageSpan);
};

export const getCanvas = () => $id("gameCanvas") as HTMLCanvasElement;

export const launchHeartMatingAnimation = async () => {
  const heartMatingAnimation = $id("heartMatingAnimation");
  heartMatingAnimation?.classList.add("flex");
  heartMatingAnimation?.classList.remove("hidden");
  game.pause();
  await new Promise((resolve) => setTimeout(resolve, 1500));
  game.resume();
  heartMatingAnimation?.classList.add("hidden");
  heartMatingAnimation?.classList.remove("flex");
};

export const launchLevelStartDialog = ({
  title,
  levelDescription,
  initialCharacters,
  spawnableObstaclesPer30Second,
}: ILevel) => {
  const levelStartDialog = $id("levelStartDialog") as PrettyDialog;
  levelStartDialog.open();

  const levelStartDialogTitle = $id("levelStartDialogTitle");
  if (levelStartDialogTitle) {
    levelStartDialogTitle.innerText = `Level ${game.currentLevelNo} - ${title}`;
  }

  const levelStartDialogMessage = $id("levelStartDialogMessage");
  if (levelStartDialogMessage) {
    levelStartDialogMessage.innerText = levelDescription;
  }

  const levelStartDialogObstacles = $id("levelStartDialogObstacles");
  if (levelStartDialogObstacles) {
    populateCharacterList(
      spawnableObstaclesPer30Second
        ? initialCharacters.concat(spawnableObstaclesPer30Second)
        : initialCharacters,
      ["Obstacle"],
      levelStartDialogObstacles,
    );
  }

  const levelStartDialogPrey = $id("levelStartDialogPrey");
  if (levelStartDialogPrey) {
    populateCharacterList(
      initialCharacters,
      ["Prey", "PackPrey"],
      levelStartDialogPrey,
    );
  }
};

const populateCharacterList = (
  levelCharacterList: LevelCharacter[],
  characterTypes: CharacterGameClassification[],
  container: HTMLElement,
) => {
  deleteChildren(container);
  new Set(
    levelCharacterList
      .map(({ Constructor }) => Constructor)
      .filter((Constructor) =>
        characterTypes.includes(new Constructor().gameClassification),
      ),
  ).forEach((Constructor) => {
    const characterContainer = document.createElement("div");
    characterContainer.classList.add(
      "flex",
      "items-center",
      "gap-1",
      "bg-slate-500",
      "rounded-sm",
      "p-1",
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
  const levelStartDialog = $id("levelStartDialog") as PrettyDialog;
  levelStartDialog.closeButtonIds = ["levelStartDialogCloseBtn"];
};

export const setupKeyboardShortcuts = () => {
  document.addEventListener("keydown", async (event) => {
    if (game.isGameScreenActive && !game.isPaused) {
      switch (event.key) {
        case "Escape":
          event.preventDefault();
          event.stopPropagation();
          await handleBackToMainMenu();
          break;
        case " ":
          showGamePausedDialog();
          break;
      }
    }
  });
};
