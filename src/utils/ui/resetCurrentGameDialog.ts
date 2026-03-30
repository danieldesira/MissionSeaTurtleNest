import type PrettyDialog from "../../webComponents/dialog/PrettyDialog";
import { $id } from "./domQuery";

export const showResetCurrentGameDialog = (resetsRemaining: number) => {
  const resetCurrentGameDialog = $id("resetCurrentGameDialog") as PrettyDialog;
  resetCurrentGameDialog.open();

  const remainingGameResets = $id("remainingGameResets");
  if (remainingGameResets) {
    remainingGameResets.innerText = resetsRemaining.toString();
  }
};
