import { loadTemplate } from "../components";
import FormField from "./FormField";

class RangeInput extends HTMLElement {
  constructor() {
    super();
    loadTemplate("textInputTemplate", this);
  }

  set value(value: number | string) {
    const input = this.shadowRoot.querySelector("input");
    input.value = value.toString();
  }

  get value() {
    const input = this.shadowRoot.querySelector("input");
    return input.value;
  }

  connectedCallback() {
    const input = this.shadowRoot.querySelector("input");

    if (this.id) {
      input.id = this.id;
      input.name = this.id;
    }

    const formField = this.shadowRoot.querySelector("form-field") as FormField;
    formField.id = this.id;
  }
}

export default RangeInput;
