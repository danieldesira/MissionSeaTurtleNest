import { loadTemplate } from "../components";
import FormField from "./FormField";

class ImageUploader extends HTMLElement {
  constructor() {
    super();
    loadTemplate("imageUploaderTemplate", this);
  }

  set currentImageUrl(value: string) {
    const image = this.shadowRoot.querySelector("img") as HTMLImageElement;
    image.src = value;
  }

  set changeCallback(value: (_: Event) => void) {
    const fileInput = this.shadowRoot.querySelector(
      'input[type="file"]'
    ) as HTMLElement;
    fileInput.addEventListener("change", (event: Event) => {
      const target = event.target as HTMLInputElement;
      const selectedFile = target.files[0];
      if (selectedFile?.size > 10 * 1_024 * 1_024) {
        this.indicateError();
      } else {
        this.removeError();
        if (value) {
          value(event);
        }
      }
    });
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

  private indicateError() {
    const button = this.shadowRoot.querySelector(".btn");
    button.classList.add("error");
  }

  private removeError() {
    const button = this.shadowRoot.querySelector(".btn");
    button.classList.remove("error");
  }
}

export default ImageUploader;
