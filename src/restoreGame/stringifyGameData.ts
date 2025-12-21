import { game } from "../singletons/Game";
import type GameData from "./GameData";

/**
 * Gets game state data as a JSON string.
 * @returns JSON string represantation of game data.
 * @author Daniel Desira
 */
const stringifyGameData = (): string => {
  const data: GameData = {
    turtle: {
      x: game.turtle.x,
      y: game.turtle.y,
      direction: game.turtle.direction,
      food: game.turtle.foodGauge,
      oxygen: game.turtle.oxygenGauge,
      health: game.turtle.lifeGauge,
      stomachCapacity: game.turtle.apetiteGauge,
    },
    characters: [...game.currentGameCharacterList.characters].map((c) => {
      return {
        x: c.x,
        y: c.y,
        direction: c.direction,
        type: c.type,
      };
    }),
    levelNo: game.currentLevelNo,
    xp: game.xp,
  };
  return JSON.stringify(data);
};

export default stringifyGameData;
