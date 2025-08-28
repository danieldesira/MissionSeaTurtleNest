import LevelText from "./LevelText";
import MeterGroup from "./meters/MeterGroup";
import BackButton from "./BackButton";
import XPText from "./XPText";
import PauseButton from "./PauseButton";

const GameHeader = () => (
  <div className="fixed top-1 left-1 flex text-white gap-5 items-center">
    <BackButton />
    <MeterGroup />
    <XPText />
    <LevelText />
    <PauseButton />
  </div>
);

export default GameHeader;
