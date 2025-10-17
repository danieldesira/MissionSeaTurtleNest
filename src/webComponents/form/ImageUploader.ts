import { loadTemplate } from "../components";

class ImageUploader extends HTMLElement {
  constructor() {
    super();
    loadTemplate("imageUploaderTemplate", this);
  }

  set currentImageUrl(value: string) {
    const imagePreview = document.querySelector(".imagePreview") as HTMLElement;
    imagePreview.style.backgroundImage = `url(${value})`;
  }

  set changeCallback(value: () => void) {
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
