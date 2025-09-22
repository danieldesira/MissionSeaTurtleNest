import { useState } from "react";
import { useSelector } from "react-redux";
import GameSection from "./gameplay/GameSection";
import Menu from "./mainMenu/Menu";
import RootState from "../features/RootState";

const ScreenSelector = () => {
  const gameState = useSelector((state: RootState) => state.game.state.value);

  const [isNewGame, setIsNewGame] = useState<boolean>(false);

  const screens = {
    saving: <GameSection isNewGame={isNewGame} />,
    "in-progress": <GameSection isNewGame={isNewGame} />,
    menu: <Menu setIsNewGame={setIsNewGame} />,
  };

  return (
    <div
      className="max-w-screen max-h-screen portrait:hidden"
      onContextMenu={(e) => e.preventDefault()}
    >
      {screens[gameState]}
    </div>
  );
};

export default ScreenSelector;
