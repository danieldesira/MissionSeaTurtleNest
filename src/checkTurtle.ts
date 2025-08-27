import Game from "./Game";
import { updateDialogContent } from "./features/dialogs/dialogReducer";
import {
  setPersonalBest,
  triggerMenuMode,
  triggerSavingMode,
} from "./features/gameState/gameStateReducer";
import { levelUp } from "./features/levels/levelReducer";
import {
  breath,
  gainPoints,
  recoverStomachCapacity,
  respire,
  useFood,
} from "./features/turtleMonitor/turtleReducers";
import { getLevelText, LevelChangeTypes, levelMap } from "./levels/levels";
import { deleteLastGame, saveScore } from "./services/api";
import store from "./store";
import {
  deleteLastGameLocalStorage,
  deleteLastGameTimestampLocalStorage,
} from "./utils/lastGameLocalStorage";

/**
 * Fires checks regarding game status and reacts accordingly.
 * @returns Promise to game status.
 * @author Daniel Desira
 */
const checkTurtleAndProgressGame = async (): Promise<LevelChangeTypes> => {
  const mainCharacter = Game.instance.turtle;

  store.dispatch(useFood());
  store.dispatch(recoverStomachCapacity());

  const turtleState = store.getState().turtleMonitor.turtle;

  if (
    turtleState.food.value <= 0 ||
    turtleState.oxygen.value <= 0 ||
    turtleState.life.value <= 0
  ) {
    await handleLoss();
    return "GameEnd";
  }

  if (mainCharacter.y <= 0) {
    store.dispatch(breath());
  } else {
    store.dispatch(respire());
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
  store.dispatch(
    gainPoints({ turtle: { xpValue: Game.instance.level.points } })
  );
  store.dispatch(levelUp());
  const newLevelNo = store.getState().levels.level.value;
  if (levelMap[newLevelNo]) {
    await Game.instance.loadNewLevel(true);
    return "NewLevel";
  } else {
    await handleWin();
    return "GameEnd";
  }
};

const deleteLastGameAndSaveScore = async (hasWon: boolean): Promise<void> => {
  try {
    if (store.getState().authentication.isAuthenticated) {
      await Promise.all([
        deleteLastGame(),
        saveScore({
          points: store.getState().turtleMonitor.turtle.xp.value,
          level: store.getState().levels.level.value,
          hasWon,
        }),
      ]);
    }
  } catch {
    store.dispatch(
      updateDialogContent({
        dialog: {
          title: "Error",
          text: ["Failed to save game score"],
          type: "error",
        },
      })
    );
  } finally {
    deleteLastGameLocalStorage();
    deleteLastGameTimestampLocalStorage();
  }
};

const checkIfBestPersonalScore = () => {
  const points = store.getState().turtleMonitor.turtle.xp.value;
  const level = store.getState().levels.level.value;

  if (
    store.getState().game.personalBest.value.level <= level &&
    store.getState().game.personalBest.value.points < points
  ) {
    store.dispatch(
      updateDialogContent({
        dialog: {
          title: "New Personal Best",
          text: [
            "Congratulations!",
            `Points: ${points}`,
            `Level: ${getLevelText(level)}`,
          ],
        },
      })
    );
  }

  store.dispatch(
    setPersonalBest({
      personalBest: {
        points,
        level,
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
          text: `I just reached level ${
            store.getState().levels.level.value
          } with ${
            store.getState().turtleMonitor.turtle.xp.value
          } points in Turtle Quest!`,
          url: window.location.href,
        });
      } catch {
        store.dispatch(
          updateDialogContent({
            dialog: {
              title: "Share Failed",
              text: ["Failed to share the game."],
              type: "error",
            },
          })
        );
      }
    }
  },
};

const handleGameEnd = async (hasWon: boolean) => {
  checkIfBestPersonalScore();

  store.dispatch(triggerSavingMode());
  await deleteLastGameAndSaveScore(hasWon);
  store.dispatch(triggerMenuMode());
};

const handleLoss = async () => {
  await handleGameEnd(false);

  store.dispatch(
    updateDialogContent({
      dialog: {
        title: "You lose",
        text: ["Better luck next time!"],
        buttons: [shareGameButton],
      },
    })
  );
};

const handleWin = async () => {
  await handleGameEnd(true);

  store.dispatch(
    updateDialogContent({
      dialog: {
        title: "Game Complete",
        text: ["Game complete. Congratulations!"],
        buttons: [shareGameButton],
      },
    })
  );

  checkIfBestPersonalScore();
};

export default checkTurtleAndProgressGame;
