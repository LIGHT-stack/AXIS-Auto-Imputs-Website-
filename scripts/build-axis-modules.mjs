import fs from "node:fs";
import path from "node:path";

const root = path.join(import.meta.dirname, "..");
let code = fs.readFileSync(
  path.join(root, "src/components/legacy/AxisApp.jsx"),
  "utf-8"
);

// Drop styles, data, utils, main App
code = code.replace(/^[\s\S]*?\/\/ SECTION 3 · REUSABLE UI\n/, "");
code = code.replace(
  /\/\/ ─+\n\/\/ SECTION 13 · MAIN APP[\s\S]*$/,
  ""
);

const header = `"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Car, ChevronDown, ChevronRight, ChevronLeft, Search, X,
  MessageCircle, Phone, Mail, MapPin, Clock, Shield, Award,
  Fuel, Gauge, Settings, ArrowRight, Star, Check,
  TrendingUp, BarChart2, Eye, Edit2, Trash2, Plus,
  Calculator, Globe, Truck, Package, FileText,
  LogIn, LogOut, Send, Bot, Layers, SlidersHorizontal, Menu, Heart, Share2
} from "lucide-react";
import {
  Search as SearchIcon,
  MessageCircle as MessageCircleIcon,
  FileText as FileTextIcon,
  Truck as TruckIcon,
  Package as PackageIcon,
  Shield as ShieldIcon,
  Award as AwardIcon,
  Globe as GlobeIcon,
  Calculator as CalculatorIcon,
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
  { icon: SearchIcon, num: "01", title: "Browse & Select", desc: "Explore our curated Korean inventory online. Use smart filters to find your perfect vehicle by brand, budget, fuel type, and features." },
  { icon: MessageCircleIcon, num: "02", title: "Request a Quote", desc: "Contact us via WhatsApp or our inquiry form. We provide a transparent breakdown of vehicle cost, shipping, and Ghana clearance fees." },
  { icon: FileTextIcon, num: "03", title: "Agreement & Payment", desc: "Sign a purchase agreement and make a deposit. We handle all Korean export documentation including de-registration and export certificate." },
  { icon: TruckIcon, num: "04", title: "Shipping & Tracking", desc: "Your vehicle is loaded onto a RORO vessel at Incheon or Busan. We provide weekly tracking updates throughout the 30-40 day voyage." },
  { icon: PackageIcon, num: "05", title: "Arrival & Clearance", desc: "We coordinate with licensed Ghana Revenue Authority agents to handle all port clearance, duties, and customs documentation at Tema Port." },
];

const WHY_US = [
  { icon: ShieldIcon, title: "Korea-Direct Sourcing", desc: "We buy directly from Korean auction houses (HYUNDAI, KIA, GLOVIS) — no middlemen. Every vehicle has a verified Korean auction report and grade." },
  { icon: AwardIcon, title: "Auction Grade Certified", desc: "All vehicles come with official Korean auction grades (3–5). We only import grade 3.5 and above — your guarantee of quality." },
  { icon: GlobeIcon, title: "Full Import Support", desc: "From Korea to your driveway. We handle export, shipping, CEPS clearance, DVLA registration, and delivery anywhere in Ghana." },
  { icon: CalculatorIcon, title: "Transparent Pricing", desc: "Zero hidden charges. Our total-cost calculator shows you the exact landed cost including clearance, duties, and delivery before you commit." },
];

`;

