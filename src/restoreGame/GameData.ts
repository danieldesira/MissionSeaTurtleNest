import { Direction } from "../constants";

type GameData = {
  turtle: TurtleData;
  characters: CharacterData[];
  levelNo: number;
  xp: number;
};

type TurtleData = {
  x: number;
  y: number;
  direction: Direction;
  oxygen: number;
  food: number;
  health: number;
  stomachCapacity: number;
};

type CharacterData = {
  type: string;
  x: number;
  y: number;
  direction: Direction;
};

export default GameData;
