import { Fragment, useEffect, useRef, useState } from "react";
import NextLevelIndication from "./NextLevelIndication";
import GameHeader from "./gameHeader/GameHeader";
import { useDispatch, useSelector } from "react-redux";
import RootState from "../../features/RootState";
import ControlGroup from "./controls/ControlGroup";
import Game from "../../Game";
import {
  setPersonalBest,
  triggerMenuMode,
  triggerSavingMode,
} from "../../features/gameState/gameStateReducer";
import GameData from "../../restoreGame/GameData";
import {
  deleteLastGameLocalStorage,
  deleteLastGameTimestampLocalStorage,
  getLastGameLocalStorage,
  saveLastGameLocalStorage,
  saveLastGameTimestampLocalStorage,
} from "../../utils/lastGameLocalStorage";
import LoadingOverlay from "../LoadingOverlay";
import { resizeCanvas } from "../../utils/generic";
import Dialog from "../dialog/Dialog";
import { defaultTurtleStats, DialogContent, TurtleStats } from "./types";
import stringifyGameData from "../../restoreGame/stringifyGameData";
import { paintLevelBg } from "../../levels/background";
import { getLevelText, LevelChangeTypes, levelMap } from "../../levels/levels";
import { deleteLastGame, saveScore } from "../../services/api";
import parseGameData from "../../restoreGame/parseGameData";

type Props = { isNewGame: boolean;};

