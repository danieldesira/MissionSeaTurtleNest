import type PrettyDialog from "../../webComponents/dialog/PrettyDialog";
import type PrettyButton from "../../webComponents/form/PrettyButton";
import { version } from "../../../package.json";

export const setupAboutDialog = () => {
  const aboutBtn = document.getElementById("aboutBtn") as PrettyButton;
  const aboutDialog = document.getElementById("aboutDialog") as PrettyDialog;
  aboutDialog.closeButtonIds = ["closeAboutBtn"];
  aboutBtn.callback = () => aboutDialog.open();

  const versionLink = document.getElementById("version");
  versionLink.innerText = version;
};
