import type { Direction } from "../types";
import { paintTriangle, type TrianglePoints } from "../utils/canvas";
import { getCanvas } from "../utils/ui/gameplay";
import type { INonMainCharacter } from "./interfaces";

const triangleLength = 10;

const getOffscreenIndicatorStartCoordinates = (
  character: INonMainCharacter
) => {
  const { width: canvasWidth, height: canvasHeight } = getCanvas();
  let x1: number, y1: number;
  if (character.isOffScreenLeft()) {
    x1 = 0;
    y1 = character.y;
  } else if (character.isOffScreenRight()) {
    x1 = canvasWidth - triangleLength;
    y1 = character.y;
  } else if (character.isOffScreenTop()) {
    x1 = character.x;
    y1 = 0;
  } else {
    x1 = character.x;
    y1 = canvasHeight - triangleLength;
  }
  return { x1, y1 };
};

export const paintOffScreenIndicator = (
  context: CanvasRenderingContext2D,
  character: INonMainCharacter
) => {
  const { x1, y1 } = getOffscreenIndicatorStartCoordinates(character);

  const trianglePointsDirectionMap: Record<Direction, TrianglePoints> = {
    Left: {
      point1: { x: x1, y: y1 },
      point2: { x: x1 + triangleLength, y: y1 - triangleLength },
      point3: { x: x1 + triangleLength, y: y1 + triangleLength },
    },
    Right: {
      point1: { x: x1, y: y1 },
      point2: { x: x1 - triangleLength, y: y1 - triangleLength },
      point3: { x: x1 - triangleLength, y: y1 + triangleLength },
    },
    Up: {
      point1: { x: x1, y: y1 },
      point2: { x: x1 - triangleLength, y: y1 - triangleLength },
      point3: { x: x1 + triangleLength, y: y1 - triangleLength },
    },
    Down: {
      point1: { x: x1, y: y1 },
      point2: { x: x1 - triangleLength, y: y1 - triangleLength },
      point3: { x: x1 + triangleLength, y: y1 - triangleLength },
    },
  };

  paintTriangle(
    context,
    trianglePointsDirectionMap[character.direction],
    character.offscreenIndicatorColor
  );
};
