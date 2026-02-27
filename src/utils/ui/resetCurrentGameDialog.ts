import type PrettyDialog from "../../webComponents/dialog/PrettyDialog";

export const showResetCurrentGameDialog = (resetsRemaining: number) => {
  const resetCurrentGameDialog = document.getElementById(
    "resetCurrentGameDialog",
  ) as PrettyDialog;
  resetCurrentGameDialog.open();

  const remainingGameResets = document.getElementById("remainingGameResets");
  remainingGameResets.innerText = resetsRemaining.toString();
};

export const setupResetCurrentGameDialog = () => {
  const resetCurrentGameDialog = document.getElementById(
    "resetCurrentGameDialog",
  ) as PrettyDialog;
  resetCurrentGameDialog.closeButtonIds = ["closeResetCurrentGameDialog"];
};
