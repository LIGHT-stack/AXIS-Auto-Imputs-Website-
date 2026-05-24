import fs from "node:fs";
import path from "node:path";

const root = path.join(import.meta.dirname, "..");
const lines = fs
  .readFileSync(path.join(root, "src/components/legacy/AxisApp.jsx"), "utf-8")
  .split("\n");

let body = lines.slice(413, 2056).join("\n");

// Remove inlined AI responses (use lib)
body = body.replace(
  /\/\/ AI CHAT[\s\S]*?const getAIResponse[\s\S]*?\};\n\n/,
  ""
);

// Remove StatusTag, Stars, Divider, VehicleCard (separate files)
body = body.replace(/const StatusTag[\s\S]*?\/\/ ─+\n\/\/ SECTION 4/, "// SECTION 4");
body = body.replace(/const VehicleCard[\s\S]*?\/\/ ─+\n\/\/ SECTION 7/, "// SECTION 7");

const header = `"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Car, ChevronDown, ChevronRight, ChevronLeft, Search, X,
  MessageCircle, Phone, Mail, MapPin, Clock, Shield, Award,
  Fuel, Gauge, Settings, ArrowRight, Check,
  TrendingUp, BarChart2, Eye, Edit2, Trash2, Plus,
  Calculator, Globe, Truck, Package, FileText,
  LogIn, LogOut, Send, Bot, Layers, SlidersHorizontal, Menu, Heart, Share2
} from "lucide-react";
import { heroSlides, testimonials, faqs } from "@/data/site-content";
import { fmt, fmtGHS } from "@/lib/format";
import { calcClearance } from "@/lib/finance/clearance";
import { filterVehicles, sortVehicles } from "@/lib/vehicles/filters";
import { WA_BASE, waLink } from "@/lib/whatsapp";
import { getAIResponse } from "@/lib/ai/responses";
import { useVehicles } from "@/context/vehicles-context";
import { useAxisNav } from "@/hooks/use-axis-nav";
import { VehicleCard } from "@/components/axis/vehicle-card";
import { StatusTag, Stars, Divider } from "@/components/axis/ui";
import type { Vehicle } from "@/types/vehicle";

const PROCESS_STEPS = [
  { icon: Search, num: "01", title: "Browse & Select", desc: "Explore our curated Korean inventory online. Use smart filters to find your perfect vehicle by brand, budget, fuel type, and features." },
  { icon: MessageCircle, num: "02", title: "Request a Quote", desc: "Contact us via WhatsApp or our inquiry form. We provide a transparent breakdown of vehicle cost, shipping, and Ghana clearance fees." },
  { icon: FileText, num: "03", title: "Agreement & Payment", desc: "Sign a purchase agreement and make a deposit. We handle all Korean export documentation including de-registration and export certificate." },
  { icon: Truck, num: "04", title: "Shipping & Tracking", desc: "Your vehicle is loaded onto a RORO vessel at Incheon or Busan. We provide weekly tracking updates throughout the 30-40 day voyage." },
  { icon: Package, num: "05", title: "Arrival & Clearance", desc: "We coordinate with licensed Ghana Revenue Authority agents to handle all port clearance, duties, and customs documentation at Tema Port." },
];

const WHY_US = [
  { icon: Shield, title: "Korea-Direct Sourcing", desc: "We buy directly from Korean auction houses (HYUNDAI, KIA, GLOVIS) — no middlemen. Every vehicle has a verified Korean auction report and grade." },
  { icon: Award, title: "Auction Grade Certified", desc: "All vehicles come with official Korean auction grades (3–5). We only import grade 3.5 and above — your guarantee of quality." },
  { icon: Globe, title: "Full Import Support", desc: "From Korea to your driveway. We handle export, shipping, CEPS clearance, DVLA registration, and delivery anywhere in Ghana." },
  { icon: Calculator, title: "Transparent Pricing", desc: "Zero hidden charges. Our total-cost calculator shows you the exact landed cost including clearance, duties, and delivery before you commit." },
];

`;

