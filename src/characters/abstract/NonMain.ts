import Game from "../../Game";
import checkBoundingBoxCollision, {
  getCharacterBoundingBox,
} from "../../utils/checkCollision";
import INonMainCharacter from "../interfaces/INonMainCharacter";
import Character from "./Character";

abstract class NonMain extends Character implements INonMainCharacter {
  protected abstract readonly _speed: number;
  protected abstract readonly _stomachImpact: number;
  protected abstract readonly _points: number;
  protected abstract readonly _type: string;

  protected get initialPositionXFrom(): number {
    return 0;
  }

  protected get initialPositionXTo(): number {
    return Game.instance.level.bgImg.width;
  }

  protected get initialPositionYFrom(): number {
    return 0;
  }

  protected get initialPositionYTo(): number {
    return Game.instance.level.bgImg.height;
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
  setInitialPosition(): void {
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
  handleTurtleCollision(): void {
    callbacks.decrementApetite(this._stomachImpact);
    callbacks.gainPoints(this._points);
    Game.instance.level.characters.delete(this);
  }

  abstract swim(): void;

  /**
   * Checks if character has just collided with turtle.
   * @author Daniel Desira
   */
  isCollidingWithTurtle(): boolean {
    const turtleBox = getCharacterBoundingBox(Game.instance.turtle);
    const characterBox = getCharacterBoundingBox(this);
    return checkBoundingBoxCollision(turtleBox, characterBox);
  }
}

export default NonMain;
