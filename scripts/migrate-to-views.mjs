import fs from "node:fs";
import path from "node:path";

const root = path.join(import.meta.dirname, "..");
const lines = fs
  .readFileSync(path.join(root, "src/components/legacy/AxisApp.jsx"), "utf-8")
  .split("\n");

// Lines 440-2056: Nav through AdminPage (skip StatusTag-VehicleCard 414-720)
const part1 = lines.slice(439, 525).join("\n"); // Nav
const part2 = lines.slice(555, 636).join("\n"); // AIChat (skip AI_RESPONSES)
const part3 = lines.slice(725, 2056).join("\n"); // Hero through Admin

let body = [part1, part2, part3].join("\n\n");

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

function usePageNav() {
  const { vehicles } = useVehicles();
  const { go, goDetail } = useAxisNav();
  const router = useRouter();
  return { vehicles, go, goDetail, router };
}

`;

// Skip Nav - we have SiteNav
body = body.replace(/export function Nav[\s\S]*?\/\/ SECTION 5/, "// SECTION 5");

// Rename page exports
body = body
  .replace(/export function HomePage\(\{setPage, setSelectedVehicle\}\)/, "export function HomeView()")
  .replace(/export function InventoryPage\(\{setPage, setSelectedVehicle\}\)/, "export function InventoryView()")
  .replace(/export function VehicleDetailPage\(\{vehicle, setPage, setSelectedVehicle\}\)/, "export function VehicleDetailView({ vehicle }: { vehicle: Vehicle })")
  .replace(/export function AdminPage\(\{setPage\}\)/, "export function AdminView()")
  .replace(/export function Footer\(\{setPage\}\)/, "export function SiteFooter()")
  .replace(/export function Hero\(\{setPage\}\)/, "export function Hero()")
  .replace(/export function FeaturedVehicles\(\{setPage, setSelectedVehicle\}\)/, "export function FeaturedVehicles()")
  .replace(/export function ImportProcessSection\(\{setPage\}\)/, "export function ImportProcessSection()")
  .replace(/export function CTABanner\(\{setPage\}\)/, "export function CTABanner()")
  .replace(/export function ToolsPage\(\)/, "export function ToolsView()")
  .replace(/export function AboutPage\(\)/, "export function AboutView()")
  .replace(/export function ContactPage\(\)/, "export function ContactView()");

// Inject usePageNav
for (const name of [
  "HomeView", "InventoryView", "VehicleDetailView", "AdminView",
  "Hero", "FeaturedVehicles", "ImportProcessSection", "CTABanner", "SiteFooter", "ToolsView",
]) {
  body = body.replace(
    new RegExp(`(export function ${name}\\([^)]*\\) \\{)`),
    "$1\n  const { vehicles, go, goDetail, router } = usePageNav();\n"
  );
}

body = body.replace(
  /export function AdminView\(\) \{\n  const \{ vehicles, go, goDetail, router \} = usePageNav\(\);\n/,
  "export function AdminView() {\n  const { vehicles, go, router } = usePageNav();\n  const { setVehicles, toggleVehicleStatus, deleteVehicle } = useVehicles();\n"
);

body = body.replace(
  /const \[vehicles, setVehicles\] = useState\(vehicles\);/,
  ""
);
body = body.replace(
  /const toggleStatus = \(id\) => \{\s*setVehicles\(v=>v\.map\(x=>x\.id===id\?\{\.\.\.x,status:x\.status==="Available"\?"Reserved":x\.status==="Reserved"\?"Sold":"Available"\}:x\)\);\s*\};/,
  "const toggleStatus = toggleVehicleStatus;"
);
body = body.replace(
  /setVehicles\(v=>v\.filter\(x=>x\.id!==id\)\)/g,
  "deleteVehicle(id)"
);

body = body
  .replace(/<Hero setPage=\{setPage\}\/>/g, "<Hero />")
  .replace(/<FeaturedVehicles setPage=\{setPage\} setSelectedVehicle=\{setSelectedVehicle\}\/>/g, "<FeaturedVehicles />")
  .replace(/<ImportProcessSection setPage=\{setPage\}\/>/g, "<ImportProcessSection />")
  .replace(/<CTABanner setPage=\{setPage\}\/>/g, "<CTABanner />");

// Import process page from App switch
const processView = lines.slice(2095, 2128).join("\n");

body += `

export function ImportProcessView() {
  const { go } = useAxisNav();
  return (
${processView}
  );
}

export function AIChatWidget({ onClose, vehicle }: { onClose: () => void; vehicle?: Vehicle | null }) {
  return <AIChat onClose={onClose} vehicle={vehicle} />;
}
`;

// Rename AIChat to accept vehicle prop - already does

fs.mkdirSync(path.join(root, "src/components/axis"), { recursive: true });
fs.writeFileSync(path.join(root, "src/components/axis/views.tsx"), header + body);
console.log("Wrote views.tsx");
