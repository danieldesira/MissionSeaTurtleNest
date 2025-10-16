import { loadTemplate } from "../components";

class PrettyButton extends HTMLElement {
  constructor() {
    super();
    loadTemplate("prettyButtonTemplate", this);
  }

  connectedCallback() {
    const variant = this.getAttribute("variant") ?? "default";
    const button = this.shadowRoot.querySelector("button");
    button.classList.add(variant);
  }

  set callback(value: () => void) {
    this.addEventListener("click", value);
  }
}

export default PrettyButton;
