import { loadTemplate } from "../components";

class GameControl extends HTMLElement {
  constructor() {
    super();
    loadTemplate("gameControlTemplate", this);
  }

  set callback(value: () => void) {
    let timer = 0;

    const handleMousedown = () => {
      value();
      timer = requestAnimationFrame(handleMousedown);
    };

    const handleMouseup = () => cancelAnimationFrame(timer);

    const button = this.shadowRoot.querySelector("button");
    button.addEventListener("mousedown", handleMousedown);
    button.addEventListener("mouseup", handleMouseup);
    button.addEventListener("mouseleave", handleMouseup);
    button.addEventListener("touchstart", handleMousedown);
    button.addEventListener("touchend", handleMouseup);
  }
}

export default GameControl;
