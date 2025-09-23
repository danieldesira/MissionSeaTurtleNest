class PrettyDialog extends HTMLElement {
  constructor() {
    super();

    const template = document.getElementById(
      "prettyDialogTemplate"
    ) as HTMLTemplateElement;
    const templateContent = template.content.cloneNode(true);
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(templateContent);
  }
}

export default PrettyDialog;
