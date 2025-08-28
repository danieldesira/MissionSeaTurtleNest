interface Props {
  value: number;
}

const GameMeter = ({ value }: Props) => (
  <meter
    low={30}
    high={60}
    optimum={80}
    max="100"
    min="0"
    value={value}
  ></meter>
);

export default GameMeter;
