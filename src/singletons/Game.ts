import type Obstacle from "../characters/abstract/Obstacle";
import type Prey from "../characters/abstract/Prey";
import type { INonMainCharacter } from "../characters/interfaces";
import type { ILevel } from "../levels/interfaces";
import CurrentGameCharacterList from "../characters/CurrentGameCharacterList";
import Turtle from "../characters/Turtle";
import { eventEmitter } from "../events/EventEmitter";
import { paintLevelBg } from "../levels/background";
import { createLevelInstance, levelExists } from "../levels/levels";
import {
  checkIfBestPersonalScore,
  deleteLastGameAndSaveScore,
  saveGameProgress,
} from "../utils/gameplay";
import { restoreGameProgress } from "../utils/gameProgressRecovery";
import { resizeCanvas, vibrate } from "../utils/generic";
import { launchCustomDialog } from "../utils/ui/customDialog";
import {
  getCanvas,
  launchGameEndDialog,
  launchHeartMatingAnimation,
} from "../utils/ui/gameplay";
import { toggleMode } from "../utils/ui/mainMenu";
import { hideOverlay, showOverlay } from "../utils/ui/overlay";
import { showXpUpdate, updateXpSpan } from "../utils/ui/xp";
import { GameLossReason } from "../events/types";

type GameOptions = {
  canvas: HTMLCanvasElement;
  isNewGame: boolean;
};

class Game {
  private constructor() {
    this._turtle = new Turtle();
    this.reset();
  }

  private static _instance: Game = null;
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
  private _cleanCollisionEventHandler: () => void;
  private _cleanMateDeathEventHandler: () => void;
  private _cleanGameLostEventHandler: () => void;

  static get instance() {
    if (!this._instance) {
      this._instance = new Game();
    }
    return this._instance;
  }

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
    this._level = null;
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
        await this._level.init(context, isFreshLevel);
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

      this.setupEvents();

      await this._turtle.loadImage();

      if (!isNewGame) {
        restoreGameProgress();
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
    this.teardownEvents();
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

    if (mainCharacter.foodGauge <= 0) {
      this.handleLoss("out_of_food");
      return false;
    }

    if (mainCharacter.oxygenGauge <= 0) {
      this.handleLoss("out_of_oxygen");
      return false;
    }

    if (mainCharacter.lifeGauge <= 0) {
      this.handleLoss("damage");
      return false;
    }

    if (mainCharacter.y - mainCharacter.image.height <= 0) {
      mainCharacter.breath();
    } else {
      mainCharacter.useOxygen();
    }

    this._currentGameCharacterList.checkIfTurtleMeetsCharacters();
    this._currentGameCharacterList.checkProspectiveMates();

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

  private handleLoss(reason: GameLossReason) {
    this.handleGameEnd(false);
    const titles: Record<GameLossReason, string> = {
      out_of_food: "Out of Food",
      out_of_oxygen: "Out of Oxygen",
      damage: "Too much damage",
      mate_died_before_mating: "Mate Died before mating",
    };
    launchGameEndDialog(titles[reason], "You lose! Better luck next time.");
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

  private setupEvents() {
    this._cleanCollisionEventHandler = eventEmitter.on(
      "collision",
      ({ character }) => {
        switch (character.gameClassification) {
          case "Mate":
            if (!this._turtle.isMama) {
              launchHeartMatingAnimation();
              this._turtle.isMama = true;
              this.addReducePoints(character.points);
            }
            break;
          case "Obstacle":
            this._turtle.takeDamage((character as Obstacle).damage);
            this.handlePreyObstacleConsumption(character);
            this.addReducePoints(character.points);
            vibrate();
            break;
          case "Prey":
          case "PackPrey":
            const canTurtleEatCharacter =
              this._turtle.apetiteGauge - character.stomachImpact > 0;
            if (canTurtleEatCharacter) {
              this._turtle.eat((character as Prey).foodValue);
              this.handlePreyObstacleConsumption(character);
              this.addReducePoints(character.points);
            }
            break;
        }
      }
    );

    this._cleanMateDeathEventHandler = eventEmitter.on(
      "mateDeath",
      ({ character }) => {
        game.currentGameCharacterList.characters.delete(character);

        if (!this._turtle.isMama) {
          eventEmitter.emit("gameLost", { reason: "mate_died_before_mating" });
        } else {
          launchCustomDialog(
            "Mate died",
            "But at least you are a mama. Survive to preserve the species!"
          );
        }
      }
    );

    this._cleanGameLostEventHandler = eventEmitter.on(
      "gameLost",
      ({ reason }) => this.handleLoss(reason)
    );
  }

  private handlePreyObstacleConsumption(character: INonMainCharacter) {
    this._turtle.decrementApetite(character.stomachImpact);
    this._currentGameCharacterList.characters.delete(character);
  }

  private addReducePoints(points: number) {
    this.gainPoints(points);
    updateXpSpan();
  }

  private teardownEvents() {
    this._cleanCollisionEventHandler();
    this._cleanMateDeathEventHandler();
    this._cleanGameLostEventHandler();
  }
}

export const game = new Proxy<Game>({} as Game, {
  get(target: any, prop: string | symbol) {
    return Reflect.get(Game.instance, prop);
  },
  set(target: any, prop: string | symbol, value: any) {
    return Reflect.set(Game.instance, prop, value);
  },
});
