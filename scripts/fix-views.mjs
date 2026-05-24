import fs from "node:fs";
import path from "node:path";

const file = path.join(import.meta.dirname, "..", "src/components/axis/views.tsx");
const lines = fs.readFileSync(file, "utf-8").split("\n");

// Drop Nav block (function Nav ... through closing }; before AIChat)
let start = lines.findIndex((l) => l.startsWith("function Nav("));
let end = lines.findIndex((l, i) => i > start && l.startsWith("function AIChat("));
if (start >= 0 && end > start) lines.splice(start, end - start);

let body = lines.join("\n");

body = body.replace(/export export /g, "export ");
body = body.replace(/export function (\w+) = /g, "function $1(");
body = body.replace(/function (\w+)\(\(\{/g, "function $1({");
body = body.replace(/\}\) => \{/g, "}) {");
body = body.replace(/function (\w+)\(\(\) => \(/g, "export function $1() { return (");
body = body.replace(/function (\w+)\(\) => \(/g, "export function $1() { return (");
body = body.replace(/function (\w+)\(\{[^}]+\}\) => \(/g, "export function $1() { return (");
body = body.replace(/function (\w+)\(\{[^}]+\}\) => \{/g, "export function $1() {");
body = body.replace(/function (\w+)\(\(\) => \{/g, "export function $1() {");
body = body.replace(/function (\w+)\(\) => \{/g, "export function $1() {");
body = body.replace(/\n\};\n\nexport function/g, "\n}\n\nexport function");
body = body.replace(/\n\};\n\nfunction /g, "\n}\n\nfunction ");

const renames = [
  ["function HomePage", "export function HomeView"],
  ["function InventoryPage", "export function InventoryView"],
  ["function VehicleDetailPage", "export function VehicleDetailView"],
  ["function AdminPage", "export function AdminView"],
  ["function Footer", "export function SiteFooter"],
  ["function ToolsPage", "export function ToolsView"],
  ["function AboutPage", "export function AboutView"],
  ["function ContactPage", "export function ContactView"],
];
for (const [a, b] of renames) body = body.replace(a, b);

body = body
  .replace(/export function HomeView\(\{[^}]+\}\)/, "export function HomeView()")
  .replace(/export function InventoryView\(\{[^}]+\}\)/, "export function InventoryView()")
  .replace(
    /export function VehicleDetailView\(\{[^}]+\}\)/,
    "export function VehicleDetailView({ vehicle }: { vehicle: Vehicle })"
  )
  .replace(/export function AdminView\(\{setPage\}\)/, "export function AdminView()")
  .replace(/export function SiteFooter\(\{setPage\}\)/, "export function SiteFooter()")
  .replace(/export function Hero\(\{setPage\}\)/, "export function Hero()")
  .replace(/export function FeaturedVehicles\(\{[^}]+\}\)/, "export function FeaturedVehicles()")
  .replace(/export function ImportProcessSection\(\{setPage\}\)/, "export function ImportProcessSection()")
  .replace(/export function CTABanner\(\{setPage\}\)/, "export function CTABanner()");

for (const name of [
  "HomeView", "InventoryView", "VehicleDetailView", "AdminView",
  "Hero", "FeaturedVehicles", "ImportProcessSection", "CTABanner", "SiteFooter", "ToolsView",
]) {
  body = body.replace(
    new RegExp(`(export function ${name}\\([^)]*\\) \\{)(?!\\s*const \\{ vehicles)`),
    "$1\n  const { vehicles, go, goDetail, router } = usePageNav();\n"
  );
}

body = body.replace(
  /export function AdminView\(\) \{\n  const \{ vehicles, go, goDetail, router \} = usePageNav\(\);\n/,
  "export function AdminView() {\n  const { vehicles, go, router } = usePageNav();\n  const { toggleVehicleStatus, deleteVehicle } = useVehicles();\n"
);
body = body.replace(/\n  const \[vehicles, setVehicles\] = useState\(vehicles\);\n/, "\n");
body = body.replace(
  /const toggleStatus = \(id\) => \{[\s\S]*?\};/,
  "const toggleStatus = toggleVehicleStatus;"
);
body = body.replace(/setVehicles\(v=>v\.filter\(x=>x\.id!==id\)\)/g, "deleteVehicle(id)");

body = body
  .replace(/<Hero setPage=\{setPage\}\/>/g, "<Hero />")
  .replace(/<FeaturedVehicles[\s\S]*?\/>/g, "<FeaturedVehicles />")
  .replace(/<ImportProcessSection setPage=\{setPage\}\/>/g, "<ImportProcessSection />")
  .replace(/<CTABanner setPage=\{setPage\}\/>/g, "<CTABanner />");

// Close implicit-return components
for (const fn of ["WhyUs", "Testimonials", "CTABanner", "AboutView", "ContactView", "ImportProcessSection"]) {
  body = body.replace(
    new RegExp(`(export function ${fn}\\(\\) \\{ return \\([\\s\\S]*?\\n\\);)(?!\\n\\})`),
    "$1\n}"
  );
}

if (!body.includes("AIChatWidget")) {
  body += `
export function AIChatWidget({ onClose, vehicle }: { onClose: () => void; vehicle?: Vehicle | null }) {
  return <AIChat onClose={onClose} vehicle={vehicle} />;
}
`;
}

fs.writeFileSync(file, body);
console.log("Fixed views.tsx");
