import { TurtleStats } from "../components/gameplay/types";
import Game from "../Game";
import store from "../store";
import GameData from "./GameData";

/**
 * Gets game data as a JSON string.
 * @returns JSON string represantation of game data.
 * @author Daniel Desira
 */
const stringifyGameData = (turtleStats: TurtleStats): string => {
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
    levelNo: turtleStats.level,
    xp: turtleStats.xp,
  };
  return JSON.stringify(data);
};

export default stringifyGameData;
