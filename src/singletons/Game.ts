import Turtle from "../characters/Turtle";
import { paintLevelBg } from "../levels/background";
import type { ILevel } from "../levels/interfaces";
import { createLevelInstance, levelExists } from "../levels/levels";
import type GameData from "../restoreGame/GameData";
import parseGameData from "../restoreGame/parseGameData";
import {
  checkIfBestPersonalScore,
  deleteLastGameAndSaveScore,
  saveGameProgress,
} from "../utils/gameplay";
import { resizeCanvas } from "../utils/generic";
import { getLastGameLocalStorage } from "../utils/lastGameLocalStorage";
import { launchCustomDialog } from "../utils/ui/customDialog";
import { launchGameEndDialog } from "../utils/ui/gameplay";
import { toggleMode } from "../utils/ui/mainMenu";
import { hideOverlay, showOverlay } from "../utils/ui/overlay";
import { showXpUpdateSpan, updateXpSpan } from "../utils/ui/xp";

type GameOptions = {
  canvas: HTMLCanvasElement;
  isNewGame: boolean;
};

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
  private _isPersonalBest: boolean;

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

  set isPersonalBest(value: boolean) {
    this._isPersonalBest = value;
  }

  get isPersonalBest() {
    return this._isPersonalBest;
  }

  /**
   * Resets game state.
   * @author Daniel Desira
   */
  reset() {
    this._currentLevelNo = 1;
    this._xp = 0;
    this._isPersonalBest = false;
    this._turtle.resetDirection();
    this._turtle.resetGauges();
    this._turtle.isPregnant = false;
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
    showXpUpdateSpan(xp);
  }

  /**
   * Loads the current level as per _currentLevelNo.
   * @param isFreshLevel Flag used to determine whether level is fresh or restored.
   * @param gameData The game data in case it is a restored level.
   * @author Daniel Desira
   */
  async loadNewLevel(isFreshLevel: boolean, gameData: GameData = null) {
    showOverlay(`Loading level ${this.currentLevelNo}`);
    try {
      this._level = createLevelInstance(this._currentLevelNo);
      if (this._level) {
        await this._level.init(isFreshLevel, gameData);
      }
      if (isFreshLevel) {
        this.turtle.resetDirection();
        this.turtle.x = 50;
        this.turtle.y = this._level.bgImg.height / 2;
      }
    } catch (error) {
      launchCustomDialog("Game Error", error.toString());
    } finally {
      hideOverlay();
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

      this.runGameLoop(canvas);
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
    this.clearAnimationFrameTimer();
  }

  private clearAnimationFrameTimer() {
    cancelAnimationFrame(this._animationTimer);
  }

  private async runGameLoop(canvas: HTMLCanvasElement) {
    if (!this._isGameScreenActive) {
      this.clearAnimationFrameTimer();
      return;
    }

    if (!this._isPaused) {
      try {
        saveGameProgress();

        const gameRunning = await this.checkTurtleAndGameProgress();
        const context = canvas.getContext("2d");

        paintLevelBg({ canvas, context });
        this._turtle.paint(context);
        this._level.paintCharacters(context);

        if (!gameRunning) {
          this.clearAnimationFrameTimer();
          return;
        }
      } catch (error) {
        throw error;
      }
    }

    this._animationTimer = requestAnimationFrame(
      async () => await this.runGameLoop(canvas)
    );
  }

  private async checkTurtleAndGameProgress() {
    const mainCharacter = this._turtle;

    mainCharacter.useFood();
    mainCharacter.recoverApetite();

    if (
      mainCharacter.foodGauge <= 0 ||
      mainCharacter.oxygenGauge <= 0 ||
      mainCharacter.lifeGauge <= 0
    ) {
      this.handleLoss();
      return false;
    }

    if (mainCharacter.y <= 0) {
      mainCharacter.breath();
    } else {
      mainCharacter.useOxygen();
    }

    const backgroundImage = this._level.bgImg;
    if (backgroundImage && mainCharacter.x >= backgroundImage.width) {
      return await this.handleOffBgWidth();
    }

    this._level.checkIfTurtleMeetsCharacters();
    this._level.checkProspectiveMates();

    this._level.moveCharacters();

    return true;
  }

  private async handleOffBgWidth() {
    if (this._level.objectivesMet()) {
      this.gainPoints(this._level.points);
      updateXpSpan();
      this.incrementCurrentLevelNo();
      if (levelExists(this._currentLevelNo)) {
        await this.loadNewLevel(true);
        return true;
      } else {
        this.handleWin();
        return false;
      }
    } else {
      return true;
    }
  }

  private handleLoss() {
    this.handleGameEnd(false);
    launchGameEndDialog("Game over", "You lose! Better luck next time.");
  }

  private handleWin() {
    this.handleGameEnd(true);
    launchGameEndDialog("Game Complete", "You win. Congratulations!");
  }

  private async handleGameEnd(hasWon: boolean) {
    checkIfBestPersonalScore();
    this.exit();
    toggleMode("menu");

    await deleteLastGameAndSaveScore(hasWon);
  }
}

export default Game;
