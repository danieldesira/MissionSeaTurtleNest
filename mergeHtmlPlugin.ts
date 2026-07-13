import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { ViteDevServer } from "vite";
import { version } from "./package.json";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const processFile = (filePath: string) => {
  console.log(`Processing file: ${filePath}`);

  let content = fs.readFileSync(filePath, "utf-8");
  for (const match of content.matchAll(/@[a-z]+(\(([a-z]|.)+\))?/g)) {
    const directive = match[0];
    if (directive.startsWith("@import")) {
      const templatePath = directive
        .substring(directive.indexOf("(") + 1, directive.indexOf(")"))
        .trim();
      if (fs.existsSync(templatePath)) {
        content = content.replace(
          directive,
          processFile(path.resolve(__dirname, templatePath)),
        );
      }
    } else if (directive.startsWith("@version")) {
      console.log("Insert Version");
      content = content.replace(directive, version);
    } else if (directive.startsWith("@build")) {
      console.log("Insert Build date");
      const buildDate = new Date();
      content = content.replace(directive, buildDate.toDateString());
    }
  }
  return content;
};

const runJob = () => {
  const inputPath = path.resolve(__dirname, "src/index.base.html");
  const outputIndex = path.resolve(__dirname, "index.html");

  console.log("Creating index.html...");

  const content = processFile(inputPath);
  fs.writeFileSync(outputIndex, content, "utf-8");

  console.log("index.html created successfully!");
};

const pathsToWatch = ["src/webComponents", "src/htmlFragments"];

const mergeHtmlPlugin = () => ({
  name: "merge-html-plugin",
  configureServer(server: ViteDevServer) {
    runJob();

    pathsToWatch.forEach((p) => server.watcher.add(path.resolve(__dirname, p)));

    server.watcher.on("change", (file) => {
      if (file.endsWith(".html")) {
        runJob();
        server.ws.send({ type: "full-reload" });
      }
    });
  },
  buildStart() {
    runJob();
  },
});

export default mergeHtmlPlugin;
