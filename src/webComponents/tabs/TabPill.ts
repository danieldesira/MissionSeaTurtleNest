import { loadTemplate } from "../components";
import type TabContainer from "./TabContainer";

class TabPill extends HTMLElement {
  static observedAttributes = ["data-active", "data-container", "name"];

  constructor() {
    super();
    loadTemplate("tabPillTemplate", this);

    if (this.dataset.active !== undefined) {
      this.isActive = true;
    }
  }

  set isActive(value: boolean) {
    const pill = this.shadowRoot.querySelector(
      '[role="button"]',
    ) as HTMLElement;
    if (value) {
      pill.classList.add("active");
      this.showTabContainer();
    } else {
      pill.classList.remove("active");
      this.hideTabContainer();
    }
  }

  get isActive() {
    const pill = this.shadowRoot.querySelector(
      '[role="button"]',
    ) as HTMLElement;
    return pill.classList.contains("active");
  }

  set isVisible(value: boolean) {
    const pill = this.shadowRoot.querySelector(
      '[role="button"]',
    ) as HTMLElement;
    if (value) {
      pill.classList.remove("hidden");
    } else {
      pill.classList.add("hidden");
    }
  }

  private showTabContainer() {
    const container = document.getElementById(
      this.dataset.container,
    ) as TabContainer;
    container?.show();
  }

  private hideTabContainer() {
    const container = document.getElementById(
      this.dataset.container,
    ) as TabContainer;
    container?.hide();
  }

  connectedCallback() {
    this.addEventListener("click", () => {
      const groupPills = document.querySelectorAll<TabPill>(
        `tab-pill[name="${this.getAttribute("name")}"]`,
      );
      groupPills.forEach((p) => {
        p.isActive = p === this;
      });
    });
  }
}

export default TabPill;
