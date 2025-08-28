import GameMeter from "./GameMeter";

interface Props {
  value: number;
  icon: React.ReactElement;
}

const MeterContainer = ({ value, icon }: Props) => (
  <div className="flex gap-1">
    {icon}
    <GameMeter value={value} />
  </div>
);

export default MeterContainer;
