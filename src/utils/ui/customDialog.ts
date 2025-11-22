import PrettyDialog from "../../webComponents/dialog/PrettyDialog";

export const launchCustomDialog = (title: string, text: string) => {
  const customDialog = document.getElementById("customDialog") as PrettyDialog;
  customDialog.open();
  customDialog.closeButtonIds = ["closeCustomDialogBtn"];
  const customDialogTitle = document.getElementById("customDialogTitle");
  customDialogTitle.innerText = title;
  const customDialogContent = document.getElementById("customDialogContent");
  customDialogContent.innerText = text;
};
