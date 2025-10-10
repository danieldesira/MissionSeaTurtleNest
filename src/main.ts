import "./main.css";
import { registerComponents } from "./webComponents/components";
import MenuItem from "./webComponents/mainMenu/MenuItem";
import { setupSocialButtons } from "./socials";
import {
  disableContextMenu,
  preventNavigation,
  setupAboutDialog,
  setupCanvasSize,
  setupContinueGameBtn,
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
import { registerServiceWorker } from "./utils/serviceWorkers";

document.addEventListener("DOMContentLoaded", async () => {
  registerServiceWorker("cache");
  disableContextMenu();
  preventNavigation();

  registerComponents();
  setupSocialButtons();
  window.lucide?.createIcons();

  setupNewGameMenuBtn();
  setupContinueGameBtn();

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
