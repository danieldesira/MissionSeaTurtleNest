import type { HorizontalDirection } from "../types";
import type { LevelCharacter } from "./types";

export interface ILevel {
  init(context: CanvasRenderingContext2D, isFreshLevel: boolean): Promise<void>;
  get bgImg(): HTMLImageElement | null;
  set bgOffsetX(offsetX: number);
  set bgOffsetY(offsetY: number);
  get bgOffsetX(): number;
  get bgOffsetY(): number;
  get benthicOffsetY(): number;
  get currentSpeed(): number;
  get points(): number;
  get levelDescription(): string;
  get imagePath(): string;
  objectivesMet(): boolean;
  spawnPer30SecondObstacles(): void;
  get spawnableObstaclesPer30Second(): LevelCharacter[];
  get initialCharacters(): LevelCharacter[];
  get title(): string;
  get currentDirection(): HorizontalDirection;
}
