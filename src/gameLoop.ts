import Game from "./singletons/Game";
import { paintLevelBg } from "./levels/background";
import { getLevelText, LevelChangeTypes, levelMap } from "./levels/levels";
import stringifyGameData from "./restoreGame/stringifyGameData";
import { deleteLastGame, saveScore } from "./services/api";
import {
  launchCustomDialog,
  launchGameEndDialog,
  toggleMode,
} from "./utils/ui";
import {
  deleteLastGameLocalStorage,
  deleteLastGameTimestampLocalStorage,
  saveLastGameLocalStorage,
  saveLastGameTimestampLocalStorage,
} from "./utils/lastGameLocalStorage";
import { isAuthenticated } from "./utils/generic";
import PersonalBestStore from "./singletons/PersonalBestStore";

export const runGameLoop = async (canvas: HTMLCanvasElement) => {
  if (!Game.instance.isPaused) {
    try {
      const levelChangeType = await checkTurtleAndGameProgress();
      if (levelChangeType === "SameLevel" || levelChangeType === "NewLevel") {
        const context = canvas.getContext("2d");

        paintLevelBg({ canvas, context });
        Game.instance.turtle.paint(context);
        Game.instance.level.paintCharacters(context);

        saveGameProgress();
      } else {
        cancelAnimationFrame(Game.instance.animationTimer);
      }
    } catch (error) {
      throw error;
    }
  }

  Game.instance.animationTimer = requestAnimationFrame(
    async () => await runGameLoop(canvas)
  );
};

const saveGameProgress = () => {
  if (isAuthenticated()) {
    saveLastGameLocalStorage(stringifyGameData());
    saveLastGameTimestampLocalStorage();
  }
};

const checkTurtleAndGameProgress = async (): Promise<LevelChangeTypes> => {
  const mainCharacter = Game.instance.turtle;

  mainCharacter.useFood();
  mainCharacter.recoverApetite();

  if (
    mainCharacter.foodGauge <= 0 ||
    mainCharacter.oxygenGauge <= 0 ||
    mainCharacter.lifeGauge <= 0
  ) {
    await handleLoss();
    return "GameEnd";
  }

  if (mainCharacter.y <= 0) {
    mainCharacter.breath();
  } else {
    mainCharacter.useOxygen();
  }

  const backgroundImage = Game.instance.level.bgImg;
  if (backgroundImage && mainCharacter.x >= backgroundImage.width) {
    return await handleOffBgWidth();
  }

  Game.instance.level.checkIfTurtleMeetsCharacters();

  Game.instance.level.moveCharacters();

  return "SameLevel";
};

const handleOffBgWidth = async (): Promise<LevelChangeTypes> => {
  Game.instance.gainPoints(Game.instance.level.points);
  Game.instance.incrementCurrentLevelNo();
  if (levelMap[Game.instance.currentLevelNo]) {
    await Game.instance.loadNewLevel(true);
    return "NewLevel";
  } else {
    await handleWin();
    return "GameEnd";
  }
};

const deleteLastGameAndSaveScore = async (hasWon: boolean): Promise<void> => {
  try {
    if (isAuthenticated()) {
      await Promise.all([
        deleteLastGame(),
        saveScore({
          points: Game.instance.xp,
          level: Game.instance.currentLevelNo,
          hasWon,
        }),
      ]);
    }
  } catch {
    launchCustomDialog("Error", "Failed to save game score");
  } finally {
    deleteLastGameLocalStorage();
    deleteLastGameTimestampLocalStorage();
  }
};

const checkIfBestPersonalScore = () => {
  if (
    PersonalBestStore.instance.level <= Game.instance.currentLevelNo &&
    PersonalBestStore.instance.points < Game.instance.xp
  ) {
    launchCustomDialog(
      "New Personal Best",
      `Congratulations! ${Game.instance.xp} points at level ${getLevelText(
        Game.instance.currentLevelNo
      )}`
    );
    PersonalBestStore.instance.level = Game.instance.currentLevelNo;
    PersonalBestStore.instance.points = Game.instance.xp;
  }
};

const handleGameEnd = async (hasWon: boolean) => {
  checkIfBestPersonalScore();

  //dispatch(triggerSavingMode()); to do: implement saving screen/overlay in vanilla js
  await deleteLastGameAndSaveScore(hasWon);
  toggleMode("menu");
};

const handleLoss = async () => {
  await handleGameEnd(false);
  launchGameEndDialog("Game over", "You lose! Better luck next time.");
};

const handleWin = async () => {
  await handleGameEnd(true);
  launchCustomDialog("Game Complete", "You win. Congratulations!");
};
