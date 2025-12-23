import Obstacle from "../abstract/Obstacle";
import type { CharacterOptions } from "../types";

class NewObstacle extends Obstacle {
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
    this._imageFilename = imageFilename ?? "newObstacle.svg";
    this._damage = damage ?? 8;
    this._stomachImpact = stomachImpact ?? 20;
    this._points = points ?? -20;
    this._width = width ?? 45;
    this._height = height ?? 45;
    this._type = "NewObstacle";
  }
}

export default NewObstacle;
