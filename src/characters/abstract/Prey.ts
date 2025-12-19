import Game from "../../singletons/Game";
import type { IPrey } from "../interfaces";
import type { GharacterGameClassification } from "../types";
import NonMain from "./NonMain";

abstract class Prey extends NonMain implements IPrey {
  protected abstract readonly _foodValue: number;
  protected readonly _offscreenIndicatorColor: string = "rgba(0, 255, 0, 0.5)";

  get foodValue() {
    return this._foodValue;
  }

  get gameClassification(): GharacterGameClassification {
    return "Prey";
  }

  /**
   * Implements prey behaviour for collision with turtle.
   * i.e.: check if turtle has enough stomach capacity,
   * increase food value and apply default behaviour
   * @override
   * @author Daniel Desira
   */
  handleTurtleCollision(): void {
    const canTurtleEatCharacter =
      Game.instance.turtle.apetiteGauge - this._stomachImpact > 0;
    if (canTurtleEatCharacter) {
      Game.instance.turtle.eat(this._foodValue);
      super.handleTurtleCollision();
    }
  }

  /**
   * Swim and respond to turtle approaching. Keeps to the same direction of the turtle.
   * @override
   * @author Daniel Desira
   */
  swim(): void {
    const maxPreyDistance = 150;
    const turtle = Game.instance.turtle;
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
            !Game.instance.level.benthicOffsetY ||
            this._y <= Game.instance.level.benthicOffsetY
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
