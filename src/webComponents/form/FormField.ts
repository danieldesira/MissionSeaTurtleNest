import { loadTemplate } from "../components";

class FormField extends HTMLElement {
  constructor() {
    super();
    loadTemplate("formFieldTemplate", this);
  }
}

export default FormField;
