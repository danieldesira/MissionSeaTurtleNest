import PrettyDialog from "./dialog/PrettyDialog";
import FormField from "./form/FormField";
import ImageUploader from "./form/ImageUploader";
import PrettyButton from "./form/PrettyButton";
import RadioSelection from "./form/RadioSelection";
import TextInput from "./form/TextInput";
import GameControl from "./gameplay/GameControl";
import GameGauge from "./gameplay/GameGauge";
import MenuItem from "./mainMenu/MenuItem";
import TabContainer from "./tabs/TabContainer";
import TabPill from "./tabs/TabPill";

type ComponentRegistration = {
  tag: string;
  Constructor: CustomElementConstructor;
  dependencies?: ComponentRegistration[];
};

const components: ComponentRegistration[] = [
  { tag: "menu-item", Constructor: MenuItem },
  { tag: "pretty-dialog", Constructor: PrettyDialog },
  { tag: "pretty-button", Constructor: PrettyButton },
  { tag: "game-control", Constructor: GameControl },
  { tag: "game-gauge", Constructor: GameGauge },
  {
    tag: "tab-pill",
    Constructor: TabPill,
    dependencies: [
      {
        tag: "tab-container",
        Constructor: TabContainer,
      },
    ],
  },
  { tag: "radio-selection", Constructor: RadioSelection },
  { tag: "text-input", Constructor: TextInput },
  { tag: "image-uploader", Constructor: ImageUploader },
  { tag: "form-field", Constructor: FormField },
];

const registerComponentWithDependencies = ({
  tag,
  Constructor,
  dependencies,
}: ComponentRegistration) => {
  if (dependencies) {
    dependencies.forEach((dep) => registerComponentWithDependencies(dep));
  }
  customElements.define(tag, Constructor);
};

export const registerComponents = () =>
  components.forEach(registerComponentWithDependencies);

export const loadTemplate = (templateId: string, host: HTMLElement) => {
  const template = document.getElementById(templateId) as HTMLTemplateElement;
  const templateContent = template.content.cloneNode(true);
  const shadowRoot = host.attachShadow({ mode: "open" });
  shadowRoot.appendChild(templateContent);
};
