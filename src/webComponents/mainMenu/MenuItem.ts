import { loadTemplate } from "../components";

class MenuItem extends HTMLElement {
  constructor() {
    super();
    loadTemplate("menuItemTemplate", this);
  }

  show() {
    const button = this.shadowRoot?.querySelector("[role=button]");
    button?.classList.remove("hide");
  }

  hide() {
    const button = this.shadowRoot?.querySelector("[role=button]");
    if (!button?.classList.contains("hide")) {
      button?.classList.add("hide");
    }
  }

  on(eventType: "click", callback: () => void) {
    this.addEventListener(eventType, callback);
  }

  applyFocus() {
    const button = this.shadowRoot?.querySelector("[role=button]");
    button?.classList.add("active");
  }

  removeFocus() {
    const button = this.shadowRoot?.querySelector("[role=button]");
    button?.classList.remove("active");
  }

  get isVisible() {
    const button = this.shadowRoot?.querySelector("[role=button]");
    return !button?.classList.contains("hide");
  }
}

export default MenuItem;
