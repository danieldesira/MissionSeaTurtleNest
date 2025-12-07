import PackPrey from "../characters/abstract/PackPrey";
import { restoreCharacters } from "../restoreGame/parseGameData";
import type { ILevel } from "./interfaces";
import type { LevelConstructorOptions, LevelCharacter } from "./types";
import type GameData from "../restoreGame/GameData";
import type { INonMainCharacter } from "../characters/interfaces";
import { launchLevelStartDialog } from "../utils/ui/gameplay";
import ProspectiveMate from "../characters/abstract/ProspectiveMate";
import { paintOffScreenIndicator } from "../characters/offscreenIndicator";
import type { Direction, HorizontalDirection } from "../types";

class Level implements ILevel {
  private readonly _backgroundImageFilename: string;
  private readonly _initialCharacters: LevelCharacter[];
  private _backgroundImage: HTMLImageElement | null;
  private _characters: Set<INonMainCharacter> = new Set();
  private _bgOffsetX: number;
  private _bgOffsetY: number;
  private readonly _benthicOffsetY?: number;
  private readonly _currentSpeed: number;
  private readonly _points: number;
  private readonly _levelDescription: string;
  private readonly _imageBasePath: string = "/images/backgrounds/";
  private readonly _title: string;
  private readonly _objectives: Array<() => boolean>;
  private readonly _spawnableObstaclesPer30Second: LevelCharacter[];
  private readonly _currentDirection: HorizontalDirection;

  constructor({
    backgroundImageFilename,
    initialCharacters,
    benthicOffsetY,
    currentSpeed,
    points,
    levelDescription,
    title,
    objectives,
    spawnableObstaclesPer30Second,
    currentDirection = "Left",
  }: LevelConstructorOptions) {
    this._backgroundImageFilename = backgroundImageFilename;
    this._initialCharacters = initialCharacters;
    this._benthicOffsetY = benthicOffsetY;
    this._currentSpeed = currentSpeed;
    this._points = points;
    this._levelDescription = levelDescription;
    this._title = title;
    this._objectives = objectives;
    this._spawnableObstaclesPer30Second = spawnableObstaclesPer30Second;
    this._currentDirection = currentDirection;
  }

  /**
   * Initialises level.
   * @param isFreshLevel Determines whether the level is fresh or restored.
   * @param gameData The game data in case it is a restored level.
   * @author Daniel Desira
   */
  async init(isFreshLevel: boolean, gameData: GameData = null): Promise<void> {
    try {
      await this.loadBgImg();
      if (isFreshLevel) {
        this.spawnCharacters();
      } else {
        this.restoreCharacters(gameData);
      }
      await this.loadCharacterImages();
    } catch {
      throw new Error("Unable to load level");
    }
    this.showLevelDialog();
  }

  private showLevelDialog() {
    launchLevelStartDialog(this);
  }

  private loadBgImg(): Promise<void> {
    return new Promise((resolve, reject) => {
      const backgroundImage = document.createElement("img");
      backgroundImage.src = this.imagePath;
      backgroundImage.onload = () => {
        this._backgroundImage = backgroundImage;
        resolve();
      };
      backgroundImage.onerror = () =>
        reject(new Error("Could not load level background"));
    });
  }

  set bgOffsetX(offsetX: number) {
    this._bgOffsetX = offsetX;
  }

  set bgOffsetY(offsetY: number) {
    this._bgOffsetY = offsetY;
  }

  get bgOffsetX() {
    return this._bgOffsetX;
  }

  get bgOffsetY() {
    return this._bgOffsetY;
  }

  get bgImg() {
    return this._backgroundImage;
  }

  get characters() {
    return this._characters;
  }

  get benthicOffsetY() {
    return this._benthicOffsetY;
  }

  get points() {
    return this._points;
  }

  get levelDescription() {
    return this._levelDescription;
  }

  get imagePath() {
    return this._imageBasePath + this._backgroundImageFilename;
  }

  get initialCharacters() {
    return this._initialCharacters;
  }

  get title() {
    return this._title;
  }

  private spawnCharacters() {
    this._characters.clear();
    let lastPackCharacter: PackPrey = null;

    for (const { Constructor, amount, options } of this._initialCharacters) {
      for (let i = 0; i < amount; i++) {
        const character = new Constructor(options);
        if (character instanceof PackPrey) {
          if (lastPackCharacter) {
            character.previousCharacterX = lastPackCharacter.x;
            character.previousCharacterY = lastPackCharacter.y;
          }
          lastPackCharacter = character;
        }
        character.setInitialPosition();
        this._characters.add(character);
      }
    }
  }

  private restoreCharacters(gameData: GameData) {
    restoreCharacters(gameData);
  }

  private async loadCharacterImages() {
    try {
      Promise.all([...this._characters].map((c) => c.loadImage()));
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Loops through characters and paints them accordingly.
   * @param context The canvas 2D context
   * @author Daniel Desira
   */
  paintCharacters(context: CanvasRenderingContext2D) {
    for (const character of this._characters) {
      if (character.isOnScreen()) {
        character.paint(context);
      } else {
        paintOffScreenIndicator(context, character);
      }
    }
  }

  /**
   * Loops through characters and applies respective moves.
   * @author Daniel Desira
   */
  moveCharacters() {
    for (const character of this._characters) {
      character.swim();
    }
  }

  get currentSpeed() {
    return this._currentSpeed;
  }

  /**
   * Loops through characters and checks for collisions.
   * @author Daniel Desira
   */
  checkIfTurtleMeetsCharacters() {
    for (const character of this._characters) {
      if (character.isCollidingWithTurtle()) {
        character.handleTurtleCollision();
      }
    }
  }

  objectivesMet() {
    return (
      !this._objectives || this._objectives.every((predicate) => predicate())
    );
  }

  checkProspectiveMates() {
    for (const character of this._characters) {
      if (character instanceof ProspectiveMate) {
        character.checkCurrentObstacleCollisions();
      }
    }
  }

  spawnPer30SecondObstacles() {
    const horizontalSpread = 100;
    this._spawnableObstaclesPer30Second?.forEach(
      ({ Constructor, amount, options }) => {
        Array.from({ length: amount }).forEach(() => {
          const obstacle = new Constructor(options);
          obstacle.x =
            Math.random() * horizontalSpread +
            (this._currentDirection === "Left"
              ? this._backgroundImage.width
              : 0);
          obstacle.y = Math.random() * this._backgroundImage.height;
          obstacle.loadImage();
          this.characters.add(obstacle);
        });
      }
    );
  }

  get spawnableObstaclesPer30Second() {
    return this._spawnableObstaclesPer30Second;
  }

  get currentDirection() {
    return this._currentDirection;
  }
}

export default Level;
