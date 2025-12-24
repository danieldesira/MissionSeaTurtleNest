import { eventEmitter } from "../../events/EventEmitter";
import { game } from "../../singletons/Game";
import {
  checkBoundingBoxCollision,
  getCharacterBoundingBox,
} from "../../utils/checkCollision";
import { generateRandomBit } from "../../utils/generic";
import { launchCustomDialog } from "../../utils/ui/customDialog";
import { swimHorizontally } from "../commonCharacterBehavior";
import type { IProspectiveMate } from "../interfaces";
import type { CharacterGameClassification } from "../types";
import NonMain from "./NonMain";
import type Obstacle from "./Obstacle";

abstract class ProspectiveMate extends NonMain implements IProspectiveMate {
  protected _speed: number = 2;
  protected _stomachImpact: number = 0;
  protected _points: number = 100;
  protected _offscreenIndicatorColor: string = "rgba(0,255,0, 0.5)";
  protected _life: number = 100;

  get gameClassification(): CharacterGameClassification {
    return "Mate";
  }

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

  swim() {
    swimHorizontally(this);
  }

  checkCurrentObstacleCollisions() {
    game.currentGameCharacterList.characters.forEach((c) => {
      if (
        c.gameClassification === "Obstacle" &&
        checkBoundingBoxCollision(
          getCharacterBoundingBox(this),
          getCharacterBoundingBox(c)
        )
      ) {
        this._life -= (c as Obstacle).damage;
        game.currentGameCharacterList.characters.delete(c);
        if (this._life <= 0) {
          eventEmitter.emit("mateDeath", { character: this });
        }
      }
    });
  }
}

export default ProspectiveMate;