body = body
  .replace(/^const /gm, "function ")
  .replace(/^function (Nav|AIChat|Hero|FeaturedVehicles|WhyUs|ImportProcessSection|Testimonials|FAQSection|CTABanner|Footer|HomePage|InventoryPage|VehicleDetailPage|ToolsPage|AboutPage|ContactPage|AdminPage)/gm, "export function $1")
  .replace(/\bVEHICLES\b/g, "vehicles")
  .replace(/\bHERO_SLIDES\b/g, "heroSlides")
  .replace(/\bTESTIMONIALS\b/g, "testimonials")
  .replace(/\bFAQS\b/g, "faqs")
  .replace(/setPage\(/g, "go(")
  .replace(/setSelectedVehicle\(v\);\s*go\("detail"\)/g, "goDetail(v)")
  .replace(/onClick=\{v=>\{setSelectedVehicle\(v\);go\("detail"\);\}\}/g, "onClick={goDetail}")
  .replace(
    /onClick=\{\(\)=>\{setSelectedVehicle\(v\);setImgIdx\(0\);window\.scrollTo\(\{top:0,behavior:"smooth"\}\);\}\}/g,
    "onClick={() => { goDetail(v); setImgIdx(0); }}"
  )
  .replace(/if \(!vehicle\) \{ go\("inventory"\); return null; \}/g,
    'if (!vehicle) { router.replace("/inventory"); return null; }');

// Nav rewrite
body = body.replace(
  /export function Nav\(\{page, setPage, scrolled\}\) \{/,
  `export function SiteNav() {
  const pathname = usePathname();
  const page = pathToPageKey(pathname);
  const { go } = useAxisNav();
  const [scrolled, setScrolled] = useState(false);
  const [mob, setMob] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    handler();
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
`
);

body = body.replace(
  'import { useRouter } from "next/navigation";',
  'import { useRouter, usePathname } from "next/navigation";\nimport { pathToPageKey } from "@/hooks/use-axis-nav";'
);

// Logo / links use Link
body = body.replace(
  /<motion>/g,
  ""
);

body = body
  .replace(/export function HomePage\(\{setPage, setSelectedVehicle\}\)/, "export function HomeView()")
  .replace(/export function InventoryPage\(\{setPage, setSelectedVehicle\}\)/, "export function InventoryView()")
  .replace(/export function VehicleDetailPage\(\{vehicle, setPage, setSelectedVehicle\}\)/, "export function VehicleDetailView({ vehicle }: { vehicle: Vehicle })")
  .replace(/export function AdminPage\(\{setPage\}\)/, "export function AdminView()")
  .replace(/export function Footer\(\{setPage\}\)/, "export function SiteFooter()")
  .replace(/export function Hero\(\{setPage\}\)/, "export function Hero()")
  .replace(/export function FeaturedVehicles\(\{setPage, setSelectedVehicle\}\)/, "export function FeaturedVehicles()")
  .replace(/export function ImportProcessSection\(\{setPage\}\)/, "export function ImportProcessSection()")
  .replace(/export function CTABanner\(\{setPage\}\)/, "export function CTABanner()");

// Inject hooks at start of views
for (const fn of ["InventoryView", "VehicleDetailView", "HomeView", "AdminView", "Hero", "FeaturedVehicles", "ImportProcessSection", "CTABanner", "SiteFooter"]) {
  body = body.replace(
    new RegExp(`(export function ${fn}\\([^)]*\\) \\{)`),
    `$1\n  const { vehicles } = useVehicles();\n  const { go, goDetail } = useAxisNav();\n  const router = useRouter();\n`
  );
}

body = body.replace(
  /export function AdminView\(\) \{\n  const \{ vehicles \} = useVehicles\(\);\n  const \{ go, goDetail \} = useAxisNav\(\);\n  const router = useRouter\(\);\n/,
  `export function AdminView() {
  const { vehicles, setVehicles, toggleVehicleStatus, deleteVehicle } = useVehicles();
  const { go } = useAxisNav();
`
);

// Admin uses local vehicles state in legacy - replace with context
body = body.replace(
  /const \[vehicles, setVehicles\] = useState\(vehicles\);/,
  "// vehicles from context"
);
body = body.replace(
  /setVehicles\(v=>v\.filter\(x=>x\.id!==id\)\)/g,
  "deleteVehicle(id)"
);
body = body.replace(
  /setVehicles\(v=>v\.map\(x=>x\.id===id\?/g,
  "toggleVehicleStatus(id); void (x=>x.id===id?"
);
// Fix toggle - legacy has toggleStatus function, admin uses setVehicles map
// Keep admin's toggleStatus but wire to context

body = body.replace(
  /const toggleStatus = \(id\) => \{\s*setVehicles\(v=>v\.map\(x=>x\.id===id\?\{\.\.\.x,status:[\s\S]*?\}\):x\)\);\s*\};/,
  "const toggleStatus = toggleVehicleStatus;"
);

body = body.replace(
  /setVehicles\(v=>v\.filter\(x=>x\.id!==id\)\)/g,
  "deleteVehicle(id)"
);

// HomeView children props
body = body
  .replace(/<Hero setPage=\{setPage\}\/>/g, "<Hero />")
  .replace(/<FeaturedVehicles setPage=\{setPage\} setSelectedVehicle=\{setSelectedVehicle\}\/>/g, "<FeaturedVehicles />")
  .replace(/<ImportProcessSection setPage=\{setPage\}\/>/g, "<ImportProcessSection />")
  .replace(/<CTABanner setPage=\{setPage\}\/>/g, "<CTABanner />");

// Add ImportProcessView at end
body += `

export function ImportProcessView() {
  const { go } = useAxisNav();
  return (
    <motion />
  );
}
`;

// Remove broken motion placeholder - copy from legacy App process case
const processPage = lines.slice(2094, 2129).join("\n")
  .replace(/case "process": return \(/, "")
  .replace(/\);\s*$/, "");

body = body.replace(
  /<motion \/>\s*\);\s*\}/,
  processPage + "\n  );\n}"
);

fs.mkdirSync(path.join(root, "src/components/axis"), { recursive: true });
fs.writeFileSync(path.join(root, "src/components/axis/views.tsx"), header + body);
console.log("Built views.tsx");
