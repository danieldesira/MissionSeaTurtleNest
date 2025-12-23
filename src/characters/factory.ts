import type { INonMainCharacter } from "./interfaces";
import Boat from "./obstacles/Boat";
import Crab from "./prey/Crab";
import NeptuneGrass from "./prey/NeptuneGrass";
import PlasticBag from "./obstacles/PlasticBag";
import Sardine from "./prey/Sardine";
import Shrimp from "./prey/Shrimp";
import Nurdle from "./obstacles/Nurdle";
import GhostNet from "./obstacles/GhostNet";
import MaleTurtle from "./MaleTurtle";
import Rope from "./obstacles/Rope";

const characterMap: { [key: string]: new () => INonMainCharacter } = {
  Boat,
  Crab,
  NeptuneGrass,
  PlasticBag,
  Sardine,
  Shrimp,
  Nurdle,
  GhostNet,
  MaleTurtle,
  Rope,
};

/**
 * Instantiates a character as indicated by a string.
 * @param className The name of the class - to match with character's type property
 * @returns The instance
 * @author Daniel Desira
 */
export const createCharacterInstance = (className: string) => {
  const CharacterConstructor = characterMap[className];
  if (CharacterConstructor) {
    return new CharacterConstructor();
  } else {
    throw new Error("Character undefined");
  }
};
