import Game from "../singletons/Game";
import createCharacterInstance from "../characters/createCharacterInstance";
import GameData from "./GameData";

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
  Game.instance.turtle.x = data.turtle.x;
  Game.instance.turtle.y = data.turtle.y;
  Game.instance.turtle.direction = data.turtle.direction;
  Game.instance.turtle.foodGauge = data.turtle.food;
  Game.instance.turtle.apetiteGauge = data.turtle.stomachCapacity;
  Game.instance.turtle.lifeGauge = data.turtle.health;
  Game.instance.turtle.oxygenGauge = data.turtle.oxygen;
};

const restoreGame = (data: GameData) => {
  Game.instance.currentLevelNo = data.levelNo;
  Game.instance.xp = data.xp;
};

/**
 * Restores characters into game state.
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
