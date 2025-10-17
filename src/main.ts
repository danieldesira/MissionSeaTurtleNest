import "./main.css";
import { registerComponents } from "./webComponents/components";
import { setupSocialButtons } from "./socials";
import {
  disableContextMenu,
  preventNavigation,
  setupAboutDialog,
  setupAppVisibilityHandler,
  setupBackToMenuBtn,
  setupCanvasSize,
  setupContinueGameBtn,
  setupGameControls,
  setupGameShareBtn,
  setupInstructionsDialog,
  setupNewGameMenuBtn,
  setupPauseBtn,
  setupResumeBtn,
} from "./utils/ui/ui";
import {
  setupKeyboardControls,
  setupMouseWheelControls,
} from "./utils/controls";
import { registerServiceWorker } from "./utils/serviceWorkers";
import { setupLoginButtons } from "./utils/ui/authUi";

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
  setupLoginButtons();

  setupGameControls();
  setupGameShareBtn();
  setupPauseBtn();
  setupResumeBtn();
  setupKeyboardControls();
  setupMouseWheelControls();
  setupCanvasSize();
  setupBackToMenuBtn();
  setupAppVisibilityHandler();
});
