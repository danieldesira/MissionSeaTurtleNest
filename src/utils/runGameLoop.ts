import Game from "../Game";
import { paintLevelBg } from "../levels/background";
import store from "../store";
import stringifyGameData from "../restoreGame/stringifyGameData";
import {
  saveLastGameLocalStorage,
  saveLastGameTimestampLocalStorage,
} from "./lastGameLocalStorage";
import checkTurtleAndProgressGame from "../checkTurtle";
import { isCustomDialogOpen } from "./generic";

/**
 * Animates the game frame by frame depeding on outcomes of game logic.
 * @param canvas The canvas element.
 * @author Daniel Desira
 */
const runGameLoop = async (canvas: HTMLCanvasElement) => {
  try {
    const levelChangeType = isCustomDialogOpen()
      ? "SameLevel"
      : await checkTurtleAndProgressGame();
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
  const isAuthenticated = store.getState().authentication.isAuthenticated;
  if (isAuthenticated) {
    saveLastGameLocalStorage(stringifyGameData());
    saveLastGameTimestampLocalStorage();
  }
};

export default runGameLoop;
