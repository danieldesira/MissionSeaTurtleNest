import PrettyDialog from "./dialog/PrettyDialog";
import PrettyButton from "./form/PrettyButton";
import MenuItem from "./mainMenu/MenuItem";

const components: {
  tag: string;
  jsClass: CustomElementConstructor;
}[] = [
  { tag: "menu-item", jsClass: MenuItem },
  { tag: "pretty-dialog", jsClass: PrettyDialog },
  { tag: "pretty-button", jsClass: PrettyButton },
];

export const registerComponents = () =>
  components.forEach(({ tag, jsClass }) => customElements.define(tag, jsClass));

export const loadTemplate = (
  templateId: string,
  elementContext: HTMLElement
) => {
  const template = document.getElementById(templateId) as HTMLTemplateElement;
  const templateContent = template.content.cloneNode(true);
  const shadowRoot = elementContext.attachShadow({ mode: "open" });
  shadowRoot.appendChild(templateContent);
};
