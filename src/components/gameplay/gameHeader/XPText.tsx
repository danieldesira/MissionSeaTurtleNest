import { useSelector } from "react-redux";
import RootState from "../../../features/RootState";

const XPText = () => {
  const xp = useSelector(
    (state: RootState) => state.turtleMonitor.turtle.xp.value
  );
  return <span className="font-extrabold">{xp} XP</span>;
};

export default XPText;
