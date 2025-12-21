import Game from "../../singletons/Game";
import { CharacterGameClassification } from "../types";
import Prey from "./Prey";

abstract class PackPrey extends Prey {
  private _previousCharacterX: number = 0;
  private _previousCharacterY: number = 0;
  private static readonly maxDistance = 20;

  protected get initialPositionXFrom() {
    return this._previousCharacterX
      ? this._previousCharacterX - PackPrey.maxDistance
      : 0;
  }

  protected get initialPositionXTo() {
    return this._previousCharacterX
      ? this._previousCharacterX + PackPrey.maxDistance
      : Game.instance.level.bgImg.width;
  }

  protected get initialPositionYFrom() {
    return this._previousCharacterY
      ? this._previousCharacterY - PackPrey.maxDistance
      : 0;
  }

  protected get initialPositionYTo() {
    return this._previousCharacterY
      ? this._previousCharacterY + PackPrey.maxDistance
      : Game.instance.level.bgImg.height;
  }

  set previousCharacterX(x: number) {
    this._previousCharacterX = x;
  }

  set previousCharacterY(y: number) {
    this._previousCharacterY = y;
  }

  get gameClassification(): CharacterGameClassification {
    return "PackPrey";
  }
}

export default PackPrey;
