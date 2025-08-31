import { createRoot } from "react-dom/client";
import App from "./components/App";
import "./main.css";

if (navigator.serviceWorker) {
  try {
    window.addEventListener("load", async () => {
      const worker = await navigator.serviceWorker.register("cacheServiceWorker.js");
      console.log(`Registered service worker ${worker}`);
    });
  } catch (error) {
    console.error(error);
  }
}

const appRootElement = document.getElementById("root") as HTMLElement;
const root = createRoot(appRootElement);
root.render(<App />);
