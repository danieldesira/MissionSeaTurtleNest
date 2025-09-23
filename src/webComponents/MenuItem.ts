class MenuItem extends HTMLElement {
  constructor() {
    super();

    const text = this.innerText;
    this.innerText = "";

    const span = document.createElement("span");
    span.classList.add("text-primary", "text-5xl");
    span.setAttribute("role", "button");
    span.innerText = text;
    this.appendChild(span);
  }

  set onClick(callback: () => void) {
    this.addEventListener("click", callback);
  }
}

export default MenuItem;
