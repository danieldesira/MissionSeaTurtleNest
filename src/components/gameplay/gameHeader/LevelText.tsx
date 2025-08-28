import { useSelector } from "react-redux";
import RootState from "../../../features/RootState";
import { levelMap } from "../../../levels/levels";

const LevelText = () => {
  const level = useSelector((state: RootState) => state.levels.level.value);
  const showText = !!levelMap[level];

  return showText && <span className="font-extrabold">Level {level}</span>;
};

export default LevelText;
