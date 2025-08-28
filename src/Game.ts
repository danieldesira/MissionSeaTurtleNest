import Turtle from "./characters/Turtle";
import { updateDialogContent } from "./features/dialogs/dialogReducer";
import {
  startLoadingLevel,
  stopLoadingLevel,
} from "./features/gameState/gameStateReducer";
import { resetLevel } from "./features/levels/levelReducer";
import { resetTurtle } from "./features/turtleMonitor/turtleReducers";
import ILevel from "./levels/ILevel";
import { createLevelInstance } from "./levels/levels";
import GameData from "./restoreGame/GameData";
import store from "./store";
import { resizeCanvas } from "./utils/generic";

class Game {
  private static _instance: Game;
  private _animationTimer: number = 0;

  private constructor() {
    this._turtle = new Turtle();
  }

  static get instance(): Game {
    if (!this._instance) {
      this._instance = new Game();
    }
    return this._instance;
  }

  private _turtle: Turtle;
  private _level: ILevel;

  get turtle() {
    return this._turtle;
  }

  get level() {
    return this._level;
  }

  set animationTimer(value: number) {
    this._animationTimer = value;
  }

  get animationTimer() {
    return this._animationTimer;
  }

  /**
   * Loads the level currently indicated by the Redux store.
   * @param isFreshLevel Flag used to determine whether level is fresh or restored.
   * @param gameData The game data in case it is a restored level.
   * @author Daniel Desira
   */
  async loadNewLevel(isFreshLevel: boolean, gameData: GameData = null) {
    const newLevelNo = store.getState().levels.level.value;
    try {
      this._level = createLevelInstance(newLevelNo);
      if (this._level) {
        store.dispatch(startLoadingLevel());
        await this._level.init(isFreshLevel, gameData);
        store.dispatch(stopLoadingLevel());
      }
      if (isFreshLevel) {
        this.turtle.resetPosition();
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Initialises game.
   * @param options The game options.
   * @author Daniel Desira
   */
  async start({ canvas, isNewGame, gameData }: GameOptions) {
    try {
      await Game.instance.turtle.loadImage();
      await Game.instance.loadNewLevel(isNewGame, gameData);
      resizeCanvas(canvas);
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Resets game state.
   * @author Daniel Desira
   */
  reset() {
    store.dispatch(resetLevel());
    store.dispatch(resetTurtle());
  }
}

type GameOptions = {
  canvas: HTMLCanvasElement;
  isNewGame: boolean;
  gameData: GameData;
};

export default Game;
