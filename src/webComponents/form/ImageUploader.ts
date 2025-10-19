import { loadTemplate } from "../components";
import FormField from "./FormField";

class ImageUploader extends HTMLElement {
  constructor() {
    super();
    loadTemplate("imageUploaderTemplate", this);
  }

  set currentImageUrl(value: string) {
    const imagePreview = this.shadowRoot.querySelector(
      ".imagePreview"
    ) as HTMLElement;
    imagePreview.style.backgroundImage = `url(${value})`;
  }

  set changeCallback(value: (_: Event) => void) {
    const fileInput = this.shadowRoot.querySelector(
      'input[type="file"]'
    ) as HTMLElement;
    fileInput.addEventListener("change", value);
  }

  connectedCallback() {
    this.addEventListener("click", () => {
      const fileInput = this.shadowRoot.querySelector(
        'input[type="file"]'
      ) as HTMLElement;
      fileInput.click();
    });

    const formField = this.shadowRoot.querySelector("form-field") as FormField;
    formField.id = this.id;
  }
}

export default ImageUploader;
