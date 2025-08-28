import ControlButton from "./ControlButton";
import {
  GoArrowDown,
  GoArrowLeft,
  GoArrowRight,
  GoArrowUp,
} from "react-icons/go";
import Game from "../../../Game";
import { useSelector } from "react-redux";
import RootState from "../../../features/RootState";

type Props = { isGamePaused: boolean };

const ControlGroup = ({ isGamePaused }: Props) => {
  const turtle = Game.instance.turtle;
  const gameRunning = useSelector(
    (state: RootState) => state.game.state.value === "in-progress"
  );
  const { controlPosition } = useSelector(
    (state: RootState) => state.game.profile.value.settings
  );

  return (
    <>
      {gameRunning && !isGamePaused && (
        <div
          className={`fixed bottom-1 ${
            controlPosition === "Left" ? "left-1" : "right-1"
          }`}
        >
          <div className="mb-1 flex justify-center">
            <ControlButton
              icon={<GoArrowUp />}
              callback={() => turtle.moveUp()}
            />
          </div>
          <div className="flex gap-1">
            <ControlButton
              icon={<GoArrowLeft />}
              callback={() => turtle.moveLeft()}
            />
            <ControlButton
              icon={<GoArrowDown />}
              callback={() => turtle.moveDown()}
            />
            <ControlButton
              icon={<GoArrowRight />}
              callback={() => turtle.moveRight()}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ControlGroup;
