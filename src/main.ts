import "./main.css";
import { registerComponents } from "./webComponents/components";
import { setupSocialButtons } from "./socials";
import { disableContextMenu, preventNavigation } from "./utils/ui/ui";
import {
  setupKeyboardControls,
  setupMouseWheelControls,
} from "./utils/controls";
import { registerServiceWorker } from "./utils/serviceWorkers";
import { setupLoginButtons } from "./utils/ui/authUi";
import {
  setupAppVisibilityHandler,
  setupBackToMenuBtn,
  setupCanvasSize,
  setupGameControls,
  setupGameShareBtn,
  setupPauseBtn,
  setupResumeBtn,
} from "./utils/ui/gameplay";
import { setupScoresDialog } from "./utils/ui/scores";
import {
  setupContinueGameBtn,
  setupInstructionsDialog,
  setupNewGameMenuBtn,
} from "./utils/ui/mainMenu";

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

  setupScoresDialog();
});
