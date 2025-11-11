import type ICharacter from "./ICharacter";

interface INonMainCharacter extends ICharacter {
  swim(): void;
  handleTurtleCollision(): void;
  setInitialPosition(): void;
  get stomachImpact(): number;
  get points(): number;
  get type(): string;
  isCollidingWithTurtle(): boolean;
}

export default INonMainCharacter;
