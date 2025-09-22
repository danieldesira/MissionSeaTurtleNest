import store from "../store";
import { Provider } from "react-redux";
import { Analytics } from "@vercel/analytics/react";
import ScreenSelector from "./ScreenSelector";

const App = () => (
  <Provider store={store}>
    <ScreenSelector />
    <div className="landscape:hidden flex justify-center items-center bg-red-700">
      <p className="text-white">
        Unable to play game in portrait mode. Please switch your device to
        landscape mode or install the Progressive Web App in Chrome, Edge or
        Firefox with the Progressive Web App addon.
      </p>
    </div>
    <Analytics />
  </Provider>
);

export default App;