// Rename components to exports
code = code
  .replace(/^const (StatusTag|Stars|Divider|Nav|AIChat|VehicleCard|Hero|FeaturedVehicles|WhyUs|ImportProcessSection|Testimonials|FAQSection|CTABanner|Footer|HomePage|InventoryPage|VehicleDetailPage|ToolsPage|AboutPage|ContactPage|AdminPage) =/gm, "export function $1(")
  .replace(/export function StatusTag\(/, "/* moved to ui */ export function __StatusTag(")
  .replace(/export function Stars\(/, "/* moved */ export function __Stars(")
  .replace(/export function Divider\(/, "/* moved */ export function __Divider(")
  .replace(/export function VehicleCard\(/, "/* moved */ export function __VehicleCard(");

// Remove duplicate small components blocks (StatusTag through VehicleCard)
code = code.replace(/\/\* moved[\s\S]*?\/\/ SECTION 7 · HOME PAGE\n/, "// SECTION 7 · HOME PAGE\n");

code = code
  .replace(/\bVEHICLES\b/g, "vehicles")
  .replace(/\bHERO_SLIDES\b/g, "heroSlides")
  .replace(/\bTESTIMONIALS\b/g, "testimonials")
  .replace(/\bFAQS\b/g, "faqs")
  .replace(/setPage\("([^"]+)"\)/g, 'go("$1")')
  .replace(/setPage\('([^']+)'\)/g, "go('$1')")
  .replace(/setSelectedVehicle\(v\);\s*go\("detail"\)/g, "goDetail(v)")
  .replace(
    /onClick=\{v=>\{setSelectedVehicle\(v\);go\("detail"\);\}\}/g,
    "onClick={goDetail}"
  )
  .replace(
    /if \(!vehicle\) \{ go\("inventory"\); return null; \}/g,
    'if (!vehicle) { router.replace("/inventory"); return null; }'
  );

// Inject hooks into page components
const injectHooks = (name, extra = "") => {
  const re = new RegExp(`export function ${name}\\([^)]*\\) \\{`);
  code = code.replace(re, (m) => {
    return `${m}\n  const { vehicles, toggleVehicleStatus, deleteVehicle } = useVehicles();\n  const { go, goDetail } = useAxisNav();\n  const router = useRouter();\n${extra}`;
  });
};

injectHooks("InventoryPage");
injectHooks("VehicleDetailPage");
injectHooks("HomePage");
injectHooks("Hero");
injectHooks("FeaturedVehicles");
injectHooks("ImportProcessSection");
injectHooks("CTABanner");
injectHooks("Footer");
injectHooks("AdminPage", "  const { vehicles, setVehicles, toggleVehicleStatus, deleteVehicle } = useVehicles();\n  const { go } = useAxisNav();\n");

// Nav uses pathname
code = code.replace(
  /export function Nav\(\{page, setPage, scrolled\}\) \{/,
  `export function SiteNav() {
  const { page, go } = useAxisNav();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
`
);

// Remove AI_RESPONSES block
code = code.replace(/const AI_RESPONSES = \{[\s\S]*?const getAIResponse[\s\S]*?};\n\n/, "");

// AIChat - use getAIResponse import
code = code.replace(/const resp = getAIResponse\(txt\);/, "const resp = getAIResponse(txt);");

// HomePage - remove props
code = code.replace(
  /export function HomePage\(\{setPage, setSelectedVehicle\}\) \{/,
  "export function HomeView() {"
);
code = code.replace(
  /<Hero setPage=\{setPage\}\/>/g,
  "<Hero />"
);
code = code.replace(
  /<FeaturedVehicles setPage=\{setPage\} setSelectedVehicle=\{setSelectedVehicle\}\/>/g,
  "<FeaturedVehicles />"
);
code = code.replace(
  /<ImportProcessSection setPage=\{setPage\}\/>/g,
  "<ImportProcessSection />"
);
code = code.replace(
  /<CTABanner setPage=\{setPage\}\/>/g,
  "<CTABanner />"
);

// Rename exports for views
code = code.replace(/export function InventoryPage/, "export function InventoryView");
code = code.replace(/export function VehicleDetailPage/, "export function VehicleDetailView");
code = code.replace(/export function ToolsPage/, "export function ToolsView");
code = code.replace(/export function AboutPage/, "export function AboutView");
code = code.replace(/export function ContactPage/, "export function ContactView");
code = code.replace(/export function AdminPage/, "export function AdminView");
code = code.replace(/export function Footer/, "export function SiteFooter");

// VehicleDetailView takes vehicle prop
code = code.replace(
  /export function VehicleDetailView\(\{vehicle, setPage, setSelectedVehicle\}\)/,
  "export function VehicleDetailView({ vehicle }: { vehicle: Vehicle })"
);

// Process page export from inline in App - add ImportProcessView
const processBody = `export function ImportProcessView() {
  const { go } = useAxisNav();
  return (
    <motion-placeholder />
  );
}`;

fs.mkdirSync(path.join(root, "src/components/axis"), { recursive: true });
fs.writeFileSync(path.join(root, "src/components/axis/views.tsx"), header + code);
console.log("Wrote views.tsx", (header + code).length, "chars");
