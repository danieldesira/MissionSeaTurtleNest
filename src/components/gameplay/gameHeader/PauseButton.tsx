import { FaPause } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { updateDialogContent } from "../../../features/dialogs/dialogReducer";

const PauseButton = () => {
  const dispatch = useDispatch();

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    dispatch(
      updateDialogContent({
        dialog: {
          title: "Game Paused",
          text: ["Click OK to continue the game"],
        },
      })
    );
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
