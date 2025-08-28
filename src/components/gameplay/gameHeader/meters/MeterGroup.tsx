import MeterContainer from "./MeterContainer";
import { FaFishFins, FaLungs } from "react-icons/fa6";
import { FaHeartbeat } from "react-icons/fa";
import { useSelector } from "react-redux";
import RootState from "../../../../features/RootState";
import { GiStomach } from "react-icons/gi";

const MeterGroup = () => {
  const turtleState = useSelector(
    (state: RootState) => state.turtleMonitor.turtle
  );
  return (
    <>
      <MeterContainer icon={<FaFishFins />} value={turtleState.food.value} />
      <MeterContainer icon={<FaHeartbeat />} value={turtleState.life.value} />
      <MeterContainer icon={<FaLungs />} value={turtleState.oxygen.value} />
      <MeterContainer
        icon={<GiStomach />}
        value={turtleState.stomachCapacity.value}
      />
    </>
  );
};

export default MeterGroup;
