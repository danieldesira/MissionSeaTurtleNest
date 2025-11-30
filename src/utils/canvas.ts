export const paintCircle = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  colour: string
) => {
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI);
  if (colour) {
    context.fillStyle = colour;
    context.fill();
  }
  context.closePath();
};
