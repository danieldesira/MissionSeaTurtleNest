type Coordinates = { x: number; y: number };

export type TrianglePoints = {
  point1: Coordinates;
  point2: Coordinates;
  point3: Coordinates;
};

export const paintTriangle = (
  context: CanvasRenderingContext2D,
  {
    point1: { x: x1, y: y1 },
    point2: { x: x2, y: y2 },
    point3: { x: x3, y: y3 },
  }: TrianglePoints,
  colour: string
) => {
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.lineTo(x3, y3);
  context.lineTo(x1, y1);
  context.closePath();
  context.strokeStyle = colour;
  context.fillStyle = colour;
  context.stroke();
  context.fill();
};
