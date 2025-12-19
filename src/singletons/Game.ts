import CurrentGameCharacterList from "../characters/CurrentGameCharacterList";
import Turtle from "../characters/Turtle";
import { paintLevelBg } from "../levels/background";
import type { ILevel } from "../levels/interfaces";
import { createLevelInstance, levelExists } from "../levels/levels";
import parseGameData, { restoreCharacters } from "../restoreGame/parseGameData";
import {
  checkIfBestPersonalScore,
  deleteLastGameAndSaveScore,
  saveGameProgress,
} from "../utils/gameplay";
import { resizeCanvas } from "../utils/generic";
import { getLastGameLocalStorage } from "../utils/lastGameLocalStorage";
import { launchCustomDialog } from "../utils/ui/customDialog";
import { getCanvas, launchGameEndDialog } from "../utils/ui/gameplay";
import { toggleMode } from "../utils/ui/mainMenu";
import { hideOverlay, showOverlay } from "../utils/ui/overlay";
import { showXpUpdate, updateXpSpan } from "../utils/ui/xp";

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
  private _currentFrameCount: number;
  private _currentGameCharacterList: CurrentGameCharacterList;

  get turtle() {
    return this._turtle;
  }

  get level() {
    return this._level;
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

  set isPersonalBest(value: boolean) {
    this._isPersonalBest = value;
  }

  get isPersonalBest() {
    return this._isPersonalBest;
  }

  get currentGameCharacterList() {
    return this._currentGameCharacterList;
  }

  reset() {
    this._currentLevelNo = 1;
    this._xp = 0;
    this._isPersonalBest = false;
    this._turtle.resetDirection();
    this._turtle.resetGauges();
    this._turtle.isMama = false;
    this._currentFrameCount = 0;
    this._currentGameCharacterList = new CurrentGameCharacterList();
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
    showXpUpdate(xp);
  }

  async loadNewLevel(
    context: CanvasRenderingContext2D,
    isFreshLevel: boolean = true
  ) {
    showOverlay(`Loading level ${this.currentLevelNo}`);
    try {
      this._level = createLevelInstance(this._currentLevelNo);
      if (this._level) {
        await this._level.init(context);
      }
      if (isFreshLevel) {
        this._turtle.resetDirection();
        this._turtle.x = 50;
        this._turtle.y = this._level.bgImg.height / 2;
      }
    } catch (error) {
      launchCustomDialog("Game Error", error.toString());
    } finally {
      hideOverlay();
    }
  }

  async start({ canvas, isNewGame }: GameOptions) {
    try {
      this.reset();
      await this._turtle.loadImage();

      if (!isNewGame) {
        const savedGameData = parseGameData(getLastGameLocalStorage());
        restoreCharacters(savedGameData);
      }

      resizeCanvas(canvas);
      this._isGameScreenActive = true;

      this.runGameLoop(canvas);
    } catch (error) {
      throw new Error(error);
    }
  }

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

        if (!this._level) {
          await this.loadNewLevel(
            canvas.getContext("2d"),
            this._currentGameCharacterList.characters.size === 0
          );
        }

        const gameRunning = await this.checkTurtleAndGameProgress();
        const context = canvas.getContext("2d");

        paintLevelBg({ canvas, context });
        this._turtle.paint(context);
        this._currentGameCharacterList.paintCharacters(context);

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

    if (mainCharacter.y - mainCharacter.image.height <= 0) {
      mainCharacter.breath();
    } else {
      mainCharacter.useOxygen();
    }

    this._currentGameCharacterList.checkIfTurtleMeetsCharacters();
    this._level.checkProspectiveMates();

    this._currentGameCharacterList.moveCharacters();

    if (this._currentFrameCount % (60 * 30) === 0) {
      this._level.spawnPer30SecondObstacles();
    }

    this.incrementFrameCount();

    const backgroundImage = this._level.bgImg;
    if (
      backgroundImage &&
      mainCharacter.x + mainCharacter.width / 2 >= backgroundImage.width
    ) {
      return await this.handleOffBgWidth();
    }

    return true;
  }

  private async handleOffBgWidth() {
    if (this._level.objectivesMet()) {
      this.gainPoints(this._level.points);
      updateXpSpan();
      this.incrementCurrentLevelNo();
      this._currentGameCharacterList.reset();
      if (levelExists(this._currentLevelNo)) {
        await this.loadNewLevel(getCanvas().getContext("2d"));
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

  private incrementFrameCount() {
    this._currentFrameCount++;
  }
}

export default Game;
