import { loadTemplate } from "../components";

class TabContainer extends HTMLElement {
  constructor() {
    super();
    loadTemplate("tabContainerTemplate", this);
  }

  show() {
    const container = this.shadowRoot.querySelector("div");
    container.classList.add("active");
  }

  hide() {
    const container = this.shadowRoot.querySelector("div");
    container.classList.remove("active");
  }
}

export default TabContainer;
