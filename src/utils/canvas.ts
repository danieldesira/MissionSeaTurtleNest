export const paintCircle = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  fillStyle: string,
  borderStyle?: string,
  borderWidth?: number
) => {
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI);
  if (fillStyle) {
    context.fillStyle = fillStyle;
    context.fill();
  }
  if (borderStyle && borderWidth) {
    context.lineWidth = borderWidth;
    context.strokeStyle = borderStyle;
    context.stroke();
  }
  context.closePath();
};
