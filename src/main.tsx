import "./main.css";
import { registerComponents } from "./webComponents/components";
import PrettyDialog from "./webComponents/dialog/PrettyDialog";
import PrettyButton from "./webComponents/form/PrettyButton";
import MenuItem from "./webComponents/mainMenu/MenuItem";

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

  document.body.addEventListener("contextmenu", (event) =>
    event.preventDefault()
  );

  const newGameBtn = document.getElementById("newGameBtn") as MenuItem;
  newGameBtn.callback = () => {
    alert("New Game button clicked");
    // Add logic to start a new game here
  };

  const continueGameBtn = document.getElementById(
    "continueGameBtn"
  ) as MenuItem;
  continueGameBtn.callback = () => {
    alert("Continue Game button clicked");
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
});
