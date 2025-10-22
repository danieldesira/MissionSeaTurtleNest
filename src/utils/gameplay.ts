import Game from "../singletons/Game";
import stringifyGameData from "../restoreGame/stringifyGameData";
import { deleteLastGame, saveScore } from "../services/api";
import { launchCustomDialog } from "./ui/ui";
import {
  deleteLastGameLocalStorage,
  deleteLastGameTimestampLocalStorage,
  saveLastGameLocalStorage,
  saveLastGameTimestampLocalStorage,
} from "./lastGameLocalStorage";
import PersonalBestStore from "../singletons/cacheStores/PersonalBestStore";
import { isAuthenticated } from "./authentication";
import { formatLevelAsText, updatePersonalBestPlaceholders } from "./ui/scores";

export const saveGameProgress = () => {
  if (isAuthenticated()) {
    saveLastGameLocalStorage(stringifyGameData());
    saveLastGameTimestampLocalStorage();
  }
};

export const deleteLastGameAndSaveScore = async (
  hasWon: boolean
): Promise<void> => {
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

export const checkIfBestPersonalScore = () => {
  if (
    PersonalBestStore.instance.level <= Game.instance.currentLevelNo &&
    PersonalBestStore.instance.points < Game.instance.xp
  ) {
    launchCustomDialog(
      "New Personal Best",
      `Congratulations! ${Game.instance.xp} points at ${formatLevelAsText(
        Game.instance.currentLevelNo
      )}`
    );
    PersonalBestStore.instance.level = Game.instance.currentLevelNo;
    PersonalBestStore.instance.points = Game.instance.xp;

    updatePersonalBestPlaceholders();
  }
};
