import "./main.css";
import { registerComponents } from "./webComponents/components";
import {
  disableContextMenu,
  preventNavigation,
  setupFullscreenBtn,
  setupNotifications,
} from "./utils/ui/ui";
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
  setupKeyboardShortcuts,
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
import { setupMusic } from "./utils/audio";
import { setupMainMenuKeyboardNavigation } from "./utils/ui/mainMenuKeyboardNavigation";
import { showRandomHint } from "./utils/ui/hints";
import { setupResetCurrentGameDialog } from "./utils/ui/resetCurrentGameDialog";

document.addEventListener("DOMContentLoaded", async () => {
  registerServiceWorker("cache");
  disableContextMenu();
  preventNavigation();

  window.lucide?.createIcons();
  registerComponents();

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
  setupKeyboardShortcuts();
  setupResetCurrentGameDialog();

  setupScoresDialog();
  setupFullscreenBtn();
  setupNotifications();
  setupMusic();
  setupMainMenuKeyboardNavigation();
  showRandomHint();

  window.FB.getLoginStatus((response) => console.log({ response }));
});
