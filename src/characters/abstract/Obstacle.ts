import Game from "../../singletons/Game";
import type { Direction } from "../../types";
import { generateRandomBit } from "../../utils/generic";
import { paintCharacter } from "../commonCharacterBehavior";
import type { IObstacle } from "../interfaces";
import type { CharacterGameClassification } from "../types";
import NonMain from "./NonMain";

abstract class Obstacle extends NonMain implements IObstacle {
  protected abstract readonly _damage: number;
  protected readonly _offscreenIndicatorColor: string = "rgba(255, 0, 0, 0.5)";
  protected _direction: Direction = "Left";

  get damage() {
    return this._damage;
  }

  get gameClassification(): CharacterGameClassification {
    return "Obstacle";
  }

  /**
   * Moves towards the left and apply random movement up and down.
   * @override
   * @author Daniel Desira
   */
  swim() {
    const speed = Game.instance.level.currentSpeed;
    if (Game.instance.level.currentDirection === "Left") {
      this._x -= speed;
    } else {
      this._x += speed;
    }
    const randomVerticalDirection = generateRandomBit();
    this._y += randomVerticalDirection ? speed : -speed;
  }

  paint(context: CanvasRenderingContext2D) {
    paintCharacter({ context, character: this });
  }
}

export default Obstacle;
