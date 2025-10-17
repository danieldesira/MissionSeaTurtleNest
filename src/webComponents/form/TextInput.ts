import { loadTemplate } from "../components";

class TextInput extends HTMLElement {
  constructor() {
    super();
    loadTemplate("textInputTemplate", this);
  }

  set value(value: string | Date) {
    const input = this.shadowRoot.querySelector("input");
    const isDateValue = value instanceof Date;
    input.value = isDateValue ? value.toISOString().split("T")[0] : value;
  }

  get value() {
    const input = this.shadowRoot.querySelector("input");
    return input.type === "date" ? new Date(input.value) : input.value;
  }

  connectedCallback() {
    const input = this.shadowRoot.querySelector("input");

    if (this.id) {
      input.id = this.id;
      input.name = this.id;

      const label = this.shadowRoot.querySelector("label");
      label.htmlFor = this.id;
    }

    const inputType = this.getAttribute("type") ?? "text";
    input.type = inputType;
  }
}

export default TextInput;
