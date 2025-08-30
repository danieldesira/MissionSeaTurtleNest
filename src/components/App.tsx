import { useState } from "react";
import store from "../store";
import { Provider, useSelector } from "react-redux";
import { Analytics } from "@vercel/analytics/react";
import GameSection from "./gameplay/GameSection";
import Menu from "./mainMenu/Menu";
import RootState from "../features/RootState";

const App = () => {
  const gameState = useSelector((state: RootState) => state.game.state.value);

  const [isNewGame, setIsNewGame] = useState<boolean>(false);

  const screens = {
    saving: <GameSection isNewGame={isNewGame} />,
    "in-progress": <GameSection isNewGame={isNewGame} />,
    menu: <Menu setIsNewGame={setIsNewGame} />,
  };

  return (
    <Provider store={store}>
      <div
        className="max-w-screen max-h-screen portrait:hidden"
        onContextMenu={(e) => e.preventDefault()}
      >
        {screens[gameState]}
      </div>
      <div className="landscape:hidden flex justify-center items-center bg-red-700">
        <p className="text-white">
          Unable to play game in portrait mode. Please switch your device to
          landscape mode or install the Progressive Web App in Chrome, Edge or
          Firefox with the Progressive Web App addon.
        </p>
      </div>
      <Analytics />
    </Provider>
  );
};

export default App;
