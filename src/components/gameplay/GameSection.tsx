import { useEffect, useRef, useState } from "react";
import NextLevelIndication from "./NextLevelIndication";
import GameHeader from "./gameHeader/GameHeader";
import { useDispatch, useSelector } from "react-redux";
import RootState from "../../features/RootState";
import ControlGroup from "./controls/ControlGroup";
import Game from "../../Game";
import { triggerMenuMode } from "../../features/gameState/gameStateReducer";
import GameData from "../../restoreGame/GameData";
import { getLastGameLocalStorage } from "../../utils/lastGameLocalStorage";
import LoadingOverlay from "../LoadingOverlay";
import { resizeCanvas } from "../../utils/generic";
import Dialog from "../dialog/Dialog";
import { useRunGameLoop } from "./hooks";
import { DialogContent } from "./types";

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
  const [isGamePaused, setIsGamePaused] = useState<boolean>(true);
  const [dialogContent, setDialogContent] = useState<DialogContent>({
    title: "",
    message: "",
    type: "default",
  });

  const dispatch = useDispatch();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runGameLoop = useRunGameLoop({
    isGamePaused,
    setIsGamePaused,
    setDialogContent,
  });

  const handleBeforeUnload = (event: Event) => {
    // Display default dialog before closing
    event.preventDefault();
    event.returnValue = false; // Required by Chrome
  };

  const handleDialogClose = () => {
    setDialogContent({ title: "", message: "", type: "default" });
    setIsGamePaused(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isGamePaused) {
      const upKeys = ["w", "W", "ArrowUp"];
      const downKeys = ["s", "S", "ArrowDown"];
      const leftKeys = ["a", "A", "ArrowLeft"];
      const rightKeys = ["d", "D", "ArrowRight"];

      const mainCharacter = Game.instance.turtle;

      handleKeyGroup(upKeys, () => mainCharacter.moveUp(), event.key);
      handleKeyGroup(downKeys, () => mainCharacter.moveDown(), event.key);
      handleKeyGroup(leftKeys, () => mainCharacter.moveLeft(), event.key);
      handleKeyGroup(rightKeys, () => mainCharacter.moveRight(), event.key);
    }
  };

  const handleKeyGroup = (
    keyGroup: Array<string>,
    action: Function,
    pressedKey: string
  ) => {
    if (keyGroup.includes(pressedKey)) {
      // Call the method twice to make up for slower triggering of keyboard events
      action();
      action();
    }
  };

  const handleWheel = (event: React.WheelEvent) => {
    event.preventDefault();

    if (!isGamePaused) {
      const mainCharacter = Game.instance.turtle;

      if (event.deltaX < 0) {
        mainCharacter.moveLeft();
      }
      if (event.deltaX > 0) {
        mainCharacter.moveRight();
      }
      if (event.deltaY < 0) {
        mainCharacter.moveUp();
      }
      if (event.deltaY > 0) {
        mainCharacter.moveDown();
      }
    }
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
      .then(async () => {
        setDialogContent({
          title: "Level 1",
          message: Game.instance.level.levelDescription.join(";"),
          type: "default",
        });
        await runGameLoop(canvas);
      })
      .catch((error) => {
        console.log(error);
        setDialogContent({ title: "Error", message: error, type: "error" });
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
      <ControlGroup isGamePaused={isGamePaused} />
      {isSaving && <LoadingOverlay message="Saving..." />}
      {dialogContent.title && dialogContent.message && (
        <Dialog
          title={dialogContent.title}
          type={dialogContent.type}
          handleOk={handleDialogClose}
        >
          {dialogContent.message}
        </Dialog>
      )}
    </div>
  );
};

export default GameSection;
