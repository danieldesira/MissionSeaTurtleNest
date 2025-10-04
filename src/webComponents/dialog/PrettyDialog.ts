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

  set closeButtonIds(value: string[]) {
    value.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener("click", () => {
          this.isVisible = false;
        });
      } else {
        console.warn(`PrettyDialog: closeButtonIds: ${id} not found in DOM`);
      }
    });
  }
}

export default PrettyDialog;
