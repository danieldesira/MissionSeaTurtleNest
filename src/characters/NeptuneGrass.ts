import BenthicPrey from "./abstract/BenthicPrey";
import { type CharacterOptions } from "./types";

class NeptuneGrass extends BenthicPrey {
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
    stomachImpact,
    points,
    width,
    height,
    speed,
  }: CharacterOptions = {}) {
    super();
    this._imageFilename = imageFilename ?? "neptuneGrass.svg";
    this._foodValue = foodValue ?? 5;
    this._stomachImpact = stomachImpact ?? 10;
    this._points = points ?? 1;
    this._width = width ?? 70;
    this._height = height ?? 55;
    this._speed = speed ?? 0;
    this._type = "NeptuneGrass";
  }
}

export default NeptuneGrass;
