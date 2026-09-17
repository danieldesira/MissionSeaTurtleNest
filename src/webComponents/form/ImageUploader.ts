import { loadTemplate } from "../components";
import FormField from "./FormField";

class ImageUploader extends HTMLElement {
  constructor() {
    super();
    loadTemplate("imageUploaderTemplate", this);
  }

  connectedCallback() {
    this.addEventListener("click", () => {
      const fileInput = this.shadowRoot?.querySelector(
        'input[type="file"]',
      ) as HTMLElement;
      fileInput?.click();
    });

    const formField = this.shadowRoot?.querySelector("form-field") as FormField;
    if (formField) {
      formField.id = this.id;
    }

    const fileInput = this.shadowRoot?.querySelector(
      'input[type="file"]',
    ) as HTMLElement;
    fileInput?.addEventListener("change", (event: Event) => {
      const target = event.target as HTMLInputElement;
      const selectedFile = target.files?.[0];

      const canvas = this.shadowRoot?.querySelector(
        "canvas",
      ) as HTMLCanvasElement;
      if (canvas && selectedFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(img, 0, 0);
          };
          img.src = e.target?.result as string;
          console.log(img.src);
        };
        reader.readAsDataURL(selectedFile);
      }
    });
  }

  set currentImageUrl(value: string) {
    const image = this.shadowRoot?.querySelector("img") as HTMLImageElement;
    if (image) {
      image.src = value;
    }
  }
}

export default ImageUploader;
