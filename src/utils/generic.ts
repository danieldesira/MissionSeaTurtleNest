import { readjustCanvasForBg } from "../levels/background";
import store from "../store";

/**
 * Randomises true or false.
 * @returns Random boolean
 * @author Daniel Desira
 */
export const generateRandomBit = (): boolean => !!Math.round(Math.random());

/**
 * Resizes canvas while taking the background size in
 * consideration.
 * @param canvas The canvas element
 * @author Daniel Desira
 */
export const resizeCanvas = (canvas: HTMLCanvasElement) => {
  if (canvas) {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    readjustCanvasForBg(canvas);
  }
};