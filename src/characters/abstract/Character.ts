import { Direction, Directions } from "../../constants";
import Game from "../../singletons/Game";
import ICharacter from "../interfaces/ICharacter";

abstract class Character implements ICharacter {
  protected _x: number;
  protected _y: number;
  protected _image: HTMLImageElement | null;
  protected abstract readonly _imageFilename: string;
  protected abstract readonly _width: number;
  protected abstract readonly _height: number;
  protected _direction: Direction = "Right";
  protected readonly _imageBasePath: string = "/images/characters/";

  /**
   * Loads image for character.
   * @returns Promise for loaded image object.
   * @author Daniel Desira
   */
  loadImage(): Promise<void> {
    return new Promise((resolve, reject) => {
      const image = document.createElement("img");
      image.width = this._width;
      image.height = this._height;
      image.src = this.imagePath;
      image.onload = () => {
        this._image = image;
        resolve();
      };
      image.onerror = () =>
        reject(
          new Error(`Failed to load character image: ${this._imageFilename}`)
        );
    });
  }

  /**
   * Paints the character. Needs to be called after <code>loadImage()</code>.
   * @param context Canvas context.
   * @author Daniel Desira
   */
  paint(context: CanvasRenderingContext2D): void {
    if (this._image) {
      context.save();
      this.applyRotation(context);
      context.drawImage(
        this._image,
        -this._width / 2,
        -this._height / 2,
        this._width,
        this._height
      );
      context.restore();
    }
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  set x(x: number) {
    this._x = x;
  }

  set y(y: number) {
    this._y = y;
  }

  get image() {
    return this._image;
  }

  get height() {
    return this._height;
  }

  get width() {
    return this._width;
  }

  get direction() {
    return this._direction;
  }

  set direction(direction: Direction) {
    this._direction = direction;
  }

  get imagePath(): string {
    return this._imageBasePath + this._imageFilename;
  }

  /**
   * Applies the respective character's rotation. To be called before
   * painting character.
   * @param context The canvas 2D context
   * @author Daniel Desira
   */
  protected applyRotation(context: CanvasRenderingContext2D) {
    //const x = this._x - Game.instance.level.bgOffsetX;
    //const y = this._y - Game.instance.level.bgOffsetY;
    context.translate(
      this._x - Game.instance.level.bgOffsetX,
      this._y - Game.instance.level.bgOffsetY
    );
    context.rotate(Directions[this._direction]);
  }
}

export default Character;
