import { $, $id } from "../../utils/ui/domQuery";
import { loadTemplate } from "../components";

class PrettyDialog extends HTMLElement {
  constructor() {
    super();
    loadTemplate("prettyDialogTemplate", this);
  }

  connectedCallback() {
    const dialog = this.shadowRoot?.querySelector("dialog");
    if (dialog) {
      dialog.id = this.id;
    }
  }

  private _openCallback: () => void = () => {};

  open() {
    const dialog = this.shadowRoot?.querySelector("dialog");
    dialog?.showModal();

    if (this._openCallback) {
      this._openCallback();
    }
  }

  close() {
    const dialog = this.shadowRoot?.querySelector("dialog");
    dialog?.close();
  }

  set closeButtonIds(value: string[]) {
    value.forEach((id) => {
      const element = $id(id);
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
    const dialog = this.shadowRoot?.querySelector("dialog");
    dialog?.addEventListener("close", value);
  }

  set openCallback(value: () => void) {
    this._openCallback = value;
  }

  get isOpen() {
    const dialog = this.shadowRoot?.querySelector("dialog");
    return dialog?.open;
  }

  static isAnyDialogOpen() {
    return Array.from<PrettyDialog>($("pretty-dialog")).some(
      ({ isOpen }) => isOpen,
    );
  }
}

export default PrettyDialog;
