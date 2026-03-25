import { loadTemplate } from "../components";

class SocialLink extends HTMLElement {
  constructor() {
    super();
    loadTemplate("socialLinkTemplate", this);
  }

  connectedCallback() {
    const a = this.shadowRoot?.querySelector("a");
    if (a) {
      a.href = this.dataset.url ?? "";
      a.title = this.dataset.tooltip ?? "";
      if (this.dataset.external === "true") {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
    }
  }

  on(eventType: "click", callback: () => void) {
    this.addEventListener(eventType, callback);
  }
}

export default SocialLink;
