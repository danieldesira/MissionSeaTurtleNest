import Game from "../../singletons/Game";
import { generateRandomBit } from "../../utils/generic";
import {
  launchHeartMatingAnimation,
  updateXpSpan,
} from "../../utils/ui/gameplay";
import type { IMainCharacter, IProspectiveMate } from "../interfaces";
import NonMain from "./NonMain";
import Obstacle from "./Obstacle";

abstract class ProspectiveMate extends NonMain implements IProspectiveMate {
  protected _speed: number = 5;
  protected _stomachImpact: number = 0;
  protected _points: number = 100;
  protected _offscreenIndicatorColor: string = "rgba(0,255,0, 0.5)";
  protected _life: number = 100;

  setInitialPosition() {
    this._x =
      Math.random() * (this.initialPositionXTo - this.initialPositionXFrom) +
      this.initialPositionXFrom;
    this._y = 50;
    this.setInitialDirection();
  }

  private setInitialDirection() {
    this._direction = generateRandomBit() ? "Left" : "Right";
  }

  private mateWithFemale(turtle: IMainCharacter) {
    turtle.isPregnant = true;
  }

  handleTurtleCollision() {
    if (!Game.instance.turtle.isPregnant) {
      launchHeartMatingAnimation();
      this.mateWithFemale(Game.instance.turtle);
      Game.instance.gainPoints(this._points);
      updateXpSpan();
    }
  }

  swim() {
    if (this._direction === "Right") {
      this._x += this._speed;
      if (this._x >= Game.instance.level.bgImg.width) {
        this._direction = "Left";
      }
    } else {
      this._x -= this._speed;
      if (this._x <= 0) {
        this._direction = "Right";
      }
    }
  }

  checkCurrentObstacleCollisions() {
    Game.instance.level.characters.forEach((c) => {
      if (c instanceof Obstacle) {
        this._life -= c.damage;
        Game.instance.level.characters.delete(c);
      }
    });
  }
}

export default ProspectiveMate;
