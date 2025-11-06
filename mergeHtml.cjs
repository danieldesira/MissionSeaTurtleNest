const fs = require("fs");
const path = require("path");

const inputIndex = path.resolve(__dirname, "index.base.html");
const outputIndex = path.resolve(__dirname, "index.html");

console.log("Merging index.html");

let indexContent = fs.readFileSync(inputIndex, "utf-8");
let indexPosition = 0;
while (indexPosition < indexContent.length && indexPosition !== -1) {
  indexPosition = indexContent.indexOf("<!--", indexPosition);
  const closingPosition = indexContent.indexOf("-->", indexPosition);
  if (closingPosition !== -1) {
    const templatePath = indexContent.substring(
      indexPosition + 4,
      closingPosition
    );
    const content = fs.readFileSync(templatePath, "utf-8");
    indexContent = indexContent.replace(`<!--${templatePath}-->`, content);
  }
}

fs.writeFileSync(outputIndex, indexContent, "utf-8");

console.log("Finished merging index.html");
