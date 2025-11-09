import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { ViteDevServer } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const runJob = () => {
  const inputIndex = path.resolve(__dirname, "index.base.html");
  const outputIndex = path.resolve(__dirname, "index.html");

  console.log("Merging index.html");

  let indexContent = fs.readFileSync(inputIndex, "utf-8");
  let indexPosition = 0;
  let closingPosition = 0;
  while (indexPosition < indexContent.length && indexPosition !== -1) {
    const commentOpenBracket = "<!--";
    const commentCloseBracket = "-->";
    indexPosition = indexContent.indexOf(commentOpenBracket, closingPosition);
    closingPosition = indexContent.indexOf(commentCloseBracket, indexPosition);
    if (closingPosition !== -1) {
      const commentContent = indexContent.substring(
        indexPosition + commentOpenBracket.length,
        closingPosition
      );
      const keyword = "@inject";
      if (commentContent.includes(keyword)) {
        const templatePath = commentContent
          .substring(commentContent.indexOf(keyword) + keyword.length)
          .trim();
        if (fs.existsSync(templatePath)) {
          const content = fs.readFileSync(templatePath, "utf-8");
          indexContent = indexContent.replace(
            `<!--${commentContent}-->`,
            content
          );
        }
      }
    }
  }

  fs.writeFileSync(outputIndex, indexContent, "utf-8");

  console.log("Finished merging index.html");
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
});

export default mergeHtmlPlugin;
