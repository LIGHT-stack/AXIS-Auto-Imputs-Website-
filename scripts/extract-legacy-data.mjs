import fs from "node:fs";
import path from "node:path";

const root = path.join(import.meta.dirname, "..");
const src = fs.readFileSync(
  path.join(root, "src/components/legacy/AxisApp.jsx"),
  "utf-8"
);

function extract(name, pattern, transform = (s) => s) {
  const m = src.match(pattern);
  if (!m) throw new Error(`Could not extract ${name}`);
  return transform(m[1]);
}

const vehicles = extract(
  "VEHICLES",
  /const VEHICLES = (\[[\s\S]*?\n\]);/
);
fs.writeFileSync(
  path.join(root, "src/data/vehicles.ts"),
  `import type { Vehicle } from "@/types/vehicle";\n\nexport const vehicles: Vehicle[] = ${vehicles};\n`
);

const constants = [
  ["heroSlides", /const HERO_SLIDES = (\[[\s\S]*?\n\]);/],
  ["testimonials", /const TESTIMONIALS = (\[[\s\S]*?\n\]);/],
  ["faqs", /const FAQS = (\[[\s\S]*?\n\]);/],
];

let contentBody = "";
for (const [exportName, pattern] of constants) {
  contentBody += `export const ${exportName} = ${extract(exportName, pattern)};\n\n`;
}
fs.writeFileSync(path.join(root, "src/data/site-content.ts"), contentBody);

const styleMatch = src.match(/<style>\{`([\s\S]*?)`\}<\/style>/);
if (styleMatch) {
  const css =
    `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');\n` +
    styleMatch[1];
  const stylesDir = path.join(root, "src/styles");
  fs.mkdirSync(stylesDir, { recursive: true });
  fs.writeFileSync(path.join(stylesDir, "axis.css"), css);
}

console.log("Extracted vehicles, site-content, axis.css");
