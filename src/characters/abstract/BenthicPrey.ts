import Game from "../../singletons/Game";
import Prey from "./Prey";

abstract class BenthicPrey extends Prey {
  protected get initialPositionYFrom() {
    return Game.instance.level.benthicOffsetY;
  }

  /**
   * Moves randomly along the x axis.
   * @override
   * @author Daniel Desira
   */
  swim() {
    const randomHorizontalDirection = Math.round(Math.random());
    this._x += randomHorizontalDirection ? this._speed : -this._speed;
  }
}

export default BenthicPrey;
