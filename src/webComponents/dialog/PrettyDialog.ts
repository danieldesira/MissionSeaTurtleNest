import { loadTemplate } from "../components";

class PrettyDialog extends HTMLElement {
  constructor() {
    super();
    loadTemplate("prettyDialogTemplate", this);
  }

  private _openCallback: () => void = null;

  open() {
    const dialog = this.shadowRoot.querySelector("dialog");
    dialog.showModal();

    if (this._openCallback) {
      this._openCallback();
    }
  }

  close() {
    const dialog = this.shadowRoot.querySelector("dialog");
    dialog.close();
  }

  set closeButtonIds(value: string[]) {
    value.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener("click", () => {
          this.close();
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

  set openCallback(value: () => void) {
    this._openCallback = value;
  }
}

export default PrettyDialog;
