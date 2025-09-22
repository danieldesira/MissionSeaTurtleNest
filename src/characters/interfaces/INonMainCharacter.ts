import ICharacter from "./ICharacter";

export type CollisionCallbacks = {
  eat: (foodValue: number) => void;
  deductLife: (amount: number) => void;
  decrementApetite: (amount: number) => void;
  gainPoints: (points: number) => void;
};

interface INonMainCharacter extends ICharacter {
  swim(): void;
  handleTurtleCollision(apetite: number, callbacks: CollisionCallbacks): void;
  setInitialPosition(): void;
  get stomachImpact(): number;
  get points(): number;
  get type(): string;
  isCollidingWithTurtle(): boolean;
}

export default INonMainCharacter;
