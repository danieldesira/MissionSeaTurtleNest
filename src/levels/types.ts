import { type CharacterOptions } from "../characters/types";
import type INonMainCharacter from "../characters/interfaces/INonMainCharacter";

export type LevelCharacter = {
  Constructor: new (options?: CharacterOptions) => INonMainCharacter;
  amount: number;
};

export type LevelConstructorOptions = {
  backgroundImageFilename: string;
  initialCharacters: LevelCharacter[];
  benthicOffsetY: number;
  currentSpeed: number;
  points: number;
  levelDescription: string[];
};
