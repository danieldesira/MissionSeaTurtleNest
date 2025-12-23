import type { ILevel } from "./interfaces";
import type { LevelConstructorOptions, LevelCharacter } from "./types";
import ProspectiveMate from "../characters/abstract/ProspectiveMate";
import type { HorizontalDirection } from "../types";
import { game } from "../singletons/Game";

class Level implements ILevel {
  private readonly _backgroundImageFilename: string;
  private readonly _initialCharacters: LevelCharacter[];
  private _backgroundImage: HTMLImageElement | null;
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

  async init(
    context: CanvasRenderingContext2D,
    isFreshLevel: boolean
  ): Promise<void> {
    try {
      await this.loadBgImg();

      if (isFreshLevel) {
        game.currentGameCharacterList.spawnCharacters(this._initialCharacters);
      }

      await this.loadCharacterImages();
      game.currentGameCharacterList.paintCharacters(context);

      // Hack to show characters before dialog is closed
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 1));
      this.showLevelDialog();
    } catch {
      throw new Error("Unable to load level");
    }
  }

  private showLevelDialog() {
    const newLevelEvent = new CustomEvent("newLevel", {
      detail: { level: this },
    });
    document.dispatchEvent(newLevelEvent);
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

  private async loadCharacterImages() {
    try {
      await Promise.all(
        [...game.currentGameCharacterList.characters].map((c) => c.loadImage())
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  get currentSpeed() {
    return this._currentSpeed;
  }

  objectivesMet() {
    return (
      !this._objectives || this._objectives.every((predicate) => predicate())
    );
  }

  checkProspectiveMates() {
    for (const character of game.currentGameCharacterList.characters) {
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
          game.currentGameCharacterList.characters.add(obstacle);
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
