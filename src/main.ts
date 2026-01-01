import "./main.css";
import { registerComponents } from "./webComponents/components";
import { setupSocialButtons } from "./socials";
import { disableContextMenu, preventNavigation } from "./utils/ui/ui";
import { setupKeyboardControls } from "./utils/controls";
import { registerServiceWorker } from "./utils/serviceWorkers";
import { setupLoginButtons } from "./utils/ui/authUi";
import {
  setupAppVisibilityHandler,
  setupBackToMenuBtn,
  setupCanvasSize,
  setupGameControls,
  setupGamePauseOnDialogOpen,
  setupGameShareBtn,
  setupLevelStartDialog,
  setupPauseBtn,
  setupResumeBtn,
} from "./utils/ui/gameplay";
import { setupScoresDialog } from "./utils/ui/scores";
import {
  setupContinueGameBtn,
  setupGameOverwriteDialog,
  setupInstructionsDialog,
  setupNewGameMenuBtn,
} from "./utils/ui/mainMenu";
import { setupLoginInvitationDialog } from "./utils/ui/loginInvitationDialog";
import { setupNewLevelEventHandler } from "./levels/customEvents";
import { setupAboutDialog } from "./utils/ui/aboutDialog";

document.addEventListener("DOMContentLoaded", async () => {
  registerServiceWorker("cache");
  disableContextMenu();
  preventNavigation();

  registerComponents();
  setupSocialButtons();
  window.lucide?.createIcons();

  setupNewGameMenuBtn();
  setupContinueGameBtn();
  setupGameOverwriteDialog();

  setupInstructionsDialog();
  setupLoginButtons();

  setupGameControls();
  setupGameShareBtn();
  setupPauseBtn();
  setupResumeBtn();
  setupKeyboardControls();
  setupCanvasSize();
  setupBackToMenuBtn();
  setupAppVisibilityHandler();
  setupLoginInvitationDialog();
  setupGamePauseOnDialogOpen();
  setupLevelStartDialog();
  setupNewLevelEventHandler();

  setupScoresDialog();
  setupAboutDialog();
});
