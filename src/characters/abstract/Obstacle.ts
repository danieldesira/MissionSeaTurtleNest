import Game from "../../singletons/Game";
import { Direction } from "../../types";
import { generateRandomBit, vibrate } from "../../utils/generic";
import { paintCharacter } from "../commonCharacterBehavior";
import type { IObstacle } from "../interfaces";
import NonMain from "./NonMain";

abstract class Obstacle extends NonMain implements IObstacle {
  protected abstract readonly _damage: number;
  protected readonly _offscreenIndicatorColor: string = "rgba(255, 0, 0, 0.5)";
  protected _direction: Direction = "Left";

  get damage() {
    return this._damage;
  }

  /**
   * Responds to collision with turtle.
   * i.e.: decrease health and apply default behaviour
   * @override
   * @author Daniel Desira
   */
  handleTurtleCollision() {
    Game.instance.turtle.takeDamage(this._damage);
    super.handleTurtleCollision();
    vibrate();
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
