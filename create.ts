import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

type EntityConfig = {
  templateFile: string;
  placeholder: string;
  outputDir: string;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const [entityType, entityName] = process.argv.slice(2);

const createCharacterClass = () => {
  const templateContent = fs.readFileSync(templateFile, "utf-8");
  const newContent = templateContent
    .replaceAll(config[entityType].placeholder, entityName)
    .replaceAll(
      `${config[entityType].placeholder[0].toLowerCase()}${config[
        entityType
      ].placeholder.slice(1)}`,
      expectedSvgFilename,
    );
  fs.writeFileSync(newFile, newContent);
};

const appendSvgToPrecacheList = () => {
  const precacheResourcesPath = path.join(
    __dirname,
    "src/serviceWorkers/precacheResources.json",
  );
  const precacheResourcesContent = fs.readFileSync(
    precacheResourcesPath,
    "utf-8",
  );
  const precacheResourcesList = JSON.parse(
    precacheResourcesContent,
  ) as string[];
  precacheResourcesList.push(`images/characters/${expectedSvgFilename}.svg`);
  const newPrecacheResourceContent = JSON.stringify(
    precacheResourcesList,
    null,
    "  ",
  );
  fs.writeFileSync(precacheResourcesPath, newPrecacheResourceContent);
};

if (!entityType || !entityName) {
  console.error(
    "Usage: node --experimental-strip-types create.ts <entityType> <entityName>",
  );
  process.exit(1);
}

const templatesDir = path.join(__dirname, "src/characters/templates");

const config: Record<string, EntityConfig> = {
  obstacle: {
    templateFile: "NewObstacle.ts",
    placeholder: "NewObstacle",
    outputDir: path.join(__dirname, "src/characters/obstacles"),
  },
  prey: {
    templateFile: "NewPrey.ts",
    placeholder: "NewPrey",
    outputDir: path.join(__dirname, "src/characters/prey"),
  },
};

const supportedEntityTypes = Object.keys(config);

if (!config[entityType]) {
  console.error(`Unknown entity type: ${entityType}`);
  console.error(`Supported entity types: ${supportedEntityTypes.join(", ")}`);
  process.exit(1);
}

const templateFile = path.join(templatesDir, config[entityType]?.templateFile);
const newFile = path.join(config[entityType]?.outputDir, `${entityName}.ts`);

if (!templateFile || !fs.existsSync(templateFile)) {
  console.error(`Template for entity type "${entityType}" does not exist.`);
  process.exit(1);
}

if (fs.existsSync(newFile)) {
  console.error(
    `A file named "${entityName}.ts" already exists in ${config[entityType].outputDir}.`,
  );
  process.exit(1);
}

const expectedSvgFilename = `${entityName[0].toLowerCase()}${entityName.slice(
  1,
)}`;

createCharacterClass();
appendSvgToPrecacheList();

console.log(`Created new ${entityType} character: ${newFile}`);
