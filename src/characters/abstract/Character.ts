import type { Direction } from "../../types";
import { paintCharacter } from "../commonCharacterBehavior";
import type { ICharacter } from "../interfaces";

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
          new Error(`Failed to load character image: ${this._imageFilename}`),
        );
    });
  }

  /**
   * Paints the character. Needs to be called after <code>loadImage()</code>.
   * @param context Canvas context.
   * @author Daniel Desira
   */
  paint(context: CanvasRenderingContext2D) {
    paintCharacter({ context, character: this, rotate: true });
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

  get imagePath() {
    return this._imageBasePath + this._imageFilename;
  }
}

export default Character;
