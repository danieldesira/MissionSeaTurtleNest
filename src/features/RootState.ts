import AuthenticationState from "./authentication/AuthenticationState";
import GameState from "./gameState/GameState";

interface RootState {
  game: GameState;
  authentication: AuthenticationState;
}

export default RootState;
