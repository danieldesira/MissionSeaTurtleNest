import type { INonMainCharacter } from "../characters/interfaces";
import type { HorizontalDirection } from "../types";
import type { LevelCharacter, LevelInitOptions } from "./types";

export interface ILevel {
  init(options: LevelInitOptions): Promise<void>;
  get bgImg(): HTMLImageElement | null;
  set bgOffsetX(offsetX: number);
  set bgOffsetY(offsetY: number);
  get bgOffsetX(): number;
  get bgOffsetY(): number;
  get characters(): Set<INonMainCharacter>;
  get benthicOffsetY(): number;
  paintCharacters(context: CanvasRenderingContext2D): void;
  moveCharacters(): void;
  get currentSpeed(): number;
  get points(): number;
  checkIfTurtleMeetsCharacters(): void;
  get levelDescription(): string;
  get imagePath(): string;
  objectivesMet(): boolean;
  checkProspectiveMates(): void;
  spawnPer30SecondObstacles(): void;
  get spawnableObstaclesPer30Second(): LevelCharacter[];
  get initialCharacters(): LevelCharacter[];
  get title(): string;
  get currentDirection(): HorizontalDirection;
}
