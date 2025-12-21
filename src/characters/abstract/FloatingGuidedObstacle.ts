import { game } from "../../singletons/Game";
import { generateRandomBit } from "../../utils/generic";
import { swimHorizontally } from "../commonCharacterBehavior";
import Obstacle from "./Obstacle";

abstract class FloatingGuidedObstacle extends Obstacle {
  protected get initialPositionXFrom() {
    return game.level.bgImg.width / 2;
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
    swimHorizontally(this);
  }
}

export default FloatingGuidedObstacle;
