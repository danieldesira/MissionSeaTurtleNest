import "./main.css";
import { registerComponents } from "./webComponents/components";
import PrettyDialog from "./webComponents/dialog/PrettyDialog";
import PrettyButton from "./webComponents/form/PrettyButton";
import MenuItem from "./webComponents/mainMenu/MenuItem";
import { version } from "../package.json";
import { setupSocialButtons } from "./socials";
import GameControl from "./webComponents/gameplay/GameControl";
import Game from "./Game";

if (navigator.serviceWorker) {
  try {
    window.addEventListener("load", async () => {
      const worker = await navigator.serviceWorker.register("serviceWorker.js");
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

  const menuContainer = document.getElementById("menuContainer");
  const gameContainer = document.getElementById("gameContainer");

  const toggleGameMode = () => {
    menuContainer.classList.add("hidden");
    menuContainer.classList.remove("flex");
    gameContainer.classList.add("flex");
    gameContainer.classList.remove("hidden");
  };

  const newGameBtn = document.getElementById("newGameBtn") as MenuItem;
  newGameBtn.callback = () => {
    toggleGameMode();
    // Add logic to start a new game here
  };

  const continueGameBtn = document.getElementById(
    "continueGameBtn"
  ) as MenuItem;
  continueGameBtn.callback = () => {
    toggleGameMode();
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

  const upControl = document.getElementById("upControl") as GameControl;
  upControl.callback = () => Game.instance.turtle.moveUp();
  const downControl = document.getElementById("downControl") as GameControl;
  downControl.callback = () => Game.instance.turtle.moveDown();
  const leftControl = document.getElementById("leftControl") as GameControl;
  leftControl.callback = () => Game.instance.turtle.moveLeft();
  const rightControl = document.getElementById("rightControl") as GameControl;
  rightControl.callback = () => Game.instance.turtle.moveRight();
});
