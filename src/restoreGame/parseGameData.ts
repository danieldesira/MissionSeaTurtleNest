import { Dispatch, SetStateAction } from "react";
import Game from "../Game";
import createCharacterInstance from "../characters/createCharacterInstance";
import store from "../store";
import GameData from "./GameData";
import { TurtleStats } from "../components/gameplay/types";

/**
 * Restore game state from JSON string.
 * @param json The game data as a JSON string.
 * @author Daniel Desira
 */
const parseGameData = (
  json: string,
  setTurtleStats: Dispatch<SetStateAction<TurtleStats>>
) => {
  const data = JSON.parse(json) as GameData;
  restoreTurtle(data);
  restoreState(data, setTurtleStats);
};

const restoreTurtle = (data: GameData) => {
  Game.instance.turtle.x = data.turtle.x;
  Game.instance.turtle.y = data.turtle.y;
  Game.instance.turtle.direction = data.turtle.direction;
};

const restoreState = (
  data: GameData,
  setTurtleStats: Dispatch<SetStateAction<TurtleStats>>
) =>
  setTurtleStats({
    food: data.turtle.food,
    physicalCondition: data.turtle.health,
    oxygen: data.turtle.oxygen,
    apetite: data.turtle.stomachCapacity,
    level: data.levelNo,
    xp: data.xp,
  });

/**
 * Restores characters
 * @param data The game data
 * @author Daniel Desira
 */
export const restoreCharacters = (data: GameData) => {
  Game.instance.level.characters.clear();

  for (const character of data.characters) {
    const temp = createCharacterInstance(character.type);
    temp.x = character.x;
    temp.y = character.y;
    Game.instance.level.characters.add(temp);
  }
};

export default parseGameData;
