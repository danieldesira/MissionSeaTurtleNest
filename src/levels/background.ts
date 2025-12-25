import { game } from "../singletons/Game";

type Options = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
};

/**
 * Renders visible part of background.
 * @param options Background painting options
 * @author Daniel Desira
 */
export const paintLevelBg = (options: Options) => {
  const backgroundImage = game.level?.bgImg;
  if (backgroundImage) {
    const horizontalSegments = calculateScreenCutOffPoints(
      backgroundImage.width,
      options.canvas.width,
    );
    const verticalSegments = calculateScreenCutOffPoints(
      backgroundImage.height,
      options.canvas.height,
    );
    const x =
      game.turtle.x < options.canvas.width
        ? 0
        : horizontalSegments[
            Math.floor(backgroundImage.width / game.turtle.x) - 1
          ];
    const y =
      game.turtle.y < options.canvas.height
        ? 0
        : verticalSegments[
            Math.floor(backgroundImage.height / game.turtle.y) - 1
          ];
    options.context.drawImage(
      backgroundImage,
      x,
      y,
      options.canvas.width,
      options.canvas.height,
      0,
      0,
      options.canvas.width,
      options.canvas.height,
    );
    updateBgOffset(x, y);
  }
};

const calculateScreenCutOffPoints = (
  bgSize: number,
  canvasSize: number,
): Array<number> => {
  const noOfFits = Math.floor(bgSize / canvasSize);
  return [
    ...Array.from({ length: noOfFits - 1 }, (_, i) => (i + 1) * canvasSize),
    bgSize - noOfFits * canvasSize,
  ];
};

/**
 * Adjusts canvas size according to background.
 * @param canvas The canvas element
 * @author Daniel Desira
 */
export const readjustCanvasForBg = (canvas: HTMLCanvasElement) => {
  const bgImg = game.level?.bgImg;
  if (bgImg?.height < canvas.height) {
    canvas.height = bgImg.height;
  }
  if (bgImg?.width < canvas.width) {
    canvas.width = bgImg.width;
  }
};

const updateBgOffset = (x: number, y: number) => {
  game.level.bgOffsetX = x;
  game.level.bgOffsetY = y;
};
