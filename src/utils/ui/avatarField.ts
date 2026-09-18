import PrettyDialog from "../../webComponents/dialog/PrettyDialog";
import PrettyButton from "../../webComponents/form/PrettyButton";
import { $id } from "./domQuery";

export const setupAvatarField = () => {
  const avatarBtn = $id("avatarBtn") as PrettyButton;
  const fileInput = $id("avatarInput") as HTMLInputElement;

  avatarBtn.on("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", (event: Event) => {
    const target = event.target as HTMLInputElement;
    const selectedFile = target.files?.[0];

    const dialog = $id("avatarPreviewDialog") as PrettyDialog;
    if (dialog && selectedFile) {
      dialog.open();
    }

    const canvas = $id("avatarPreviewCanvas") as HTMLCanvasElement;
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
      };
      reader.readAsDataURL(selectedFile);
    }
  });
};
