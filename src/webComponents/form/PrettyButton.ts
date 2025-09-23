class PrettyButton extends HTMLElement {
  constructor() {
    super();

    const template = document.getElementById(
      "prettyButtonTemplate"
    ) as HTMLTemplateElement;
    const templateContent = template.content.cloneNode(true);
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(templateContent);
  }
}

export default PrettyButton;
