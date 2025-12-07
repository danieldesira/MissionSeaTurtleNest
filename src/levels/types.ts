import type { CharacterOptions } from "../characters/types";
import type { INonMainCharacter } from "../characters/interfaces";
import type { Direction } from "../types";

export type LevelCharacter = {
  Constructor: new (options?: CharacterOptions) => INonMainCharacter;
  amount: number;
  options?: CharacterOptions;
};

export type LevelConstructorOptions = {
  backgroundImageFilename: string;
  initialCharacters: LevelCharacter[];
  benthicOffsetY?: number;
  currentSpeed: number;
  points: number;
  levelDescription: string;
  title: string;
  objectives?: Array<() => boolean>;
  spawnableObstaclesPer30Second?: LevelCharacter[];
  currentDirection?: Direction;
};
