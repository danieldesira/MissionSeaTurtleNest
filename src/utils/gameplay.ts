import { game } from "../singletons/Game";
import { saveScore } from "../services/api";
import { launchCustomDialog } from "./ui/customDialog";
import { isAuthenticated } from "./authentication";
import { updatePersonalBestPlaceholders } from "./ui/scores";
import { hideWaitingNotice, showWaitingNotice } from "./ui/waitingNotice";
import { hideContinueGameBtn } from "./ui/mainMenu";
import { personalBestStore } from "../inMemoryStores/PersonalBestStore";
import { lastGameStore } from "../inMemoryStores/LastGameStore";

export const cacheGameProgress = () => {
  if (isAuthenticated()) {
    lastGameStore.store = {
      characters: [...game.currentGameCharacterList.characters].map(
        ({ type, x, y, direction }) => ({
          type,
          x,
          y,
          direction,
        })
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
    };
  }
};

export const deleteLastGameAndSaveScore = async (
  hasWon: boolean
): Promise<void> => {
  hideContinueGameBtn();
  showWaitingNotice("Saving score!");
  try {
    if (isAuthenticated()) {
      await saveScore({
        points: game.xp,
        level: game.currentLevelNo,
        hasWon,
      });
    }
  } catch {
    launchCustomDialog("Error", "Failed to save game score");
  } finally {
    lastGameStore.reset();
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
    game.isPersonalBest = true;

    updatePersonalBestPlaceholders();
  }
};
