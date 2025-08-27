import { Dispatch, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MenuButton from "./MenuButton";
import AboutDialog from "./AboutDialog";
import LoginButtons from "../login/LoginButtons";
import LeaderBoard from "../scores/LeaderBoard";
import RootState from "../../features/RootState";
import InfoDisplay from "../InfoDisplay";
import GameData from "../../restoreGame/GameData";
import { saveGame } from "../../services/api";
import {
  getLastGameLocalStorage,
  getLastGameTimestampLocalStorage,
} from "../../utils/lastGameLocalStorage";
import InstructionsDialog from "./InstructionsDialog";
import { useGameStartActions } from "./hooks";
import NewGameDialog from "./NewGameDialog";
import { socials } from "./config";
import Dialog from "../dialog/Dialog";

type Props = { setIsNewGame: Dispatch<React.SetStateAction<boolean>> };

const Menu = ({ setIsNewGame }: Props) => {
  const { startNewGame, continuePreviousGame } =
    useGameStartActions(setIsNewGame);

  const [showAbout, setShowAbout] = useState<boolean>(false);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [isLastGameAvailable, setIsLastGameAvailable] =
    useState<boolean>(false);
  const isAuthenticated = useSelector(
    (state: RootState) => state.authentication.isAuthenticated
  );
  const profile = useSelector((state: RootState) => state.game.profile.value);
  const [showNewGameDialog, setShowNewGameDialog] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleNewGame = () => {
    const hasLastGame = !!getLastGameLocalStorage();
    if (hasLastGame) {
      setShowNewGameDialog(true);
    } else {
      startNewGame();
    }
  };

  const handleAbout = () => setShowAbout(true);

  const handleInstructions = () => setShowInstructions(true);

  const uploadLastGame = async () => {
    const lastGame = JSON.parse(getLastGameLocalStorage()) as GameData;
    const timestamp = Number(getLastGameTimestampLocalStorage());
    if (isAuthenticated && lastGame && timestamp) {
      try {
        await saveGame({ lastGame, timestamp });
      } catch {
        setError("Failed to upload last game! Please try again later.");
      }
    }
  };

  const checkLastGameLocalStorage = () =>
    setIsLastGameAvailable(!!getLastGameLocalStorage());

  useEffect(() => {
    uploadLastGame();
  }, [isAuthenticated]);

  useEffect(() => {
    checkLastGameLocalStorage();
  }, [profile.email]);

  return (
    <>
      <div className="flex flex-col justify-between bg-cute bg-no-repeat bg-center bg-cover p-5 items-center h-screen w-screen">
        <div className="flex gap-5 justify-center items-center">
          <h1
            className="text-5xl font-bold"
            role="button"
            onClick={handleAbout}
          >
            <span className="text-emerald-300">Turtle</span>{" "}
            <span className="text-cyan-500">Quest</span>
          </h1>
          <span className="text-sm font-light">Beta</span>
          <a
            href={socials.instagram.url}
            target="_blank"
            title={socials.instagram.tooltip}
          >
            <socials.instagram.Icon className="text-primary text-4xl" />
          </a>
          <a
            href={socials.youtube.url}
            target="_blank"
            title={socials.youtube.tooltip}
          >
            <socials.youtube.Icon className="text-primary text-4xl" />
          </a>
          <LoginButtons />
        </div>
        {isAuthenticated ? (
          <InfoDisplay title="Leaderboard" content={<LeaderBoard />} />
        ) : null}
        <div className="flex flex-col items-center gap-5">
          {isAuthenticated && isLastGameAvailable && (
            <MenuButton callback={continuePreviousGame} text="Continue Game" />
          )}
          <MenuButton callback={handleNewGame} text="New Game" />
          <MenuButton callback={handleInstructions} text="Instructions" />
        </div>
      </div>
      {showAbout && <AboutDialog setShowAbout={setShowAbout} />}
      {showInstructions && (
        <InstructionsDialog setShowInstructions={setShowInstructions} />
      )}
      {showNewGameDialog && (
        <NewGameDialog
          setIsOpen={setShowNewGameDialog}
          setIsNewGame={setIsNewGame}
        />
      )}
      {error && (
        <Dialog title="Error" type="error">
          {error}
        </Dialog>
      )}
    </>
  );
};

export default Menu;
