import Game from "./Game";
import PrettyDialog from "./webComponents/dialog/PrettyDialog";
import PrettyButton from "./webComponents/form/PrettyButton";
import GameControl from "./webComponents/gameplay/GameControl";

export const launchCustomDialog = (title: string, text: string) => {
  const customDialog = document.getElementById("customDialog") as PrettyDialog;
  customDialog.isVisible = true;
  const customDialogTitle = document.getElementById("customDialogTitle");
  customDialogTitle.innerText = title;
  const customDialogContent = document.getElementById("customDialogContent");
  customDialogContent.innerText = text;
};

export const setupGameControls = () => {
  const upControl = document.getElementById("upControl") as GameControl;
  upControl.callback = () => Game.instance.turtle.moveUp();
  const downControl = document.getElementById("downControl") as GameControl;
  downControl.callback = () => Game.instance.turtle.moveDown();
  const leftControl = document.getElementById("leftControl") as GameControl;
  leftControl.callback = () => Game.instance.turtle.moveLeft();
  const rightControl = document.getElementById("rightControl") as GameControl;
  rightControl.callback = () => Game.instance.turtle.moveRight();
};

export const toggleMode = (mode: "game" | "menu") => {
  const menuContainer = document.getElementById("menuContainer");
  const gameContainer = document.getElementById("gameContainer");

  switch (mode) {
    case "game":
      menuContainer.classList.add("hidden");
      menuContainer.classList.remove("flex");
      gameContainer.classList.add("flex");
      gameContainer.classList.remove("hidden");
      break;
    case "menu":
      menuContainer.classList.add("flex");
      menuContainer.classList.remove("hidden");
      gameContainer.classList.add("hidden");
      gameContainer.classList.remove("flex");
      break;
  }
};

export const launchGameEndDialog = (title: string, text: string) => {
  const gameEndDialog = document.getElementById(
    "gameEndDialog"
  ) as PrettyDialog;
  gameEndDialog.isVisible = true;
  const gameEndDialogTitle = document.getElementById("gameEndDialogTitle");
  gameEndDialogTitle.innerText = title;
  const gameEndDialogContent = document.getElementById("gameEndDialogContent");
  gameEndDialogContent.innerText = text;
};

export const setupGameShareBtn = () => {
  const shareGameBtn = document.getElementById(
    "gameEndDialogShareBtn"
  ) as PrettyButton;
  shareGameBtn.callback = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Turtle Core",
          text: `I just reached level ${Game.instance.currentLevelNo} with ${Game.instance.xp} points in Turtle Core!`,
          url: window.location.href,
        });
      } catch {
        launchCustomDialog("Share failed", "Failed to share the game.");
      }
    }
  };
};
