import { loadTemplate } from "../components";

class GameGauge extends HTMLElement {
  constructor() {
    super();
    loadTemplate("gameGaugeTemplate", this);
  }

  set currentValue(value: number) {
    const meter = this.shadowRoot.querySelector("meter");
    meter.value = value;
    meter.title = `${value.toString()}%`;
  }
}

export default GameGauge;
