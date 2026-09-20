import PrettyDialog from "../../webComponents/dialog/PrettyDialog";
import PrettyButton from "../../webComponents/form/PrettyButton";
import { $id } from "./domQuery";

const AVATAR_MAX_WIDTH = 150;
const AVATAR_MAX_HEIGHT = 150;

type AvatarSquareSelection = {
  x: number;
  y: number;
};

type AvatarSquareCoordinates = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

const getAvatarSquareCoordinates = (
  selection: AvatarSquareSelection,
): AvatarSquareCoordinates => {
  const x1 = selection.x - AVATAR_MAX_WIDTH / 2;
  const y1 = selection.y - AVATAR_MAX_HEIGHT / 2;
  const x2 = x1 + AVATAR_MAX_WIDTH / 2;
  const y2 = y1 + AVATAR_MAX_HEIGHT / 2;
  return { x1, y1, x2, y2 };
};

const canvas = $id("avatarPreviewCanvas") as HTMLCanvasElement;

const selection: AvatarSquareSelection = {
  x: AVATAR_MAX_WIDTH / 2,
  y: AVATAR_MAX_HEIGHT / 2,
};

const image = new Image();

image.onload = () => {
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d");
  ctx?.drawImage(image, 0, 0);

  const context = canvas.getContext("2d");

  if (context) {
    paintSelectionSquare(context, selection);
  }
};

const paintSelectionSquare = (
  context: CanvasRenderingContext2D,
  selection: AvatarSquareSelection,
) => {
  const { x1, y1 } = getAvatarSquareCoordinates(selection);
  context.strokeStyle = "pink";
  context.lineWidth = 3;
  context.strokeRect(x1, y1, AVATAR_MAX_WIDTH, AVATAR_MAX_HEIGHT);
};

export const setupAvatarField = () => {
  const avatarBtn = $id("avatarBtn") as PrettyButton;
  const fileInput = $id("avatarInput") as HTMLInputElement;

  avatarBtn.on("click", () => fileInput.click());

  fileInput.addEventListener("change", (event: Event) => {
    const target = event.target as HTMLInputElement;
    const selectedFile = target.files?.[0];

    const dialog = $id("avatarPreviewDialog") as PrettyDialog;
    if (dialog && selectedFile) {
      dialog.open();
    }

    if (canvas && selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        image.src = e.target?.result as string;
      };
      reader.readAsDataURL(selectedFile);
    }
  });

  canvas.addEventListener("click", (event: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    selection.x = event.clientX - rect.left;
    selection.y = event.clientY - rect.top;
    const context = canvas.getContext("2d");
    if (context) {
      context.drawImage(image, 0, 0);
      paintSelectionSquare(context, selection);
    }
  });
};
