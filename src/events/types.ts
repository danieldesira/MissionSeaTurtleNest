import type { INonMainCharacter } from "../characters/interfaces";

export type CharacterEvents = {
  collision: {
    character: INonMainCharacter;
  };
  mateDeath: {
    character: INonMainCharacter;
  };
};

export type GameLossReason =
  | "mate_died_before_mating"
  | "out_of_oxygen"
  | "damage"
  | "out_of_food";
