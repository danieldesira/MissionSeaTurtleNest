import PlasticBag from "../characters/PlasticBag";
import Sardine from "../characters/Sardine";
import Shrimp from "../characters/Shrimp";
import Level from "./Level";
import LevelCharacter from "./LevelCharacter";

class Level1 extends Level {
  protected readonly _backgroundImageFilename: string = "level1.png";
  protected readonly _initialCharacters: LevelCharacter[] = [
    { Constructor: Shrimp, amount: 20 },
    { Constructor: Sardine, amount: 10 },
    { Constructor: PlasticBag, amount: 8 },
  ];
  protected readonly _benthicOffsetY: number = 9999;
  protected readonly _currentSpeed: number = 0.1;
  protected readonly _points: number = 10;
  protected readonly _levelDescription: string[] = [
    "Welcome to the warm up level!",
    "You need to avoid the plastic bags and eat the shrimp and sardines.",
    "You can move around using the arrow keys.",
    "Reach the right end of the level to complete it.",
    "Good luck!",
  ];
}

export default Level1;
