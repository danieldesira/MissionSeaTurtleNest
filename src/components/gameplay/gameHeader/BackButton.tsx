import { useDispatch } from "react-redux";
import { IoIosArrowBack } from "react-icons/io";
import {
  triggerMenuMode,
} from "../../../features/gameState/gameStateReducer";

const BackButton = () => {
  const dispatch = useDispatch();

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    dispatch(triggerMenuMode());
  };

  return (
    <button
      role="button"
      type="button"
      onClick={handleClick}
      className="bg-black opacity-60 hover:opacity-90 rounded-xl p-2"
    >
      <IoIosArrowBack />
    </button>
  );
};

export default BackButton;
