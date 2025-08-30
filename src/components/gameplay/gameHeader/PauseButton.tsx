import { Dispatch, SetStateAction } from "react";
import { FaPause } from "react-icons/fa6";
import { DialogContent } from "../types";

type Props = {
  setDialogContent: Dispatch<SetStateAction<DialogContent>>;
  setIsPaused: Dispatch<SetStateAction<boolean>>;
};

const PauseButton = ({ setDialogContent, setIsPaused }: Props) => {
  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsPaused(true);
    setDialogContent({
      title: "Game Paused",
      message: <>Click OK to continue the game</>,
    });
  };

  return (
    <button
      role="button"
      type="button"
      onClick={handleClick}
      className="bg-black opacity-60 hover:opacity-90 rounded-xl p-2"
    >
      <FaPause />
    </button>
  );
};

export default PauseButton;
