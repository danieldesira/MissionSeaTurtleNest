import Game from "../singletons/Game";
import stringifyGameData from "../restoreGame/stringifyGameData";
import { saveScore } from "../services/api";
import { launchCustomDialog } from "./ui/customDialog";
import {
  deleteLastGameLocalStorage,
  deleteLastGameTimestampLocalStorage,
  saveLastGameLocalStorage,
  saveLastGameTimestampLocalStorage,
} from "./lastGameLocalStorage";
import PersonalBestStore from "../singletons/cacheStores/PersonalBestStore";
import { isAuthenticated } from "./authentication";
import { updatePersonalBestPlaceholders } from "./ui/scores";
import { hideWaitingNotice, showWaitingNotice } from "./ui/waitingNotice";
import { hideContinueGameBtn } from "./ui/mainMenu";

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
        points: Game.instance.xp,
        level: Game.instance.currentLevelNo,
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
    PersonalBestStore.instance.level <= Game.instance.currentLevelNo &&
    PersonalBestStore.instance.points < Game.instance.xp
  ) {
    PersonalBestStore.instance.level = Game.instance.currentLevelNo;
    PersonalBestStore.instance.points = Game.instance.xp;
    Game.instance.isPersonalBest = true;

    updatePersonalBestPlaceholders();
  }
};
