import type { INonMainCharacter } from "../characters/interfaces";

/**
 * Character events that can be emitted
 */
export type CharacterEvents = {
  collision: {
    character: INonMainCharacter;
  };
  offscreen: {
    character: INonMainCharacter;
  };
  mateSuccess: {
    points: number;
  };
  mateDeath: {
    reason: string;
  };
};
