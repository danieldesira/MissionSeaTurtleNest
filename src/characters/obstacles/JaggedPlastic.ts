import Obstacle from "../abstract/Obstacle";
import type { CharacterOptions } from "../types";

class JaggedPlastic extends Obstacle {
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
    this._imageFilename = imageFilename ?? "jaggedPlastic.svg";
    this._damage = damage ?? 3;
    this._stomachImpact = stomachImpact ?? 3;
    this._points = points ?? -3;
    this._width = width ?? 20;
    this._height = height ?? 17;
    this._type = "JaggedPlastic";
  }
}

export default JaggedPlastic;
