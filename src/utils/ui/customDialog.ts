import type PrettyDialog from "../../webComponents/dialog/PrettyDialog";
import { $id } from "./domQuery";

export const launchCustomDialog = (title: string, text: string) => {
  const customDialog = $id("customDialog") as PrettyDialog;
  customDialog.open();
  customDialog.closeButtonIds = ["closeCustomDialogBtn"];
  const customDialogTitle = $id("customDialogTitle");
  if (customDialogTitle) {
    customDialogTitle.innerText = title;
  }
  const customDialogContent = $id("customDialogContent");
  if (customDialogContent) {
    customDialogContent.innerText = text;
  }
};
