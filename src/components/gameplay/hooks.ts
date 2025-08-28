import { Dispatch, SetStateAction, useState } from "react";
import Game from "../../Game";
import { paintLevelBg } from "../../levels/background";
import { useDispatch, useSelector } from "react-redux";
import {
  breath,
  gainPoints,
  recoverStomachCapacity,
  respire,
  useFood,
} from "../../features/turtleMonitor/turtleReducers";
import RootState from "../../features/RootState";
import { levelUp } from "../../features/levels/levelReducer";
import { getLevelText, LevelChangeTypes, levelMap } from "../../levels/levels";
import {
  setPersonalBest,
  triggerMenuMode,
  triggerSavingMode,
} from "../../features/gameState/gameStateReducer";
import {
  deleteLastGameLocalStorage,
  deleteLastGameTimestampLocalStorage,
  saveLastGameLocalStorage,
  saveLastGameTimestampLocalStorage,
} from "../../utils/lastGameLocalStorage";
import stringifyGameData from "../../restoreGame/stringifyGameData";
import { deleteLastGame, saveScore } from "../../services/api";
import { GameLoopParams } from "./types";

export const useRunGameLoop = ({
  isGamePaused,
  setIsGamePaused,
  setDialogContent,
}: GameLoopParams) => {
  const checkIfTurtleAndGameProgress = useCheckTurtleAndProgressGame({
    setIsGamePaused,
    isGamePaused,
    setDialogContent,
  });
  const saveGameProgress = useSaveGameProgress();

  const runGameLoop = async (canvas: HTMLCanvasElement) => {
    try {
      const levelChangeType = isGamePaused
        ? "SameLevel"
        : await checkIfTurtleAndGameProgress();
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

  return runGameLoop;
};

const useCheckTurtleAndProgressGame = ({
  setIsGamePaused,
  setDialogContent,
}: GameLoopParams) => {
  const dispatch = useDispatch();
  const handleOffBgWidth = useHandleOffBgWidth({
    setDialogContent,
    setIsGamePaused,
  });
  const handleLoss = useHandleLoss();

  const turtleState = useSelector(
    (state: RootState) => state.turtleMonitor.turtle
  );

  return async () => {
    const mainCharacter = Game.instance.turtle;

    dispatch(useFood());
    dispatch(recoverStomachCapacity());

    if (
      turtleState.food.value <= 0 ||
      turtleState.oxygen.value <= 0 ||
      turtleState.life.value <= 0
    ) {
      await handleLoss();
      return "GameEnd";
    }

    if (mainCharacter.y <= 0) {
      dispatch(breath());
    } else {
      dispatch(respire());
    }

    const backgroundImage = Game.instance.level.bgImg;
    if (backgroundImage && mainCharacter.x >= backgroundImage.width) {
      return await handleOffBgWidth();
    }

    Game.instance.level.checkIfTurtleMeetsCharacters();

    Game.instance.level.moveCharacters();

    return "SameLevel";
  };
};

const useHandleOffBgWidth = ({
  setDialogContent,
  setIsGamePaused,
}: GameLoopParams) => {
  const dispatch = useDispatch();
  const handleWin = useHandleWin({ setDialogContent, setIsGamePaused });

  const newLevelNo = useSelector(
    (state: RootState) => state.levels.level.value
  );

  return async () => {
    dispatch(gainPoints({ turtle: { xpValue: Game.instance.level.points } }));
    dispatch(levelUp());
    if (levelMap[newLevelNo]) {
      await Game.instance.loadNewLevel(true);
      setIsGamePaused(true);
      setDialogContent({
        title: `Level ${newLevelNo}`,
        message: Game.instance.level.levelDescription.join(";"),
        type: "default",
      });
      return "NewLevel";
    } else {
      await handleWin();
      return "GameEnd";
    }
  };
};

const useHandleWin = ({ setDialogContent }: GameLoopParams) => {
  const handleGameEnd = useHandleGameEnd(true);
  const checkIfBestPersonalScore = useCheckIfBestPersonalScore();

  return async () => {
    await handleGameEnd();
    setDialogContent({
      title: "Game Complete",
      message: "You won! Congratulations!",
      type: "default",
    });
    checkIfBestPersonalScore();
  };
};

const useHandleLoss = () => {
  const handleGameEnd = useHandleGameEnd(false);

  return async () => {
    await handleGameEnd();
    //   store.dispatch(
    //     updateDialogContent({
    //       dialog: {
    //         title: "You lose",
    //         text: ["Better luck next time!"],
    //         buttons: [shareGameButton],
    //       },
    //     })
    //   );
  };
};

const useHandleGameEnd = (hasWon: boolean) => {
  const dispatch = useDispatch();
  const checkIfBestPersonalScore = useCheckIfBestPersonalScore();
  const deleteLastGameAndSaveScore = useDeleteLastGameAndSaveScore();

  return async () => {
    checkIfBestPersonalScore();
    dispatch(triggerSavingMode());
    await deleteLastGameAndSaveScore(hasWon);
    dispatch(triggerMenuMode());
  };
};

const useSaveGameProgress = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.authentication.isAuthenticated
  );

  return () => {
    if (isAuthenticated) {
      saveLastGameLocalStorage(stringifyGameData());
      saveLastGameTimestampLocalStorage();
    }
  };
};

const useDeleteLastGameAndSaveScore = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.authentication.isAuthenticated
  );
  const points = useSelector(
    (state: RootState) => state.turtleMonitor.turtle.xp.value
  );
  const level = useSelector((state: RootState) => state.levels.level.value);

  return async (hasWon: boolean) => {
    try {
      if (isAuthenticated) {
        await Promise.all([
          deleteLastGame(),
          saveScore({
            points,
            level,
            hasWon,
          }),
        ]);
      }
    } catch {
      // store.dispatch(
      //   updateDialogContent({
      //     dialog: {
      //       title: "Error",
      //       text: ["Failed to save game score"],
      //       type: "error",
      //     },
      //   })
      // );
    } finally {
      deleteLastGameLocalStorage();
      deleteLastGameTimestampLocalStorage();
    }
  };
};

const useCheckIfBestPersonalScore = () => {
  const points = useSelector(
    (state: RootState) => state.turtleMonitor.turtle.xp.value
  );
  const level = useSelector((state: RootState) => state.levels.level.value);
  const personalBest = useSelector(
    (state: RootState) => state.game.personalBest.value
  );

  const dispatch = useDispatch();

  return () => {
    if (personalBest.level <= level && personalBest.points < points) {
      // store.dispatch(
      //   updateDialogContent({
      //     dialog: {
      //       title: "New Personal Best",
      //       text: [
      //         "Congratulations!",
      //         `Points: ${points}`,
      //         `Level: ${getLevelText(level)}`,
      //       ],
      //     },
      //   })
      // );
    }

    dispatch(
      setPersonalBest({
        personalBest: {
          points,
          level,
        },
      })
    );
  };
};
