import { loadTemplate } from "../components";

class PrettyButton extends HTMLElement {
  constructor() {
    super();
    loadTemplate("prettyButtonTemplate", this);
  }

  set callback(value: () => void) {
    this.addEventListener("click", value);
  }
}

export default PrettyButton;
