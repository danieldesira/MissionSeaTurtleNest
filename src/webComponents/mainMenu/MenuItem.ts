import { loadTemplate } from "../components";

class MenuItem extends HTMLElement {
  constructor() {
    super();
    loadTemplate("menuItemTemplate", this);
  }

  set callback(value: () => void) {
    this.addEventListener("click", value);
  }
}

export default MenuItem;
