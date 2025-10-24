import Game from "../../singletons/Game";
import { loadTemplate } from "../components";

class PrettyDialog extends HTMLElement {
  constructor() {
    super();
    loadTemplate("prettyDialogTemplate", this);
  }

  show() {
    const dialog = this.shadowRoot.querySelector("dialog");
    dialog.showModal();

    this.handleDialogShow();
  }

  hide() {
    const dialog = this.shadowRoot.querySelector("dialog");
    dialog.close();

    this.handleDialogClose();
  }

  private handleDialogShow = () => Game.instance.pause();

  private handleDialogClose = () => Game.instance.resume();

  set closeButtonIds(value: string[]) {
    value.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener("click", () => {
          this.hide();
        });
      } else {
        console.warn(`PrettyDialog: closeButtonIds: ${id} not found in DOM`);
      }
    });
  }

  set closeCallback(value: () => void) {
    const dialog = this.shadowRoot.querySelector("dialog");
    dialog.addEventListener("close", value);
  }

  connectedCallback() {
    const dialog = this.shadowRoot.querySelector("dialog");
    dialog.addEventListener("close", this.handleDialogClose);
  }

  disconnectedCallack() {
    const dialog = this.shadowRoot.querySelector("dialog");
    dialog.removeEventListener("close", this.handleDialogClose);
  }
}

export default PrettyDialog;
