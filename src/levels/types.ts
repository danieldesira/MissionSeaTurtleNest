import { type CharacterOptions } from "../characters/types";
import INonMainCharacter from "../characters/interfaces/INonMainCharacter";

export type LevelCharacter = {
  Constructor: new (options?: CharacterOptions) => INonMainCharacter;
  amount: number;
};
