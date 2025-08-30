import MeterContainer from "./MeterContainer";
import { FaFishFins, FaLungs } from "react-icons/fa6";
import { FaHeartbeat } from "react-icons/fa";
import { GiStomach } from "react-icons/gi";
import { TurtleStats } from "../../types";

type Props = { turtleStats: TurtleStats };

const MeterGroup = ({ turtleStats }: Props) => (
  <>
    <MeterContainer Icon={FaFishFins} value={turtleStats.food} />
    <MeterContainer Icon={FaHeartbeat} value={turtleStats.physicalCondition} />
    <MeterContainer Icon={FaLungs} value={turtleStats.oxygen} />
    <MeterContainer Icon={GiStomach} value={turtleStats.apetite} />
  </>
);

export default MeterGroup;
