import Turtle from "../characters/Turtle";
import ILevel from "../levels/ILevel";
import { createLevelInstance } from "../levels/levels";
import GameData from "../restoreGame/GameData";
import parseGameData from "../restoreGame/parseGameData";
import { resizeCanvas } from "../utils/generic";
import { getLastGameLocalStorage } from "../utils/lastGameLocalStorage";
import { hideOverlay, showOverlay } from "../utils/ui/ui";

class Game {
  private static _instance: Game;

  private constructor() {
    this._turtle = new Turtle();
    this.reset();
  }

  /**
   * Singleton accessor property.
   * @author Daniel Desira
   */
  static get instance(): Game {
    if (!this._instance) {
      this._instance = new Game();
    }
    return this._instance;
  }

  private _animationTimer: number = 0;
  private _turtle: Turtle;
  private _level: ILevel;
  private _xp: number;
  private _currentLevelNo: number;
  private _isPaused: boolean;
  private _isGameScreenActive: boolean;

  /**
   * Turtle instance getter.
   * @author Daniel Desira
   */
  get turtle() {
    return this._turtle;
  }

  /**
   * Level instance getter.
   * @author Daniel Desira
   */
  get level() {
    return this._level;
  }

  /**
   * Animation timer setter.
   * @author Daniel Desira
   */
  set animationTimer(value: number) {
    this._animationTimer = value;
  }

  /**
   * Animation timer getter.
   * @author Daniel Desira
   */
  get animationTimer() {
    return this._animationTimer;
  }

  /**
   * XP/points getter.
   * @author Daniel Desira
   */
  get xp() {
    return this._xp;
  }

  /**
   * XP/points setter.
   * @author Daniel Desira
   */
  set xp(value: number) {
    this._xp = value;
  }

  /**
   * Current level no. getter.
   * @author Daniel Desira
   */
  get currentLevelNo() {
    return this._currentLevelNo;
  }

  /**
   * Current level no. setter.
   * @author Daniel Desira
   */
  set currentLevelNo(value: number) {
    this._currentLevelNo = value;
  }

  /**
   * Paused flag getter.
   * @author Daniel Desira
   */
  get isPaused() {
    return this._isPaused;
  }

  /**
   * Game screen active flag getter.
   * @author Daniel Desira
   */
  get isGameScreenActive() {
    return this._isGameScreenActive;
  }

  /**
   * Resets game state.
   * @author Daniel Desira
   */
  reset() {
    this._currentLevelNo = 1;
    this._xp = 0;
    this._turtle.resetPosition();
    this._turtle.resetGauges();
  }

  /**
   * Marks game as paused.
   * @author Daniel Desira
   */
  pause() {
    this._isPaused = true;
  }

  /**
   * Marks game as running/not-paused.
   * @author Daniel Desira
   */
  resume() {
    this._isPaused = false;
  }

  /**
   * Increments current level.
   * @author Daniel Desira
   */
  incrementCurrentLevelNo() {
    this._currentLevelNo++;
  }

  /**
   * Increments/decrements points by a given value.
   * @param xp Value for increment. If negative, it results in a decrement.
   * @author Daniel Desira
   */
  gainPoints(xp: number) {
    this._xp += xp;
  }

  /**
   * Loads the current level as per _currentLevelNo.
   * @param isFreshLevel Flag used to determine whether level is fresh or restored.
   * @param gameData The game data in case it is a restored level.
   * @author Daniel Desira
   */
  async loadNewLevel(isFreshLevel: boolean, gameData: GameData = null) {
    try {
      this._level = createLevelInstance(this._currentLevelNo);
      if (this._level) {
        showOverlay(`Loading level ${this.currentLevelNo}`);
        await this._level.init(isFreshLevel, gameData);
        hideOverlay();
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
  async start({ canvas, isNewGame }: GameOptions) {
    try {
      Game._instance.reset();
      await Game._instance.turtle.loadImage();

      await Game._instance.loadNewLevel(
        isNewGame,
        isNewGame ? null : parseGameData(getLastGameLocalStorage())
      );
      resizeCanvas(canvas);
      this._isGameScreenActive = true;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Marks the game as not running.
   * @author Daniel Desira
   */
  exit() {
    this._isGameScreenActive = false;
  }
}

type GameOptions = {
  canvas: HTMLCanvasElement;
  isNewGame: boolean;
};

export default Game;
