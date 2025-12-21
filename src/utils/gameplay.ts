import { game } from "../singletons/Game";
import stringifyGameData from "../restoreGame/stringifyGameData";
import { saveScore } from "../services/api";
import { launchCustomDialog } from "./ui/customDialog";
import {
  deleteLastGameLocalStorage,
  deleteLastGameTimestampLocalStorage,
  saveLastGameLocalStorage,
  saveLastGameTimestampLocalStorage,
} from "./lastGameLocalStorage";
import { isAuthenticated } from "./authentication";
import { updatePersonalBestPlaceholders } from "./ui/scores";
import { hideWaitingNotice, showWaitingNotice } from "./ui/waitingNotice";
import { hideContinueGameBtn } from "./ui/mainMenu";
import { personalBestStore } from "../singletons/cacheStores/PersonalBestStore";

export const saveGameProgress = () => {
  if (isAuthenticated()) {
    saveLastGameLocalStorage(stringifyGameData());
    saveLastGameTimestampLocalStorage();
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
    deleteLastGameLocalStorage();
    deleteLastGameTimestampLocalStorage();
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
