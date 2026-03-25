import { loadTemplate } from "../components";

class TextLink extends HTMLElement {
  constructor() {
    super();
    loadTemplate("textLinkTemplate", this);
  }

  connectedCallback() {
    const a = this.shadowRoot?.querySelector("a");
    if (a) {
      a.href = this.dataset.url ?? "";
      if (this.dataset.external === "true") {
        a.target = "__blank";
        a.rel = "noopener noreferrer";
      }
    }
  }
}

export default TextLink;
