import Game from "../../singletons/Game";
import { paintCircle } from "../../utils/canvas";
import {
  checkBoundingBoxCollision,
  getCharacterBoundingBox,
} from "../../utils/checkCollision";
import { getCanvas } from "../../utils/ui/gameplay";
import { updateXpSpan } from "../../utils/ui/xp";
import type { INonMainCharacter } from "../interfaces";
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
    return Game.instance.level.bgImg.width;
  }

  protected get initialPositionYFrom() {
    return 0;
  }

  protected get initialPositionYTo() {
    return Game.instance.level.bgImg.height - this._height / 2;
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

  /**
   * Default response to collision with turtle.
   * i.e.: decrementing stomach capacity,
   * applying points (+ve/-ve) and deleting character from set
   * @author Daniel Desira
   */
  handleTurtleCollision() {
    Game.instance.turtle.decrementApetite(this._stomachImpact);
    Game.instance.gainPoints(this._points);
    Game.instance.level.characters.delete(this);
    updateXpSpan();
  }

  abstract swim(): void;

  /**
   * Checks if character has just collided with turtle.
   * @author Daniel Desira
   */
  isCollidingWithTurtle() {
    const turtleBox = getCharacterBoundingBox(Game.instance.turtle);
    const characterBox = getCharacterBoundingBox(this);
    return checkBoundingBoxCollision(turtleBox, characterBox);
  }

  isOnScreen() {
    const { bgOffsetX, bgOffsetY } = Game.instance.level;
    const { width: canvasWidth, height: canvasHeight } = getCanvas();
    return (
      bgOffsetX < this._x + this._width / 2 &&
      this._x - this._width / 2 < bgOffsetX + canvasWidth &&
      bgOffsetY < this._y + this._height / 2 &&
      this._y - this._height / 2 < bgOffsetY + canvasHeight
    );
  }

  private isOffScreenLeft() {
    const { bgOffsetX } = Game.instance.level;
    return this._x + this._width / 2 < bgOffsetX;
  }

  private isOffScreenRight() {
    const { bgOffsetX } = Game.instance.level;
    const { width: canvasWidth } = getCanvas();
    return this._x - this._width / 2 > bgOffsetX + canvasWidth;
  }

  private isOffScreenTop() {
    const { bgOffsetY } = Game.instance.level;
    return this._y + this._height / 2 < bgOffsetY;
  }

  private isOffScreenBottom() {
    const { bgOffsetY } = Game.instance.level;
    const { height: canvasHeight } = getCanvas();
    return this._y - this._height / 2 > bgOffsetY + canvasHeight;
  }

  paintOffScreenIndicator(context: CanvasRenderingContext2D) {
    const radius = 10;
    if (this.isOffScreenLeft()) {
      const x = 10;
      paintCircle(context, x, this._y, radius, this._offscreenIndicatorColor);
    } else if (this.isOffScreenRight()) {
      const x = getCanvas().width - 10;
      paintCircle(context, x, this._y, radius, this._offscreenIndicatorColor);
    } else if (this.isOffScreenTop()) {
      const y = 10;
      paintCircle(context, this._x, y, radius, this._offscreenIndicatorColor);
    } else if (this.isOffScreenBottom()) {
      const y = getCanvas().height - 10;
      paintCircle(context, this._x, y, radius, this._offscreenIndicatorColor);
    }
  }
}

export default NonMain;
