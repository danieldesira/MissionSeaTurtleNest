import { loadTemplate } from "../components";

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
  }
}

export default ImageUploader;
