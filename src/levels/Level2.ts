import Boat from "../characters/Boat";
import Crab from "../characters/Crab";
import NeptuneGrass from "../characters/NeptuneGrass";
import PlasticBag from "../characters/PlasticBag";
import Shrimp from "../characters/Shrimp";
import Level from "./Level";
import LevelCharacter from "./LevelCharacter";

class Level2 extends Level {
  protected readonly _backgroundImageFilename: string = "level2.png";
  protected readonly _initialCharacters: LevelCharacter[] = [
    { Constructor: PlasticBag, amount: 10 },
    { Constructor: NeptuneGrass, amount: 4 },
    { Constructor: Shrimp, amount: 30 },
    { Constructor: Crab, amount: 5 },
    { Constructor: Boat, amount: 1 },
  ];
  protected readonly _benthicOffsetY: number = 550;
  protected readonly _currentSpeed: number = 0.15;
  protected readonly _points: number = 10;
  protected readonly _levelDescription: string[] = [
    "Mind the boat. It injures sea turtles but in the game it will kill you instantly!",
    "You may also eat crabs at the bottom for extra points!",
    "Avoid plastic bags as these impact your appetite and cause damage.",
    "Move around using the arrow keys.",
    "Reach the right end of the level to complete it.",
    "Good luck!",
  ];
}

export default Level2;
