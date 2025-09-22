import { Dispatch, SetStateAction } from "react";
import Dialog from "../dialog/Dialog";
import { useGameStartActions } from "./hooks";

type Props = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setIsNewGame: Dispatch<SetStateAction<boolean>>;
};

const NewGameDialog = ({ setIsOpen, setIsNewGame }: Props) => {
  const { startNewGame } = useGameStartActions(setIsNewGame);

  const closeDialog = () => setIsOpen(false);

  return (
    <Dialog
      title="Start New Game"
      buttons={[{ label: "Cancel", action: closeDialog }]}
      handleOk={startNewGame}
    >
      <p>
        Starting a new game will erase your current progress
        <br />
        Are you sure you want to continue?
      </p>
    </Dialog>
  );
};

export default NewGameDialog;
