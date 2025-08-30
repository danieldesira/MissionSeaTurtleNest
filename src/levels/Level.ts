import PackPrey from "../characters/abstract/PackPrey";
import INonMainCharacter from "../characters/interfaces/INonMainCharacter";
import { restoreCharacters } from "../restoreGame/parseGameData";
import ILevel from "./ILevel";
import LevelCharacter from "./LevelCharacter";
import GameData from "../restoreGame/GameData";

abstract class Level implements ILevel {
  protected abstract readonly _backgroundImageFilename: string;
  protected abstract readonly _initialCharacters: LevelCharacter[];
  protected _backgroundImage: HTMLImageElement | null;
  protected _characters: Set<INonMainCharacter> = new Set();
  protected _bgOffsetX: number;
  protected _bgOffsetY: number;
  protected abstract readonly _benthicOffsetY: number;
  protected abstract readonly _currentSpeed: number;
  protected abstract readonly _points: number;
  protected abstract readonly _levelDescription: string[];
  protected readonly _imageBasePath: string = "/images/backgrounds/";

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

  get bgOffsetX(): number {
    return this._bgOffsetX;
  }

  get bgOffsetY(): number {
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

  get levelDescription(): string[] {
    return this._levelDescription;
  }

  get imagePath(): string {
    return this._imageBasePath + this._backgroundImageFilename;
  }

  private spawnCharacters() {
    this._characters.clear();
    let lastPackCharacter: PackPrey = null;

    for (const characterInfo of this._initialCharacters) {
      for (let i = 0; i < characterInfo.amount; i++) {
        const character = new characterInfo.constructor();
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
  paintCharacters(context: CanvasRenderingContext2D): void {
    for (const character of this._characters) {
      character.paint(context, this._bgOffsetX, this._bgOffsetY);
    }
  }

  /**
   * Loops through characters and applies respective moves.
   * @author Daniel Desira
   */
  moveCharacters(): void {
    for (const character of this._characters) {
      character.swim();
    }
  }

  get currentSpeed(): number {
    return this._currentSpeed;
  }

  /**
   * Loops through characters and checks for collisions.
   * @author Daniel Desira
   */
  checkIfTurtleMeetsCharacters(): void {
    for (const character of this._characters) {
      if (character.isCollidingWithTurtle()) {
        character.handleTurtleCollision();
      }
    }
  }
}

export default Level;
