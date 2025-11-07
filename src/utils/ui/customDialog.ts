import PrettyDialog from "../../webComponents/dialog/PrettyDialog";

export const launchCustomDialog = (title: string, text: string | string[]) => {
  const customDialog = document.getElementById("customDialog") as PrettyDialog;
  customDialog.open();
  customDialog.closeButtonIds = ["closeCustomDialogBtn"];
  const customDialogTitle = document.getElementById("customDialogTitle");
  customDialogTitle.innerText = title;
  const customDialogContent = document.getElementById("customDialogContent");
  if (typeof text === "string") {
    customDialogContent.innerText = text;
  } else {
    customDialogContent.innerText = "";
    text.forEach((line) => {
      const textNode = document.createTextNode(line);
      customDialogContent.appendChild(textNode);
      const br = document.createElement("br");
      customDialogContent.appendChild(br);
    });
  }
};
