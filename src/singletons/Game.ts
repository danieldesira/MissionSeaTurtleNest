import Turtle from "../characters/Turtle";
import ILevel from "../levels/ILevel";
import { createLevelInstance } from "../levels/levels";
import GameData from "../restoreGame/GameData";
import { resizeCanvas } from "../utils/generic";
import { hideOverlay, showOverlay } from "../utils/ui";

class Game {
  private static _instance: Game;

  private constructor() {
    this._turtle = new Turtle();
    this.reset();
  }

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

  get xp() {
    return this._xp;
  }

  set xp(value: number) {
    this._xp = value;
  }

  get currentLevelNo() {
    return this._currentLevelNo;
  }

  set currentLevelNo(value: number) {
    this._currentLevelNo = value;
  }

  get isPaused() {
    return this._isPaused;
  }

  get isGameScreenActive() {
    return this._isGameScreenActive;
  }

  reset() {
    this._currentLevelNo = 1;
    this._xp = 0;
    this._turtle.resetPosition();
    this._turtle.resetGauges();
  }

  pause() {
    this._isPaused = true;
  }

  resume() {
    this._isPaused = false;
  }

  incrementCurrentLevelNo() {
    this._currentLevelNo++;
  }

  gainPoints(xp: number) {
    this._xp += xp;
  }

  /**
   * Loads the level currently indicated by the Redux store.
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
  async start({ canvas, isNewGame, gameData }: GameOptions) {
    try {
      Game._instance.reset();
      await Game._instance.turtle.loadImage();
      await Game._instance.loadNewLevel(isNewGame, gameData);
      resizeCanvas(canvas);
      this._isGameScreenActive = true;
    } catch (error) {
      throw new Error(error);
    }
  }

  exit() {
    this._isGameScreenActive = false;
  }
}

type GameOptions = {
  canvas: HTMLCanvasElement;
  isNewGame: boolean;
  gameData: GameData;
};

export default Game;
