import PackPrey from "../characters/abstract/PackPrey";
import type INonMainCharacter from "../characters/interfaces/INonMainCharacter";
import { restoreCharacters } from "../restoreGame/parseGameData";
import type ILevel from "./ILevel";
import { type LevelConstructorOptions, type LevelCharacter } from "./types";
import type GameData from "../restoreGame/GameData";
import { launchCustomDialog } from "../utils/ui/customDialog";
import Game from "../singletons/Game";

class Level implements ILevel {
  private readonly _backgroundImageFilename: string;
  private readonly _initialCharacters: LevelCharacter[];
  private _backgroundImage: HTMLImageElement | null;
  private _characters: Set<INonMainCharacter> = new Set();
  private _bgOffsetX: number;
  private _bgOffsetY: number;
  private readonly _benthicOffsetY: number;
  private readonly _currentSpeed: number;
  private readonly _points: number;
  private readonly _levelDescription: string[];
  private readonly _imageBasePath: string = "/images/backgrounds/";

  constructor({
    backgroundImageFilename,
    initialCharacters,
    benthicOffsetY,
    currentSpeed,
    points,
    levelDescription,
  }: LevelConstructorOptions) {
    this._backgroundImageFilename = backgroundImageFilename;
    this._initialCharacters = initialCharacters;
    this._benthicOffsetY = benthicOffsetY;
    this._currentSpeed = currentSpeed;
    this._points = points;
    this._levelDescription = levelDescription;
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
    launchCustomDialog(
      `Level ${Game.instance.currentLevelNo}`,
      this._levelDescription
    );
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
        const character = new characterInfo.Constructor();
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
