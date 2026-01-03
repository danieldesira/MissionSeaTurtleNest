import { loadTemplate } from "../components";

class SocialLink extends HTMLElement {
  constructor() {
    super();
    loadTemplate("socialLinkTemplate", this);
  }

  connectedCallback() {
    const a = this.shadowRoot.querySelector("a");
    a.href = this.dataset.url;
    a.title = this.dataset.tooltip;
  }
}

export default SocialLink;
