import Game from "../../singletons/Game";
import {
  checkBoundingBoxCollision,
  getCharacterBoundingBox,
} from "../../utils/checkCollision";
import { generateRandomBit } from "../../utils/generic";
import { launchCustomDialog } from "../../utils/ui/customDialog";
import { launchHeartMatingAnimation } from "../../utils/ui/gameplay";
import { updateXpSpan } from "../../utils/ui/xp";
import { swimHorizontally } from "../commonCharacterBehavior";
import type { IMainCharacter, IProspectiveMate } from "../interfaces";
import NonMain from "./NonMain";
import Obstacle from "./Obstacle";

abstract class ProspectiveMate extends NonMain implements IProspectiveMate {
  protected _speed: number = 2;
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
    turtle.isMama = true;
  }

  handleTurtleCollision() {
    if (!Game.instance.turtle.isMama) {
      launchHeartMatingAnimation();
      this.mateWithFemale(Game.instance.turtle);
      Game.instance.gainPoints(this._points);
      updateXpSpan();
    }
  }

  swim() {
    swimHorizontally(this);
  }

  checkCurrentObstacleCollisions() {
    Game.instance.level.characters.forEach((c) => {
      if (
        c instanceof Obstacle &&
        checkBoundingBoxCollision(
          getCharacterBoundingBox(this),
          getCharacterBoundingBox(c)
        )
      ) {
        this._life -= c.damage;
        Game.instance.level.characters.delete(c);
        if (this._life <= 0) {
          Game.instance.level.characters.delete(this);
          launchCustomDialog(
            "Mate died",
            "Prospective mate died. In case you didn't mate yet, game over!"
          );
        }
      }
    });
  }
}

export default ProspectiveMate;
