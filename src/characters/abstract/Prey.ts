import { game } from "../../singletons/Game";
import { generateRandomBit } from "../../utils/generic";
import type { IPrey } from "../interfaces";
import type { CharacterGameClassification } from "../types";
import NonMain from "./NonMain";

abstract class Prey extends NonMain implements IPrey {
  protected abstract readonly _foodValue: number;
  protected readonly _offscreenIndicatorColor: string = "rgba(0, 255, 0, 0.5)";
  private _hasRandomisedLeftRight: boolean = false;

  get foodValue() {
    return this._foodValue;
  }

  get gameClassification(): CharacterGameClassification {
    return "Prey";
  }

  /**
   * Swim and respond to turtle approaching. Applies the following principles:
   * <ul>
   *  <li>Prey to respond if turtle is following it closely</li>
   *  <li>Prey to change direction to turtle's direction</li>
   *  <li>If prey can no longer go up or down, it randomises direction to left or right</li>
   * </ul>
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
      switch (turtle.direction) {
        case "Left":
          this._hasRandomisedLeftRight = false;
          if (turtle.x >= this._x) {
            this._direction = "Left";
            this._x -= this._speed;
          }
          break;
        case "Right":
          this._hasRandomisedLeftRight = false;
          if (turtle.x <= this._x) {
            this._direction = "Right";
            this._x += this._speed;
          }
          break;
        case "Down":
          if (
            !game.level.benthicOffsetY ||
            this._y <= game.level.benthicOffsetY
          ) {
            if (turtle.y <= this._y) {
              this._direction = "Down";
              this._y += this._speed;
            }
          } else {
            this.randomiseLeftRightSwimming();
          }
          break;
        case "Up":
          if (this._y > 0) {
            if (turtle.y >= this._y) {
              this._direction = "Up";
              this._y -= this._speed;
            }
          } else {
            this.randomiseLeftRightSwimming();
          }
          break;
      }
    }
  }

  private randomiseLeftRightSwimming() {
    if (!this._hasRandomisedLeftRight) {
      this._hasRandomisedLeftRight = true;
      this._direction = generateRandomBit() ? "Right" : "Left";
    }
    switch (this._direction) {
      case "Left":
        this._x -= this._speed;
        break;
      case "Right":
        this._x += this._speed;
        break;
    }
  }
}

export default Prey;
