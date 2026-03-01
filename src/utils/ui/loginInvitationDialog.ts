import { game } from "../../singletons/Game";
import type PrettyDialog from "../../webComponents/dialog/PrettyDialog";
import type PrettyButton from "../../webComponents/form/PrettyButton";
import { $id } from "./domQuery";
import { toggleMode } from "./mainMenu";

export const setupLoginInvitationDialog = () => {
  const loginInvitationDialog = $id("loginInvitationDialog") as PrettyDialog;
  loginInvitationDialog.closeButtonIds = [
    "loginInvitationBtn",
    "closeLoginInvitationBtn",
  ];

  const loginInvitationBtn = $id("loginInvitationBtn") as PrettyButton;
  loginInvitationBtn.on("click", () => {
    const loginDialog = $id("loginDialog") as PrettyDialog;
    loginDialog.open();
  });

  const closeLoginInvitationBtn = $id(
    "closeLoginInvitationBtn",
  ) as PrettyButton;
  closeLoginInvitationBtn.on("click", () => {
    game.exit();
    toggleMode("menu");
  });
};

export const showLoginInvitationDialog = () => {
  const loginInvitationDialog = $id("loginInvitationDialog") as PrettyDialog;
  loginInvitationDialog.open();
};
