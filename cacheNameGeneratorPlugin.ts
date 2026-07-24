import { version } from "./package.json";
import path from "path";
import fs from "fs";

const runJob = () => {
  const outputIndex = path.resolve(
    __dirname,
    "src/serviceWorkers/cacheVersion.json",
  );

  console.log("Creating cacheVersion.json...");

  const content = JSON.stringify({ version, timestamp: new Date().getTime() });
  fs.writeFileSync(outputIndex, content, "utf-8");

  console.log("cacheVersion.json created successfully!");
};

const cacheNameGeneratorPlugin = () => ({
  name: "cache-name-generator-plugin",
  buildStart() {
    runJob();
  },
});

export default cacheNameGeneratorPlugin;
