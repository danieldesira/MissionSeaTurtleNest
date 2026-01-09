import { loadTemplate } from "../components";

class TextLink extends HTMLElement {
  constructor() {
    super();
    loadTemplate("textLinkTemplate", this);
  }

  connectedCallback() {
    const a = this.shadowRoot.querySelector("a");
    a.href = this.dataset.url;
    a.title = this.dataset.tooltip;
    if (this.dataset.external === "true") {
      a.target = "__blank";
    }
  }

  set action(value: () => void) {
    this.addEventListener("click", value);
  }
}

export default TextLink;
