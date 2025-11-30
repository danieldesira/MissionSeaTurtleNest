import Game from "../../singletons/Game";
import { Direction } from "../../types";
import { generateRandomBit, vibrate } from "../../utils/generic";
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
    this._x -= speed;
    const randomVerticalDirection = generateRandomBit();
    this._y += randomVerticalDirection ? speed : -speed;
  }

  paint(context: CanvasRenderingContext2D) {
    if (this._image) {
      context.save();
      context.translate(
        this._x - Game.instance.level.bgOffsetX,
        this._y - Game.instance.level.bgOffsetY
      );
      context.drawImage(
        this._image,
        -this._width / 2,
        -this._height / 2,
        this._width,
        this._height
      );
      context.restore();
    }
  }
}

export default Obstacle;
