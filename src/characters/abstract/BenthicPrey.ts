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

  paint(context: CanvasRenderingContext2D): void {
    if (this._image) {
      context.drawImage(
        this._image,
        this._x - Game.instance.level.bgOffsetX - this._width / 2,
        this._y - Game.instance.level.bgOffsetY - this._height / 2,
        this._width,
        this._height
      );
    }
  }
}

export default BenthicPrey;
