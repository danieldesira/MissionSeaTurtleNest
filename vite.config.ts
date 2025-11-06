import { defineConfig } from "vite";
import fs from "fs";
import path from "path";

const getHtmlEntries = (dir: string) => {
  const htmlFiles = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".html"));
  const entries: Record<string, string> = {};
  htmlFiles.forEach((file) => (entries[file] = path.resolve(dir, file)));
  return entries;
};

const htmlTemplates = getHtmlEntries(path.resolve(__dirname, "src"));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        cacheServiceWorker: path.resolve(
          __dirname,
          "src/serviceWorkers/cacheServiceWorker.ts"
        ),
        notificationServiceWorker: path.resolve(
          __dirname,
          "src/serviceWorkers/notificationServiceWorker.ts"
        ),
        //...htmlTemplates,
      },
      output: {
        entryFileNames: (assetInfo) => {
          if (assetInfo.name.includes("Worker")) {
            return `${assetInfo.name}.js`;
          } else {
            return "[name].js";
          }
        },
      },
    },
  },
  server: {
    https: {
      key: fs.readFileSync(
        path.resolve(__dirname, "certs/localhost+2-key.pem")
      ),
      cert: fs.readFileSync(path.resolve(__dirname, "certs/localhost+2.pem")),
    },
  },
});
