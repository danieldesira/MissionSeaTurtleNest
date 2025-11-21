import Obstacle from "../abstract/Obstacle";
import { CharacterOptions } from "../types";

class Nurdle extends Obstacle {
  protected readonly _imageFilename: string;
  protected readonly _damage: number;
  protected readonly _speed: number;
  protected readonly _stomachImpact: number;
  protected readonly _points: number;
  protected readonly _width: number;
  protected readonly _height: number;
  protected readonly _type: string;

  constructor({
    imageFilename,
    damage,
    stomachImpact,
    points,
    width,
    height,
  }: CharacterOptions = {}) {
    super();
    this._imageFilename = imageFilename ?? "nurdle.svg";
    this._damage = damage ?? 0.001;
    this._stomachImpact = stomachImpact ?? 0.001;
    this._points = points ?? -1;
    this._width = width ?? 5;
    this._height = height ?? 5;
    this._type = "Nurdle";
  }
}

export default Nurdle;
