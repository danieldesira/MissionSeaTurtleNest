import NonMain from "./abstract/NonMain";
import Boat from "./obstacles/Boat";
import Crab from "./prey/Crab";
import NeptuneGrass from "./prey/NeptuneGrass";
import PlasticBag from "./obstacles/PlasticBag";
import Sardine from "./prey/Sardine";
import Shrimp from "./prey/Shrimp";

const characterMap: { [key: string]: new () => NonMain } = {
  Boat: Boat,
  Crab: Crab,
  NeptuneGrass: NeptuneGrass,
  PlasticBag: PlasticBag,
  Sardine: Sardine,
  Shrimp: Shrimp,
};

/**
 * Instantiates a character as indicated by a string.
 * @param className The name of the class - to match with character's type property
 * @returns The instance
 * @author Daniel Desira
 */
export const createCharacterInstance = (className: string): NonMain => {
  const CharacterConstructor = characterMap[className];
  if (CharacterConstructor) {
    return new CharacterConstructor();
  } else {
    throw new Error("Character undefined");
  }
};
