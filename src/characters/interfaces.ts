import type { Direction } from "../types";

export interface ICharacter {
  loadImage(): Promise<void>;
  paint(
    context: CanvasRenderingContext2D,
    bgOffsetX?: number,
    bgOffsetY?: number
  ): void;
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
}

export interface INonMainCharacter extends ICharacter {
  swim(): void;
  handleTurtleCollision(): void;
  setInitialPosition(): void;
  get stomachImpact(): number;
  get points(): number;
  get type(): string;
  isCollidingWithTurtle(): boolean;
}

export interface IObstacle {
  get damage(): number;
}

export interface IPrey {
  get foodValue(): number;
}
