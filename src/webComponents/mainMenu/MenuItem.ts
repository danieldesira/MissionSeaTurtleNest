class MenuItem extends HTMLElement {
  constructor() {
    super();

    const template = document.getElementById(
      "menuItemTemplate"
    ) as HTMLTemplateElement;
    const templateContent = template.content.cloneNode(true);
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(templateContent);
  }

  set onClick(callback: () => void) {
    this.addEventListener("click", callback);
  }
}

export default MenuItem;
