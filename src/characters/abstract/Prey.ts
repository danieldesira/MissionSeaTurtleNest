import { game } from "../../singletons/Game";
import type { IPrey } from "../interfaces";
import type { CharacterGameClassification } from "../types";
import NonMain from "./NonMain";

abstract class Prey extends NonMain implements IPrey {
  protected abstract readonly _foodValue: number;
  protected readonly _offscreenIndicatorColor: string = "rgba(0, 255, 0, 0.5)";

  get foodValue() {
    return this._foodValue;
  }

  get gameClassification(): CharacterGameClassification {
    return "Prey";
  }

  /**
   * Swim and respond to turtle approaching. Keeps to the same direction of the turtle.
   * @override
   * @author Daniel Desira
   */
  swim(): void {
    const maxPreyDistance = 150;
    const turtle = game.turtle;
    const horizontalDistance = Math.abs(turtle.x - this._x);
    const verticalDistance = Math.abs(turtle.y - this._y);
    if (
      horizontalDistance < maxPreyDistance &&
      verticalDistance < maxPreyDistance
    ) {
      this._direction = turtle.direction;
      switch (turtle.direction) {
        case "Left":
          this._x -= this._speed;
          break;
        case "Right":
          this._x += this._speed;
          break;
        case "Down":
          if (
            !game.level.benthicOffsetY ||
            this._y <= game.level.benthicOffsetY
          ) {
            this._y += this._speed;
          }
          break;
        case "Up":
          if (this._y > 0) {
            this._y -= this._speed;
          }
          break;
      }
    }
  }
}

export default Prey;
