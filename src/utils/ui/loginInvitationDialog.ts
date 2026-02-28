import { game } from "../../singletons/Game";
import type PrettyDialog from "../../webComponents/dialog/PrettyDialog";
import type PrettyButton from "../../webComponents/form/PrettyButton";
import { toggleMode } from "./mainMenu";

export const setupLoginInvitationDialog = () => {
  const loginInvitationDialog = document.getElementById(
    "loginInvitationDialog",
  ) as PrettyDialog;
  loginInvitationDialog.closeButtonIds = [
    "loginInvitationBtn",
    "closeLoginInvitationBtn",
  ];

  const loginInvitationBtn = document.getElementById(
    "loginInvitationBtn",
  ) as PrettyButton;
  loginInvitationBtn.on("click", () => {
    const loginDialog = document.getElementById("loginDialog") as PrettyDialog;
    loginDialog.open();
  });

  const closeLoginInvitationBtn = document.getElementById(
    "closeLoginInvitationBtn",
  ) as PrettyButton;
  closeLoginInvitationBtn.on("click", () => {
    game.exit();
    toggleMode("menu");
  });
};

export const showLoginInvitationDialog = () => {
  const loginInvitationDialog = document.getElementById(
    "loginInvitationDialog",
  ) as PrettyDialog;
  loginInvitationDialog.open();
};
