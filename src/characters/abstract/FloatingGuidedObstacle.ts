import Game from "../../singletons/Game";
import { generateRandomBit } from "../../utils/generic";
import Obstacle from "./Obstacle";

abstract class FloatingGuidedObstacle extends Obstacle {
  protected get initialPositionXFrom() {
    return Game.instance.level.bgImg.width / 2;
  }

  /**
   * Sets initial position of this obstact along the top of the screen. (Floating)
   * @override
   * @author Daniel Desira
   */
  setInitialPosition() {
    this._x =
      Math.random() * (this.initialPositionXTo - this.initialPositionXFrom) +
      this.initialPositionXFrom;
    this._y = 0;
    this.setInitialDirection();
  }

  private setInitialDirection() {
    this._direction = generateRandomBit() ? "Left" : "Right";
  }

  /**
   * Moves obstacle to and fro along the top of the screen.
   * @override
   * @author Daniel Desira
   */
  swim() {
    if (this._direction === "Left") {
      this._x -= this._speed;
      if (this._x <= 0) {
        this._direction = "Right";
      }
    } else {
      this._x += this._speed;
      if (this._x >= Game.instance.level.bgImg.width) {
        this._direction = "Left";
      }
    }
  }
}

export default FloatingGuidedObstacle;
