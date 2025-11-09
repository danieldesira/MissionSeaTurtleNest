import PackPrey from "./abstract/PackPrey";
import type { CharacterOptions } from "./types";

class Sardine extends PackPrey {
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
    this._imageFilename = imageFilename ?? "sardine.svg";
    this._foodValue = foodValue ?? 0.6;
    this._speed = speed ?? 1.3;
    this._stomachImpact = stomachImpact ?? 1;
    this._points = points ?? 10;
    this._width = width ?? 15;
    this._height = height ?? 6;
    this._type = "Sardine";
  }
}

export default Sardine;
