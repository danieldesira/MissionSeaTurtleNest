import Game from "./Game";
import { paintLevelBg } from "./levels/background";
import { LevelChangeTypes } from "./levels/levels";
import stringifyGameData from "./restoreGame/stringifyGameData";
import { saveLastGameLocalStorage, saveLastGameTimestampLocalStorage } from "./utils/lastGameLocalStorage";

export const runGameLoop = async (canvas: HTMLCanvasElement) => {
  if (isGamePaused) {
    return;
  }

  try {
    const levelChangeType = await checkTurtleAndGameProgress();
    if (levelChangeType === "SameLevel" || levelChangeType === "NewLevel") {
      const context = canvas.getContext("2d");

      paintLevelBg({ canvas, context });
      Game.instance.turtle.paint(context);
      Game.instance.level.paintCharacters(context);

      saveGameProgress();

      Game.instance.animationTimer = requestAnimationFrame(
        async () => await runGameLoop(canvas)
      );
    } else {
      cancelAnimationFrame(Game.instance.animationTimer);
    }
  } catch (error) {
    throw error;
  }
};

const saveGameProgress = () => {
  if (isAuthenticated) {
    saveLastGameLocalStorage(stringifyGameData(Game.instance.turtle));
    saveLastGameTimestampLocalStorage();
  }
};

const checkTurtleAndGameProgress = async (): Promise<LevelChangeTypes> => {
  const mainCharacter = Game.instance.turtle;

  useFood();
  recoverApetite();

  if (
    mainCharacter.foodGauge <= 0 ||
    mainCharacter.oxygenGauge <= 0 ||
    mainCharacter.lifeGauge <= 0
  ) {
    await handleLoss();
    return "GameEnd";
  }

  if (mainCharacter.y <= 0) {
    breath();
  } else {
    useOxygen();
  }

  const backgroundImage = Game.instance.level.bgImg;
  if (backgroundImage && mainCharacter.x >= backgroundImage.width) {
    return await handleOffBgWidth();
  }

  Game.instance.level.checkIfTurtleMeetsCharacters(mainCharacter.apetiteGauge, {
    eat,
    gainPoints,
    deductLife,
    decrementApetite,
  });

  Game.instance.level.moveCharacters();

  return "SameLevel";
};

const handleOffBgWidth = async (): Promise<LevelChangeTypes> => {
  gainPoints(Game.instance.level.points);
  setTurtleStats({ ...turtleStats, level: turtleStats.level + 1 });
  if (levelMap[turtleStats.level]) {
    await Game.instance.loadNewLevel(turtleStats.level, true);
    return "NewLevel";
  } else {
    await handleWin();
    return "GameEnd";
  }
};
