import { loadTemplate } from "../components";

class FormField extends HTMLElement {
  static observedAttributes = ["id"];

  constructor() {
    super();
    loadTemplate("formFieldTemplate", this);
  }

  attributeChangedCallback(name: string, _: string, newValue: string) {
    if (name === "id") {
      const label = this.shadowRoot.querySelector("label");
      label.htmlFor = newValue;
    }
  }
}

export default FormField;
