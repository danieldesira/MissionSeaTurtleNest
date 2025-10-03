import "./main.css";
import { registerComponents } from "./webComponents/components";
import MenuItem from "./webComponents/mainMenu/MenuItem";
import { setupSocialButtons } from "./socials";
import Game from "./singletons/Game";
import { resizeCanvas } from "./utils/generic";
import { getLastGameLocalStorage } from "./utils/lastGameLocalStorage";
import GameData from "./restoreGame/GameData";
import { runGameLoop } from "./gameLoop";
import {
  setupAboutDialog,
  setupGameControls,
  setupGameShareBtn,
  setupInstructionsDialog,
  toggleMode,
} from "./utils/ui";

if (navigator.serviceWorker) {
  try {
    window.addEventListener("load", async () => {
      const worker = await navigator.serviceWorker.register(
        "cacheServiceWorker.js"
      );
      console.log(`Registered service worker ${worker}`);
    });
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  registerComponents();
  setupSocialButtons();
  window.lucide?.createIcons();

  document.body.addEventListener("contextmenu", (event) =>
    event.preventDefault()
  );

  const initialiseGame = async (isNewGame: boolean) => {
    const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
    window.addEventListener("resize", () => resizeCanvas(canvas));
    window.addEventListener("beforeunload", (event) => {
      // Display default dialog before closing
      event.preventDefault();
      event.returnValue = false; // Required by Chrome
    });

    await Game.instance.start({
      canvas,
      isNewGame,
      gameData: JSON.parse(getLastGameLocalStorage()) as GameData,
    });
    await runGameLoop(canvas);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    //if (!isGamePaused) {
    const upKeys = ["w", "W", "ArrowUp"];
    const downKeys = ["s", "S", "ArrowDown"];
    const leftKeys = ["a", "A", "ArrowLeft"];
    const rightKeys = ["d", "D", "ArrowRight"];

    const mainCharacter = Game.instance.turtle;

    handleKeyGroup(upKeys, () => mainCharacter.moveUp(), event.key);
    handleKeyGroup(downKeys, () => mainCharacter.moveDown(), event.key);
    handleKeyGroup(leftKeys, () => mainCharacter.moveLeft(), event.key);
    handleKeyGroup(rightKeys, () => mainCharacter.moveRight(), event.key);
    //}
  };

  const handleKeyGroup = (
    keyGroup: Array<string>,
    action: Function,
    pressedKey: string
  ) => {
    if (keyGroup.includes(pressedKey)) {
      // Call the method twice to make up for slower triggering of keyboard events
      action();
      action();
    }
  };

  const newGameBtn = document.getElementById("newGameBtn") as MenuItem;
  newGameBtn.callback = async () => {
    toggleMode("game");
    await initialiseGame(true);
    // Add logic to start a new game here
  };

  const continueGameBtn = document.getElementById(
    "continueGameBtn"
  ) as MenuItem;
  continueGameBtn.callback = () => {
    toggleMode("game");
    // Add logic to start a new game here
  };

  setupInstructionsDialog();
  setupAboutDialog();

  setupGameControls();
  setupGameShareBtn();
});
