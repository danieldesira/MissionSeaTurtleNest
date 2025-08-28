import { useEffect } from "react";

interface Props {
  icon: React.ReactElement;
  callback: Function;
}

const ControlButton = ({ icon, callback }: Props) => {
  let timer = 0;

  const handleMousedown = () => {
    callback();
    timer = requestAnimationFrame(handleMousedown);
  };

  const handleMouseup = () => cancelAnimationFrame(timer);

  useEffect(() => () => handleMouseup());

  return (
    <button
      type="button"
      className="rounded-7xl w-20 h-20 bg-black opacity-50 hover:opacity-70 text-white"
      onMouseDown={handleMousedown}
      onMouseLeave={handleMouseup}
      onMouseUp={handleMouseup}
      onTouchStart={handleMousedown}
      onTouchEnd={handleMouseup}
    >
      <div className="flex justify-center">{icon}</div>
    </button>
  );
};

export default ControlButton;
