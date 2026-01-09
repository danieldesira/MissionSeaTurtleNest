import { version } from "../../../package.json";

export const printVersion = () => {
  const versionLink = document.getElementById("version");
  versionLink.innerText = version;
};
