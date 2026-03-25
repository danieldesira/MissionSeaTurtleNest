import { loadTemplate } from "../components";

class GameControl extends HTMLElement {
  constructor() {
    super();
    loadTemplate("gameControlTemplate", this);
  }

  onAction(callback: () => void) {
    let timer = 0;

    const handleMousedown = () => {
      callback();
      timer = requestAnimationFrame(handleMousedown);
    };

    const handleMouseup = () => cancelAnimationFrame(timer);

    this.addEventListener("mousedown", (event) => {
      const leftMouseButton = 0;
      if (event.button === leftMouseButton) {
        handleMousedown();
      }
    });
    this.addEventListener("mouseup", handleMouseup);
    this.addEventListener("mouseleave", handleMouseup);
    this.addEventListener("touchstart", handleMousedown);
    this.addEventListener("touchend", handleMouseup);
  }
}

export default GameControl;
