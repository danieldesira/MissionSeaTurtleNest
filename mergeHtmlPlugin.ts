import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { ViteDevServer } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const processFile = (filePath: string) => {
  console.log(`Processing file: ${filePath}`);

  let content = fs.readFileSync(filePath, "utf-8");
  let indexPosition = 0;
  let closingPosition = 0;
  while (indexPosition < content.length && indexPosition !== -1) {
    const commentOpenBracket = "<!--";
    const commentCloseBracket = "-->";
    indexPosition = content.indexOf(commentOpenBracket, closingPosition);
    closingPosition = content.indexOf(commentCloseBracket, indexPosition);
    if (closingPosition !== -1) {
      const commentContent = content.substring(
        indexPosition + commentOpenBracket.length,
        closingPosition
      );
      const keyword = "@inject";
      if (commentContent.includes(keyword)) {
        const templatePath = commentContent
          .substring(commentContent.indexOf(keyword) + keyword.length)
          .trim();
        if (fs.existsSync(templatePath)) {
          content = content.replace(
            `<!--${commentContent}-->`,
            processFile(path.resolve(__dirname, templatePath))
          );
        }
      }
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
