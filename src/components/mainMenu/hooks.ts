import { Dispatch, SetStateAction } from "react";
import { useDispatch } from "react-redux";
import { triggerGameMode } from "../../features/gameState/gameStateReducer";
import { getLastGameLocalStorage } from "../../utils/lastGameLocalStorage";
import parseGameData from "../../restoreGame/parseGameData";
import { TurtleStats } from "../gameplay/types";

export const useGameStartActions = (
  setIsNewGame: Dispatch<SetStateAction<boolean>>,
  setTurtleStats: Dispatch<SetStateAction<TurtleStats>>
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
      parseGameData(getLastGameLocalStorage(), setTurtleStats);
    },
  };
};