const GameSection = ({ isNewGame }: Props) => {
  const isLoadingLevel = useSelector(
    (state: RootState) => state.game.isLoadingLevel.value
  );
  const isAuthenticated = useSelector(
    (state: RootState) => state.authentication.isAuthenticated
  );
  const [isGamePaused, setIsGamePaused] = useState<boolean>(true);
  const [dialogContent, setDialogContent] = useState<DialogContent>({
    title: "",
    message: null,
    type: "default",
  });
  const [turtleStats, setTurtleStats] =
    useState<TurtleStats>(defaultTurtleStats);
  const personalBest = useSelector(
    (state: RootState) => state.game.personalBest.value
  );

  const dispatch = useDispatch();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const gainPoints = (increment: number) =>
    setTurtleStats({ ...turtleStats, xp: turtleStats.xp + increment });

  const useOxygen = () =>
    setTurtleStats({ ...turtleStats, oxygen: turtleStats.oxygen - 0.001 });

  const useFood = () =>
    setTurtleStats({ ...turtleStats, food: turtleStats.food - 0.005 });

  const breath = () => {
    const increment = 0.5;
    setTurtleStats((prev) => {
      if (prev.oxygen + increment < defaultTurtleStats.oxygen) {
        prev.oxygen += increment;
      } else {
        prev.oxygen = defaultTurtleStats.oxygen;
      }
      return prev;
    });
  };

  const recoverApetite = () => {
    const increment = 0.00005;
    setTurtleStats((prev) => {
      if (prev.apetite + increment < defaultTurtleStats.apetite) {
        prev.apetite += increment;
      } else {
        prev.apetite = defaultTurtleStats.apetite;
      }
      return prev;
    });
  };

  const eat = (foodValue: number) => {
    if (turtleStats.food + foodValue < defaultTurtleStats.food) {
      setTurtleStats({ ...turtleStats, food: turtleStats.food + foodValue });
    } else {
      setTurtleStats({ ...turtleStats, food: defaultTurtleStats.food });
    }
  };

  const deductLife = (amount: number) => {
    if (turtleStats.physicalCondition - amount < 0) {
      setTurtleStats({
        ...turtleStats,
        physicalCondition: turtleStats.physicalCondition - amount,
      });
    } else {
      setTurtleStats({ ...turtleStats, physicalCondition: 0 });
    }
  };

  const decrementApetite = (amount: number) => {
    if (turtleStats.apetite - amount < 0) {
      setTurtleStats({ ...turtleStats, apetite: turtleStats.apetite - amount });
    } else {
      setTurtleStats({ ...turtleStats, apetite: 0 });
    }
  };

  const checkTurtleAndGameProgress = async (): Promise<LevelChangeTypes> => {
    const mainCharacter = Game.instance.turtle;

    useFood();
    recoverApetite();

    if (
      turtleStats.food <= 0 ||
      turtleStats.oxygen <= 0 ||
      turtleStats.physicalCondition <= 0
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

    Game.instance.level.checkIfTurtleMeetsCharacters(turtleStats.apetite, {
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

  const deleteLastGameAndSaveScore = async (hasWon: boolean): Promise<void> => {
    try {
      if (isAuthenticated) {
        await Promise.all([
          deleteLastGame(),
          saveScore({
            points: turtleStats.xp,
            level: turtleStats.level,
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
      personalBest.level <= turtleStats.level &&
      personalBest.points < turtleStats.xp
    ) {
      setDialogContent({
        title: "New Personal Best",
        message: (
          <p>
            Congratulations!
            <br />
            {turtleStats.xp} points at Level {getLevelText(turtleStats.level)}
          </p>
        ),
      });
    }

    dispatch(
      setPersonalBest({
        personalBest: {
          points: turtleStats.xp,
          level: turtleStats.level,
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
            title: "Turtle Quest",
            text: `I just reached level ${turtleStats.level} with ${turtleStats.xp} points in Turtle Quest!`,
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

  const runGameLoop = async (canvas: HTMLCanvasElement) => {
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
      saveLastGameLocalStorage(stringifyGameData(turtleStats));
      saveLastGameTimestampLocalStorage();
    }
  };

  const resetDialogContent = () =>
    setDialogContent({ title: "", message: <></>, type: "default" });

  const resumeGame = () => setIsGamePaused(false);

  const handleBeforeUnload = (event: Event) => {
    // Display default dialog before closing
    event.preventDefault();
    event.returnValue = false; // Required by Chrome
  };

  const handleDialogClose = () => {
    resetDialogContent();
    resumeGame();
    setIsGamePaused((_) => false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isGamePaused) {
      const upKeys = ["w", "W", "ArrowUp"];
      const downKeys = ["s", "S", "ArrowDown"];
      const leftKeys = ["a", "A", "ArrowLeft"];
      const rightKeys = ["d", "D", "ArrowRight"];

      const mainCharacter = Game.instance.turtle;

      handleKeyGroup(upKeys, () => mainCharacter.moveUp(), event.key);
      handleKeyGroup(downKeys, () => mainCharacter.moveDown(), event.key);
      handleKeyGroup(leftKeys, () => mainCharacter.moveLeft(), event.key);
      handleKeyGroup(rightKeys, () => mainCharacter.moveRight(), event.key);
    }
  };

  const handleKeyGroup = (
    keyGroup: Array<string>,
    action: Function,
    pressedKey: string
  ) => {
    if (keyGroup.includes(pressedKey)) {
      // Call the method twice to make up for slower triggering of keyboard events
      action();
      action();
    }
  };

  const handleWheel = (event: React.WheelEvent) => {
    event.preventDefault();

    if (!isGamePaused) {
      const mainCharacter = Game.instance.turtle;

      if (event.deltaX < 0) {
        mainCharacter.moveLeft();
      }
      if (event.deltaX > 0) {
        mainCharacter.moveRight();
      }
      if (event.deltaY < 0) {
        mainCharacter.moveUp();
      }
      if (event.deltaY > 0) {
        mainCharacter.moveDown();
      }
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const canvas = canvasRef.current;

    window.addEventListener("resize", () => resizeCanvas(canvas), { signal });
    window.addEventListener("beforeunload", handleBeforeUnload, { signal });

    if (!isNewGame) {
      parseGameData(getLastGameLocalStorage(), setTurtleStats);
    }

    Game.instance
      .start({
        canvas,
        isNewGame,
        gameData: JSON.parse(getLastGameLocalStorage()) as GameData,
      })
      .then(async () => {
        setDialogContent({
          title: "Level 1",
          message: (
            <p>
              {Game.instance.level.levelDescription.map((line, index) => (
                <Fragment key={index}>
                  {line}
                  <br />
                </Fragment>
              ))}
            </p>
          ),
        });
        setIsGamePaused(true);
        await runGameLoop(canvas);
      })
      .catch((error) => {
        setDialogContent({ title: "Error", message: error, type: "error" });
        dispatch(triggerMenuMode());
      });

    return () => {
      abortController.abort();

      if (Game.instance.animationTimer) {
        cancelAnimationFrame(Game.instance.animationTimer);
      }
    };
  }, []);

  return (
    <div onKeyDown={handleKeyDown}>
      <div className="flex h-screen items-center justify-center">
        <canvas
          ref={canvasRef}
          height="400"
          width="700"
          tabIndex={1}
          onWheel={handleWheel}
        ></canvas>
      </div>
      {isLoadingLevel && (
        <LoadingOverlay message={`Loading level ${turtleStats.level}`} />
      )}
      <GameHeader
        turtleStats={turtleStats}
        setDialogContent={setDialogContent}
        setIsGamePaused={setIsGamePaused}
      />
      <NextLevelIndication />
      <ControlGroup isGamePaused={isGamePaused} />
      {isSaving && <LoadingOverlay message="Saving..." />}
      {dialogContent.title && dialogContent.message && (
        <Dialog
          title={dialogContent.title}
          type={dialogContent.type}
          handleOk={handleDialogClose}
          buttons={dialogContent.buttons}
        >
          {dialogContent.message}
        </Dialog>
      )}
    </div>
  );
};

export default GameSection;
