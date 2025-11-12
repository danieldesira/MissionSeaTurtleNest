import Game from "../../singletons/Game";
import { generateRandomBit, vibrate } from "../../utils/generic";
import IObstacle from "../interfaces/IObstacle";
import NonMain from "./NonMain";

abstract class Obstacle extends NonMain implements IObstacle {
  protected abstract readonly _damage: number;

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
}

export default Obstacle;
