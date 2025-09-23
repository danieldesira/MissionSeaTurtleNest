import "./main.css";
import MenuItem from "./webComponents/MenuItem";

if (navigator.serviceWorker) {
  try {
    window.addEventListener("load", async () => {
      const worker = await navigator.serviceWorker.register("serviceWorker.js");
      console.log(`Registered service worker ${worker}`);
    });
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  document.body.addEventListener("contextmenu", (event) =>
    event.preventDefault()
  );

  customElements.define("menu-item", MenuItem);

  const newGameBtn = document.getElementById("newGameBtn") as MenuItem;
  newGameBtn.onClick = () => {
    alert("New Game button clicked");
    // Add logic to start a new game here
  };

  const continueGameBtn = document.getElementById(
    "continueGameBtn"
  ) as MenuItem;
  continueGameBtn.onClick = () => {
    alert("Continue Game button clicked");
    // Add logic to start a new game here
  };

  const instructionsBtn = document.getElementById(
    "instructionsBtn"
  ) as MenuItem;
  instructionsBtn.onClick = () => {
    alert("Instructions button clicked");
    // Add logic to start a new game here
  };
});
