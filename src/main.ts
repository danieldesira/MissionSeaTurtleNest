import "./main.css";
import { registerComponents } from "./webComponents/components";
import {
  disableContextMenu,
  lucideIcons,
  preventNavigation,
  removeNoJsClass,
  setupFullscreenBtn,
  setupNotifications,
} from "./utils/ui/ui";
import { setupKeyboardControls } from "./utils/controls";
import {
  clearServiceWorkers,
  registerServiceWorker,
} from "./utils/serviceWorkers";
import { setupLoginButtons } from "./utils/ui/authUi";
import {
  setupAppVisibilityHandler,
  setupBackToMenuBtn,
  setupCanvasSize,
  setupGameControls,
  setupGamePauseOnDialogOpen,
  setupGameShareBtn,
  setupKeyboardShortcuts,
  setupPauseBtn,
} from "./utils/ui/gameplay";
import { setupScoresDialog } from "./utils/ui/scores";
import {
  setupContinueGameBtn,
  setupGameOverwriteDialog,
  setupNewGameMenuBtn,
} from "./utils/ui/mainMenu";
import { setupLoginInvitationDialog } from "./utils/ui/loginInvitationDialog";
import { setupMusic } from "./utils/audio";
import { setupMainMenuKeyboardNavigation } from "./utils/ui/mainMenuKeyboardNavigation";
import { showRandomHint } from "./utils/ui/hints";
import { createIcons } from "lucide";

document.addEventListener("DOMContentLoaded", async () => {
  if (!import.meta.env.DEV) {
    registerServiceWorker("cache");
  } else {
    clearServiceWorkers();
  }
  disableContextMenu();
  preventNavigation();

  createIcons({
    icons: lucideIcons,
  });
  registerComponents();

  setupNewGameMenuBtn();
  setupContinueGameBtn();
  setupGameOverwriteDialog();

  setupLoginButtons();

  setupGameControls();
  setupGameShareBtn();
  setupPauseBtn();
  setupKeyboardControls();
  setupCanvasSize();
  setupBackToMenuBtn();
  setupAppVisibilityHandler();
  setupLoginInvitationDialog();
  setupGamePauseOnDialogOpen();
  setupKeyboardShortcuts();

  setupScoresDialog();
  setupFullscreenBtn();
  setupNotifications();
  setupMusic();
  setupMainMenuKeyboardNavigation();
  showRandomHint();

  removeNoJsClass();
});
