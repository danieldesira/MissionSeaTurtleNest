import { game } from "../singletons/Game";
import { saveScore } from "../services/api";
import { isAuthenticated } from "./authentication";
import { updatePersonalBestPlaceholders } from "./ui/scores";
import {
  hideWaitingNotice,
  showErrorNotice,
  showWaitingNotice,
} from "./ui/waitingNotice";
import { hideContinueGameBtn } from "./ui/mainMenu";
import { personalBestStore } from "../inMemoryStores/PersonalBestStore";
import { lastGameStore } from "../inMemoryStores/LastGameStore";
import { levelExists } from "../levels/levels";

export const cacheGameProgress = () => {
  if (isAuthenticated()) {
    lastGameStore.store = {
      characters: [...game.currentGameCharacterList.characters].map(
        ({ type, x, y, direction }) => ({
          type,
          x,
          y,
          direction,
        }),
      ),
      levelNo: game.currentLevelNo,
      xp: game.xp,
      turtle: {
        x: game.turtle.x,
        y: game.turtle.y,
        direction: game.turtle.direction,
        oxygen: game.turtle.oxygenGauge,
        food: game.turtle.foodGauge,
        health: game.turtle.lifeGauge,
        stomachCapacity: game.turtle.apetiteGauge,
        isMama: game.turtle.isMama,
      },
      duration: game.timeInSeconds,
      interactions: stringifyInteractions(),
      remainingResets: game.remainingLevelResets,
    };
  }
};

const stringifyInteractions = () =>
  Object.entries(game.interactions)
    .map(([type, count]) => `${type},${count}`)
    .join("|");

export const deleteLastGameAndSaveScore = async () => {
  hideContinueGameBtn();
  lastGameStore.reset();
  showWaitingNotice("Saving score!");
  try {
    if (isAuthenticated()) {
      await saveScore({
        interactions: stringifyInteractions(),
        level: game.currentLevelNo,
        duration: game.timeInSeconds,
        remainingResets: game.remainingLevelResets,
      });
    }
  } catch {
    showErrorNotice("Failed to save game score", 500);
  } finally {
    hideWaitingNotice();
  }
};

export const checkIfBestPersonalScore = () => {
  if (
    personalBestStore.level <= game.currentLevelNo &&
    personalBestStore.points < game.xp
  ) {
    personalBestStore.level = game.currentLevelNo;
    personalBestStore.points = game.xp;
    personalBestStore.duration = game.timeInSeconds;
    personalBestStore.outcome = levelExists(game.currentLevelNo)
      ? "Loss"
      : "Win";
    game.isPersonalBest = true;

    updatePersonalBestPlaceholders();
  }
};
