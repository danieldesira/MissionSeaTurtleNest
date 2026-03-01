import type PrettyDialog from "../../webComponents/dialog/PrettyDialog";
import { $id } from "./domQuery";

export const launchCustomDialog = (title: string, text: string) => {
  const customDialog = $id("customDialog") as PrettyDialog;
  customDialog.open();
  customDialog.closeButtonIds = ["closeCustomDialogBtn"];
  const customDialogTitle = $id("customDialogTitle");
  customDialogTitle.innerText = title;
  const customDialogContent = $id("customDialogContent");
  customDialogContent.innerText = text;
};
