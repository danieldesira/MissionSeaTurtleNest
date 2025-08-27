import { useEffect, useRef, useState } from "react";
import NextLevelIndication from "./NextLevelIndication";
import GameHeader from "./gameHeader/GameHeader";
import handleKeyDown from "../controls/handleKeyDown";
import handleWheel from "../controls/handleWheel";
import { useDispatch, useSelector } from "react-redux";
import RootState from "../features/RootState";
import ControlGroup from "./controls/ControlGroup";
import Game from "../Game";
import animate from "../utils/runGameLoop";
import { triggerMenuMode } from "../features/gameState/gameStateReducer";
import GameData from "../restoreGame/GameData";
import { getLastGameLocalStorage } from "../utils/lastGameLocalStorage";
import LoadingOverlay from "./LoadingOverlay";
import { resizeCanvas } from "../utils/generic";
import Dialog from "./dialog/Dialog";

type Props = { isNewGame: boolean };

const GameSection = ({ isNewGame }: Props) => {
  const isLoadingLevel = useSelector(
    (state: RootState) => state.game.isLoadingLevel.value
  );
  const currentLevelNo = useSelector(
    (state: RootState) => state.levels.level.value
  );
  const isSaving = useSelector(
    (state: RootState) => state.game.state.value === "saving"
  );
  const [error, setError] = useState<string>("");

  const dispatch = useDispatch();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleBeforeUnload = (event: Event) => {
    // Display default dialog before closing
    event.preventDefault();
    event.returnValue = false; // Required by Chrome
  };

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const canvas = canvasRef.current;

    window.addEventListener("resize", () => resizeCanvas(canvas), { signal });
    window.addEventListener("beforeunload", handleBeforeUnload, { signal });

    Game.instance
      .start({
        canvas,
        isNewGame,
        gameData: JSON.parse(getLastGameLocalStorage()) as GameData,
      })
      .then(async () => await animate(canvas))
      .catch((error) => {
        setError(error);
        dispatch(triggerMenuMode());
      });

    return () => {
      abortController.abort();

      if (Game.instance.animationTimer) {
        cancelAnimationFrame(Game.instance.animationTimer);
      }
    };
  }, []);

  return (
    <div onKeyDown={handleKeyDown}>
      <div className="flex h-screen items-center justify-center">
        <canvas
          ref={canvasRef}
          height="400"
          width="700"
          tabIndex={1}
          onWheel={handleWheel}
        ></canvas>
      </div>
      {isLoadingLevel ? (
        <LoadingOverlay message={`Loading level ${currentLevelNo}`} />
      ) : null}
      <GameHeader />
      <NextLevelIndication />
      <ControlGroup />
      {isSaving && <LoadingOverlay message="Saving..." />}
      {error && (
        <Dialog title="Error" type="error">
          {error}
        </Dialog>
      )}
    </div>
  );
};

export default GameSection;
