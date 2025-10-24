import CharacterOptions from "../characters/interfaces/CharacterOptions";
import INonMainCharacter from "../characters/interfaces/INonMainCharacter";

interface LevelCharacter {
  Constructor: new (options?: CharacterOptions) => INonMainCharacter;
  amount: number;
}

export default LevelCharacter;
