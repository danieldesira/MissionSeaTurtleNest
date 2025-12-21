import { createCharacterInstance } from "../characters/factory";
import { game } from "../singletons/Game";
import type GameData from "./GameData";

/**
 * Restore game state from JSON string.
 * @param json The game data as a JSON string.
 * @returns The parsed game data.
 * @author Daniel Desira
 */
const parseGameData = (json: string) => {
  const data = JSON.parse(json) as GameData;
  restoreTurtle(data);
  restoreGame(data);
  return data;
};

const restoreTurtle = (data: GameData) => {
  game.turtle.x = data.turtle.x;
  game.turtle.y = data.turtle.y;
  game.turtle.direction = data.turtle.direction;
  game.turtle.foodGauge = data.turtle.food;
  game.turtle.apetiteGauge = data.turtle.stomachCapacity;
  game.turtle.lifeGauge = data.turtle.health;
  game.turtle.oxygenGauge = data.turtle.oxygen;
};

const restoreGame = (data: GameData) => {
  game.currentLevelNo = data.levelNo;
  game.xp = data.xp;
};

/**
 * Restores characters into game state.
 * @param data The game data
 * @author Daniel Desira
 */
export const restoreCharacters = (data: GameData) => {
  game.currentGameCharacterList.characters.clear();

  for (const character of data.characters) {
    const temp = createCharacterInstance(character.type);
    temp.x = character.x;
    temp.y = character.y;
    game.currentGameCharacterList.characters.add(temp);
  }
};

export default parseGameData;
