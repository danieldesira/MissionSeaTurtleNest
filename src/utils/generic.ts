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
export const resizeCanvas = (
  canvas: HTMLCanvasElement,
  bgImg: HTMLImageElement,
) => {
  if (canvas) {
    const { width: bgWidth, height: bgHeight } = bgImg;
    canvas.width = Math.min(window.innerWidth, bgWidth);
    canvas.height = Math.min(window.innerHeight, bgHeight);
  }
};

/**
 * Wrapper for the native ``vibrate`` method, only available on mobile browsers.
 * Vibration duration fixed at 300ms.
 * @author Daniel Desira
 */
export const vibrate = () => {
  if (navigator.vibrate) {
    navigator.vibrate(300);
  }
};
