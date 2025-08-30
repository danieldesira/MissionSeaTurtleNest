import { IconType } from "react-icons";
import GameMeter from "./GameMeter";

interface Props {
  value: number;
  Icon: IconType;
}

const MeterContainer = ({ value, Icon }: Props) => (
  <div className="flex gap-1">
    <Icon />
    <GameMeter value={value} />
  </div>
);

export default MeterContainer;
