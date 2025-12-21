import { game } from "../../singletons/Game";
import {
  checkBoundingBoxCollision,
  getCharacterBoundingBox,
} from "../../utils/checkCollision";
import { getCanvas } from "../../utils/ui/gameplay";
import type { INonMainCharacter } from "../interfaces";
import type { CharacterGameClassification } from "../types";
import Character from "./Character";

abstract class NonMain extends Character implements INonMainCharacter {
  protected abstract readonly _speed: number;
  protected abstract readonly _stomachImpact: number;
  protected abstract readonly _points: number;
  protected abstract readonly _type: string;
  protected abstract readonly _offscreenIndicatorColor: string;

  protected get initialPositionXFrom() {
    return 0;
  }

  protected get initialPositionXTo() {
    return game.level.bgImg.width;
  }

  protected get initialPositionYFrom() {
    return 0;
  }

  protected get initialPositionYTo() {
    return game.level.bgImg.height - this._height / 2;
  }

  get stomachImpact() {
    return this._stomachImpact;
  }

  get points() {
    return this._points;
  }

  get type() {
    return this._type;
  }

  get offscreenIndicatorColor() {
    return this._offscreenIndicatorColor;
  }

  get speed() {
    return this._speed;
  }

  abstract get gameClassification(): CharacterGameClassification;

  /**
   * Randomises initial position for character depending on the following properties:
   * <ul>
   *  <li><code>initialPositionXFrom</code></li>
   *  <li><code>initialPositionXTo</code></li>
   *  <li><code>initialPositionYFrom</code></li>
   *  <li><code>initialPositionYTo</code></li>
   * </ul>
   * @author Daniel Desira
   */
  setInitialPosition() {
    this._x =
      Math.random() * (this.initialPositionXTo - this.initialPositionXFrom) +
      this.initialPositionXFrom;
    this._y =
      Math.random() * (this.initialPositionYTo - this.initialPositionYFrom) +
      this.initialPositionYFrom;
  }

  abstract swim(): void;

  /**
   * Checks if character has just collided with turtle.
   * @author Daniel Desira
   */
  isCollidingWithTurtle() {
    const turtleBox = getCharacterBoundingBox(game.turtle);
    const characterBox = getCharacterBoundingBox(this);
    return checkBoundingBoxCollision(turtleBox, characterBox);
  }

  isOnScreen() {
    return (
      !this.isOffScreenTop() &&
      !this.isOffScreenBottom() &&
      !this.isOffScreenLeft() &&
      !this.isOffScreenRight()
    );
  }

  isOffScreenLeft() {
    const { bgOffsetX } = game.level;
    return this._x + this._width / 2 < bgOffsetX;
  }

  isOffScreenRight() {
    const { bgOffsetX } = game.level;
    const { width: canvasWidth } = getCanvas();
    return this._x - this._width / 2 > bgOffsetX + canvasWidth;
  }

  isOffScreenTop() {
    const { bgOffsetY } = game.level;
    return this._y + this._height / 2 < bgOffsetY;
  }

  isOffScreenBottom() {
    const { bgOffsetY } = game.level;
    const { height: canvasHeight } = getCanvas();
    return this._y - this._height / 2 > bgOffsetY + canvasHeight;
  }
}

export default NonMain;
