import { loadTemplate } from "../components";

class PrettyDialog extends HTMLElement {
  constructor() {
    super();
    loadTemplate("prettyDialogTemplate", this);
  }

  show() {
    const dialog = this.shadowRoot.querySelector("dialog");
    dialog.showModal();
  }

  hide() {
    const dialog = this.shadowRoot.querySelector("dialog");
    dialog.close();
  }

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
}

export default PrettyDialog;
