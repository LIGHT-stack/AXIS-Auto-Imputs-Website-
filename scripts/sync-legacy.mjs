import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "..", "axis-auto-imports_1.jsx");
const targetDir = join(root, "src", "components", "legacy");
const target = join(targetDir, "AxisApp.jsx");

if (!existsSync(source)) {
  console.error("Source not found:", source);
  console.error("Place axis-auto-imports_1.jsx in Downloads next to this project.");
  process.exit(1);
}

mkdirSync(targetDir, { recursive: true });
copyFileSync(source, target);
console.log("Copied legacy app →", target);
