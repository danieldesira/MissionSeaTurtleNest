import Game from "./Game";
import { paintLevelBg } from "./levels/background";
import { LevelChangeTypes, levelMap } from "./levels/levels";
import stringifyGameData from "./restoreGame/stringifyGameData";
import { deleteLastGame, saveScore } from "./services/api";
import {
  deleteLastGameLocalStorage,
  deleteLastGameTimestampLocalStorage,
  saveLastGameLocalStorage,
  saveLastGameTimestampLocalStorage,
} from "./utils/lastGameLocalStorage";

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
    saveLastGameLocalStorage(stringifyGameData());
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

  Game.instance.level.checkIfTurtleMeetsCharacters();

  Game.instance.level.moveCharacters();

  return "SameLevel";
};

const handleOffBgWidth = async (): Promise<LevelChangeTypes> => {
  gainPoints(Game.instance.level.points);
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
    if (isAuthenticated) {
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
    setDialogContent({
      title: "Error",
      message: <>Failed to save game score</>,
      type: "error",
    });
  } finally {
    deleteLastGameLocalStorage();
    deleteLastGameTimestampLocalStorage();
  }
};

const checkIfBestPersonalScore = () => {
  if (
    personalBest.level <= Game.instance.currentLevelNo &&
    personalBest.points < Game.instance.xp
  ) {
    setDialogContent({
      title: "New Personal Best",
      message: (
        <p>
          Congratulations!
          <br />
          {Game.instance.xp} points at Level{" "}
          {getLevelText(Game.instance.currentLevelNo)}
        </p>
      ),
    });
  }

  dispatch(
    setPersonalBest({
      personalBest: {
        points: Game.instance.xp,
        level: Game.instance.currentLevelNo,
      },
    })
  );
};

const shareGameButton = {
  label: "Share",
  async action() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Turtle Core",
          text: `I just reached level ${Game.instance.currentLevelNo} with ${Game.instance.xp} points in Turtle Core!`,
          url: window.location.href,
        });
      } catch {
        setDialogContent({
          title: "Share Failed",
          message: <>Failed to share the game.</>,
          type: "error",
        });
      }
    }
  },
};

const handleGameEnd = async (hasWon: boolean) => {
  checkIfBestPersonalScore();

  dispatch(triggerSavingMode());
  await deleteLastGameAndSaveScore(hasWon);
  dispatch(triggerMenuMode());
};

const handleLoss = async () => {
  await handleGameEnd(false);

  setDialogContent({
    title: "You lose",
    message: <>"Better luck next time!"</>,
    buttons: [shareGameButton],
  });
};

const handleWin = async () => {
  await handleGameEnd(true);

  setDialogContent({
    title: "Game Complete",
    message: <>"Game complete. Congratulations!"</>,
    buttons: [shareGameButton],
  });

  checkIfBestPersonalScore();
};

const resetDialogContent = () =>
  setDialogContent({ title: "", message: <></>, type: "default" });

const resumeGame = () => setIsGamePaused(false);
