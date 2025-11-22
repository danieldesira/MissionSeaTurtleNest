import type { Direction } from "../types";

export interface ICharacter {
  loadImage(): Promise<void>;
  paint(context: CanvasRenderingContext2D): void;
  get x(): number;
  get y(): number;
  set x(x: number);
  set y(y: number);
  get image(): HTMLImageElement;
  get height(): number;
  get width(): number;
  get direction(): Direction;
  set direction(direction: Direction);
  get imagePath(): string;
}

export interface IMainCharacter {
  resetPosition(): void;
  get direction(): Direction;
  moveUp(): void;
  moveDown(): void;
  moveLeft(): void;
  moveRight(): void;
  set isPregnant(value: boolean);
  get isPregnant(): boolean;
  get foodGauge(): number;
  set foodGauge(value: number);
  get lifeGauge(): number;
  set lifeGauge(value: number);
  get apetiteGauge(): number;
  set apetiteGauge(value: number);
  get oxygenGauge(): number;
  set oxygenGauge(value: number);
}

export interface INonMainCharacter extends ICharacter {
  swim(): void;
  handleTurtleCollision(): void;
  setInitialPosition(): void;
  get stomachImpact(): number;
  get points(): number;
  get type(): string;
  isCollidingWithTurtle(): boolean;
  isOnScreen(): boolean;
  paintOffScreenIndicator(context: CanvasRenderingContext2D): void;
}

export interface IObstacle {
  get damage(): number;
}

export interface IPrey {
  get foodValue(): number;
}

export interface IProspectiveMate extends ICharacter {
  checkCurrentObstacleCollisions(): void;
}
