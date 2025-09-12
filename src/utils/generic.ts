import { readjustCanvasForBg } from "../levels/background";
import store from "../store";

/**
 * Randomises true or false.
 * @returns Random boolean
 * @author Daniel Desira
 */
export const generateRandomBit = (): boolean => !!Math.round(Math.random());

/**
 * Checks if a custom dialog set from global state is open
 * @returns True when dialog state is set
 * @author Daniel Desira
 */
export const isCustomDialogOpen = (): boolean =>
  !!store.getState().dialogs.dialog.title;

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

/**
 * Wrapper for the native ``vibrate`` method, only available on mobile browsers.
 * @author Daniel Desira
 */
export const vibrate = () => {
  if (navigator.vibrate) {
    navigator.vibrate(300);
  }
};
