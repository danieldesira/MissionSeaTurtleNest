import Game from "../../singletons/Game";
import {
  checkBoundingBoxCollision,
  getCharacterBoundingBox,
} from "../../utils/checkCollision";
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

  /**
   * Checks whether obstacle collided with turtle. Adapted for objects that don't have a
   * change in coordinates for a left/right direction change.
   * @returns Flag showing collision.
   * @override
   * @author Daniel Desira
   */
  isCollidingWithTurtle() {
    const turtleBox = getCharacterBoundingBox(Game.instance.turtle);
    const obstacleBox = {
      minX: this._x,
      maxX: this._x + this._width,
      minY: this._y,
      maxY: this._y + this._height,
    };
    return checkBoundingBoxCollision(turtleBox, obstacleBox);
  }

  paint(context: CanvasRenderingContext2D) {
    if (this._image) {
      context.drawImage(
        this._image,
        this._x - this._width / 2,
        this._y - this._height / 2,
        this._width,
        this._height
      );
    }
  }
}

export default FloatingGuidedObstacle;
