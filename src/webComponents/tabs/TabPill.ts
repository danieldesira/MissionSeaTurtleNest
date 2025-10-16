import { loadTemplate } from "../components";
import TabContainer from "./TabContainer";

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
      '[role="button"]'
    ) as HTMLElement;
    if (value) {
      pill.classList.add("active");
      this.showTabContainer();
    } else {
      pill.classList.remove("active");
      this.hideTabContainer();
    }
  }

  private showTabContainer() {
    const container = document.getElementById(
      this.dataset.container
    ) as TabContainer;
    container?.show();
  }

  private hideTabContainer() {
    const container = document.getElementById(
      this.dataset.container
    ) as TabContainer;
    container?.hide();
  }
}

export default TabPill;
