import { Dispatch, SetStateAction } from "react";
import { useDispatch } from "react-redux";
import { triggerGameMode } from "../../features/gameState/gameStateReducer";

export const useGameStartActions = (
  setIsNewGame: Dispatch<SetStateAction<boolean>>
) => {
  const dispatch = useDispatch();

  return {
    startNewGame() {
      setIsNewGame(true);
      dispatch(triggerGameMode());
    },
    continuePreviousGame() {
      setIsNewGame(false);
      dispatch(triggerGameMode());
    },
  };
};
