import Obstacle from "../abstract/Obstacle";
import { CharacterOptions } from "../types";

class GhostNet extends Obstacle {
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
    this._imageFilename = imageFilename ?? "ghostNet.svg";
    this._damage = damage ?? 100;
    this._stomachImpact = stomachImpact ?? 20;
    this._points = points ?? -20;
    this._width = width ?? 100;
    this._height = height ?? 75;
    this._type = "GhostNet";
  }
}

export default GhostNet;
