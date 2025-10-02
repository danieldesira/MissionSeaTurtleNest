import "./main.css";
import { registerComponents } from "./webComponents/components";
import PrettyDialog from "./webComponents/dialog/PrettyDialog";
import PrettyButton from "./webComponents/form/PrettyButton";
import MenuItem from "./webComponents/mainMenu/MenuItem";
import { version } from "../package.json";
import { setupSocialButtons } from "./socials";
import Game from "./Game";
import { resizeCanvas } from "./utils/generic";
import { getLastGameLocalStorage } from "./utils/lastGameLocalStorage";
import GameData from "./restoreGame/GameData";
import { runGameLoop } from "./gameLoop";
import { setupGameControls, setupGameShareBtn, toggleMode } from "./ui";

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

  const instructionsDialog = document.getElementById(
    "instructionsDialog"
  ) as PrettyDialog;

  const instructionsBtn = document.getElementById(
    "instructionsBtn"
  ) as MenuItem;
  instructionsBtn.callback = () => {
    instructionsDialog.isVisible = true;
  };

  const closeInstructionsBtn = instructionsDialog.querySelector(
    "pretty-button"
  ) as PrettyButton;
  closeInstructionsBtn.callback = () => {
    instructionsDialog.isVisible = false;
  };

  const aboutDialog = document.getElementById("aboutDialog") as PrettyDialog;

  const title = document.getElementById("title");
  title.addEventListener("click", () => {
    aboutDialog.isVisible = true;
  });

  const closeAboutBtn = aboutDialog.querySelector(
    "pretty-button"
  ) as PrettyButton;
  closeAboutBtn.callback = () => {
    aboutDialog.isVisible = false;
  };

  const versionLink = document.getElementById("version");
  versionLink.innerText = version;

  setupGameControls();
  setupGameShareBtn();
});
