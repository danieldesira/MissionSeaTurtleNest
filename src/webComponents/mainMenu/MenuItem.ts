import { loadTemplate } from "../components";

class MenuItem extends HTMLElement {
  constructor() {
    super();
    loadTemplate("menuItemTemplate", this);
  }

  show() {
    const button = this.shadowRoot.querySelector("[role=button]");
    button?.classList.remove("hide");
  }

  hide() {
    const button = this.shadowRoot.querySelector("[role=button]");
    if (!button?.classList.contains("hide")) {
      button?.classList.add("hide");
    }
  }

  set callback(value: () => void) {
    this.addEventListener("click", value);
  }
}

export default MenuItem;
