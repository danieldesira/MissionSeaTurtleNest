import Prey from "./abstract/Prey";
import { type CharacterOptions } from "./types";

class Shrimp extends Prey {
  protected readonly _imageFilename: string;
  protected readonly _foodValue: number;
  protected readonly _speed: number;
  protected readonly _stomachImpact: number;
  protected readonly _points: number;
  protected readonly _width: number;
  protected readonly _height: number;
  protected readonly _type: string;

  constructor({
    imageFilename,
    foodValue,
    speed,
    stomachImpact,
    points,
    width,
    height,
  }: CharacterOptions = {}) {
    super();
    this._imageFilename = imageFilename ?? "shrimp.svg";
    this._foodValue = foodValue ?? 0.01;
    this._speed = speed ?? 0.6;
    this._stomachImpact = stomachImpact ?? 0.05;
    this._points = points ?? 4;
    this._width = width ?? 11;
    this._height = height ?? 4;
    this._type = "Shrimp";
  }
}

export default Shrimp;
