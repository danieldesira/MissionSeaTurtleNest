import { loadTemplate } from "../components";

class SocialLink extends HTMLElement {
  constructor() {
    super();
    loadTemplate("socialLinkTemplate", this);
  }

  connectedCallback() {
    const a = this.shadowRoot.querySelector("a");
    a.href = this.dataset.url;
    a.title = this.dataset.tooltip ?? "";
    if (this.dataset.external === "true") {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
  }

  set action(value: () => void) {
    this.addEventListener("click", value);
  }
}

export default SocialLink;
