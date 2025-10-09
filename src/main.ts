import "./main.css";
import { registerComponents } from "./webComponents/components";
import MenuItem from "./webComponents/mainMenu/MenuItem";
import { setupSocialButtons } from "./socials";
import {
  disableContextMenu,
  preventNavigation,
  setupAboutDialog,
  setupCanvasSize,
  setupGameControls,
  setupGameShareBtn,
  setupInstructionsDialog,
  setupNewGameMenuBtn,
  setupPauseBtn,
  setupResumeBtn,
  toggleMode,
} from "./utils/ui";
import {
  setupKeyboardControls,
  setupMouseWheelControls,
} from "./utils/controls";

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
  disableContextMenu();
  preventNavigation();

  registerComponents();
  setupSocialButtons();
  window.lucide?.createIcons();

  setupNewGameMenuBtn();

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
  setupPauseBtn();
  setupResumeBtn();
  setupKeyboardControls();
  setupMouseWheelControls();
  setupCanvasSize();
});
