import PrettyDialog from "../../webComponents/dialog/PrettyDialog";
import PrettyButton from "../../webComponents/form/PrettyButton";
import { $id } from "./domQuery";

const AVATAR_MAX_WIDTH = 150;
const AVATAR_MAX_HEIGHT = 150;
const LINE_WIDTH = 3;
const COLOUR = getComputedStyle(document.documentElement).getPropertyValue(
  "--color-primary",
);

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
  let x1: number, y1: number, x2: number, y2: number;

  if (selection.x < AVATAR_MAX_WIDTH / 2) {
    x1 = 0;
    x2 = AVATAR_MAX_WIDTH;
  } else if (selection.x > canvas.width - AVATAR_MAX_WIDTH / 2) {
    x1 = canvas.width - AVATAR_MAX_WIDTH;
    x2 = canvas.width;
  } else {
    x1 = selection.x - AVATAR_MAX_WIDTH / 2;
    x2 = selection.x + AVATAR_MAX_WIDTH / 2;
  }

  if (selection.y < AVATAR_MAX_HEIGHT / 2) {
    y1 = 0;
    y2 = AVATAR_MAX_HEIGHT;
  } else if (selection.y > canvas.height - AVATAR_MAX_HEIGHT / 2) {
    y1 = canvas.height - AVATAR_MAX_HEIGHT;
    y2 = canvas.height;
  } else {
    y1 = selection.y - AVATAR_MAX_HEIGHT / 2;
    y2 = selection.y + AVATAR_MAX_HEIGHT / 2;
  }

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
  context.strokeStyle = COLOUR;
  context.lineWidth = LINE_WIDTH;
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
