import { loadTemplate } from "../components";

class PrettyTab extends HTMLElement {
  constructor() {
    super();
    loadTemplate("prettyTabTemplate", this);
  }
}

export default PrettyTab;
