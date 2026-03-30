import { $id } from "../../utils/ui/domQuery";
import { loadTemplate } from "../components";
import type PrettyDialog from "../dialog/PrettyDialog";

class PrettyButton extends HTMLElement {
  constructor() {
    super();
    loadTemplate("prettyButtonTemplate", this);
  }

  connectedCallback() {
    const variant = this.getAttribute("variant") ?? "default";
    const dialogTarget = this.getAttribute("dialog-target");
    const dialogAction =
      (this.getAttribute("dialog-action") as "open" | "close") ?? "open";
    const button = this.shadowRoot?.querySelector("button");

    if (button) {
      button.classList.add(variant);
      button.accessKey = this.accessKey;

      if (dialogTarget) {
        this.on("click", () => {
          const dialog = $id(dialogTarget) as PrettyDialog;
          if (dialog) {
            if (dialogAction === "open") {
              dialog.open();
            } else {
              dialog.close();
            }
          } else {
            console.warn(
              `PrettyButton: dialog-target: ${dialogTarget} not found in DOM`,
            );
          }
        });
      }
    }
  }

  on(eventType: "click", callback: () => void) {
    this.addEventListener(eventType, callback);
  }
}

export default PrettyButton;
