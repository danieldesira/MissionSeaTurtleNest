import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const jsonPath = path.resolve(
  __dirname,
  "src/utils/musicTotalSizeByFormat.json",
);
const musicPath = path.resolve(__dirname, "public/music");

fs.readdir(musicPath, (err, files) => {
  if (err) {
    console.error("Error reading music directory:", err);
    return;
  }

  const sizeByFormat: Record<string, number> = {};

  files.forEach((file) => {
    const ext = path.extname(file).substring(1); // Get file extension without dot
    const filePath = path.join(musicPath, file);
    const stats = fs.statSync(filePath);
    sizeByFormat[ext] = (sizeByFormat[ext] || 0) + stats.size;
  });

  fs.writeFileSync(jsonPath, JSON.stringify(sizeByFormat, null, 2), "utf-8");
  console.log("Music sizes by format written to", jsonPath);
});
