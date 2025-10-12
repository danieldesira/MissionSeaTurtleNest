import { loadTemplate } from "../components";

class PrettyButton extends HTMLElement {
  constructor() {
    super();
    loadTemplate("prettyButtonTemplate", this);
  }

  set callback(value: () => void) {
    this.addEventListener("click", value);
  }

  set class(value: string) {
    const button = this.shadowRoot.querySelector("button");
    button.classList.add(value);
  }
}

export default PrettyButton;
