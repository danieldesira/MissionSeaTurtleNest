import { loadTemplate } from "../components";

type RadioOptionsConfig = {
  name: string;
  options: Array<{ label: string; value: string }>;
  selectedValue?: string;
};

class RadioSelection extends HTMLElement {
  constructor() {
    super();
    loadTemplate("radioSelectionTemplate", this);
  }

  set config(value: RadioOptionsConfig) {
    const container = this.shadowRoot.querySelector(".options");
    value.options.forEach(({ label: optionLabel, value: optionValue }) => {
      const radioOption = document.createElement("input");
      radioOption.type = "radio";
      radioOption.name = value.name;
      radioOption.id = `${value.name}-${optionValue}`;
      radioOption.value = optionValue;
      radioOption.classList.add("radio");
      if (value.selectedValue && value.selectedValue === optionValue) {
        radioOption.checked = true;
      }

      const radioLabel = document.createElement("label");
      radioLabel.htmlFor = radioOption.id;
      radioLabel.innerText = optionLabel;
      radioLabel.classList.add("label");

      container.appendChild(radioOption);
      container.appendChild(radioLabel);
    });
  }

  get currentSelection() {
    const radioOptions = this.shadowRoot.querySelectorAll(
      '.container > .options > input[type="radio"]'
    ) as NodeListOf<HTMLInputElement>;
    let value = "";
    radioOptions.forEach((option) => {
      if (option.checked) {
        value = option.value;
      }
    });
    return value;
  }
}

export default RadioSelection;
