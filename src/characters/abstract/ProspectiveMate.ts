import type { IMainCharacter, IProspectiveMate } from "../interfaces";
import NonMain from "./NonMain";

abstract class ProspectiveMate extends NonMain implements IProspectiveMate {
  protected _speed: number = 25;
  protected _stomachImpact: number = 0;
  protected _points: number = 100;
  protected _offscreenIndicatorColor: string = "rgba(0,255,0, 0.5)";

  mateWithFemale(turtle: IMainCharacter) {
    turtle.isPregnant = true;
  }

  swim() {
    throw new Error("Method not implemented.");
  }
}

export default ProspectiveMate;
