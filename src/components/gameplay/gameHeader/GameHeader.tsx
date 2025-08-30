import MeterGroup from "./meters/MeterGroup";
import BackButton from "./BackButton";
import PauseButton from "./PauseButton";
import { DialogContent, TurtleStats } from "../types";
import { Dispatch, SetStateAction } from "react";

type Props = {
  turtleStats: TurtleStats;
  setDialogContent: Dispatch<SetStateAction<DialogContent>>;
  setIsGamePaused: Dispatch<SetStateAction<boolean>>;
};

const GameHeader = ({
  turtleStats,
  setDialogContent,
  setIsGamePaused,
}: Props) => (
  <div className="fixed top-1 left-1 flex text-white gap-5 items-center">
    <BackButton />
    <MeterGroup turtleStats={turtleStats} />
    <span className="font-extrabold">{turtleStats.xp} XP</span>
    <span className="font-extrabold">Level {turtleStats.level}</span>;
    <PauseButton
      setDialogContent={setDialogContent}
      setIsPaused={setIsGamePaused}
    />
  </div>
);

export default GameHeader;
