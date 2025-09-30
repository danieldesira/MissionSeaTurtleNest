import Game from "../Game";
import GameData from "./GameData";

/**
 * Gets game data as a JSON string.
 * @returns JSON string represantation of game data.
 * @author Daniel Desira
 */
const stringifyGameData = (): string => {
  const data: GameData = {
    turtle: {
      x: Game.instance.turtle.x,
      y: Game.instance.turtle.y,
      direction: Game.instance.turtle.direction,
      food: Game.instance.turtle.foodGauge,
      oxygen: Game.instance.turtle.oxygenGauge,
      health: Game.instance.turtle.lifeGauge,
      stomachCapacity: Game.instance.turtle.apetiteGauge,
    },
    characters: [...Game.instance.level.characters].map((c) => {
      return {
        x: c.x,
        y: c.y,
        direction: c.direction,
        type: c.type,
      };
    }),
    levelNo: Game.instance.level.levelNo,
    xp: Game.instance.xp,
  };
  return JSON.stringify(data);
};

export default stringifyGameData;
