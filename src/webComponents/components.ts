import PrettyDialog from "./dialog/PrettyDialog";
import PrettyButton from "./form/PrettyButton";
import GameControl from "./gameplay/GameControl";
import GameGauge from "./gameplay/GameGauge";
import MenuItem from "./mainMenu/MenuItem";
import TabContainer from "./tabs/TabContainer";
import TabPill from "./tabs/TabPill";

const components: {
  tag: string;
  Constructor: CustomElementConstructor;
}[] = [
  { tag: "menu-item", Constructor: MenuItem },
  { tag: "pretty-dialog", Constructor: PrettyDialog },
  { tag: "pretty-button", Constructor: PrettyButton },
  { tag: "game-control", Constructor: GameControl },
  { tag: "game-gauge", Constructor: GameGauge },
  { tag: "tab-pill", Constructor: TabPill },
  { tag: "tab-container", Constructor: TabContainer },
];

export const registerComponents = () =>
  components.forEach(({ tag, Constructor }) =>
    customElements.define(tag, Constructor)
  );

export const loadTemplate = (templateId: string, host: HTMLElement) => {
  const template = document.getElementById(templateId) as HTMLTemplateElement;
  const templateContent = template.content.cloneNode(true);
  const shadowRoot = host.attachShadow({ mode: "open" });
  shadowRoot.appendChild(templateContent);
};
