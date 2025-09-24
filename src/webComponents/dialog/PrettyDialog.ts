import { loadTemplate } from "../components";

class PrettyDialog extends HTMLElement {
  constructor() {
    super();
    loadTemplate("prettyDialogTemplate", this);
  }

  set isVisible(value: boolean) {
    const dialog = this.shadowRoot.querySelector("dialog");
    if (value) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }
}

export default PrettyDialog;
