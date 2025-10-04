import { Player } from "../../services/interfaces";

interface GameState {
  state: { value: "in-progress" | "menu" | "saving" };
  profile: { value: Player };
  personalBest: { value: { points: number; level: number } };
}

export default GameState;
