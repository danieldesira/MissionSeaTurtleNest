import PrettyDialog from "./dialog/PrettyDialog";
import PrettyButton from "./form/PrettyButton";
import MenuItem from "./mainMenu/MenuItem";

const components: { tag: string; element: CustomElementConstructor }[] = [
  { tag: "menu-item", element: MenuItem },
  { tag: "pretty-dialog", element: PrettyDialog },
  { tag: "pretty-button", element: PrettyButton },
];

export const registerComponents = () =>
  components.forEach(({ tag, element }) => customElements.define(tag, element));
