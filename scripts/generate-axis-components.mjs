/**
 * Splits legacy AxisApp.jsx into structured TSX modules.
 * Run: node scripts/generate-axis-components.mjs
 */
import fs from "node:fs";
import path from "node:path";

const root = path.join(import.meta.dirname, "..");
const src = fs.readFileSync(
  path.join(root, "src/components/legacy/AxisApp.jsx"),
  "utf-8"
);

const outDir = path.join(root, "src/components/axis");
fs.mkdirSync(outDir, { recursive: true });

function slice(startMarker, endMarker) {
  const start = src.indexOf(startMarker);
  const end = endMarker ? src.indexOf(endMarker, start + 1) : src.length;
  if (start === -1) throw new Error(`Missing ${startMarker}`);
  return src.slice(start, end === -1 ? src.length : end).trim();
}

function bodyOf(constName) {
  const re = new RegExp(
    `const ${constName} = \\([^)]*\\) => \\{`,
    "s"
  );
  const m = src.match(re);
  if (!m) throw new Error(`Component ${constName} not found`);
  const start = m.index + m[0].length;
  let depth = 1;
  let i = start;
  while (i < src.length && depth > 0) {
    if (src[i] === "{") depth++;
    if (src[i] === "}") depth--;
    i++;
  }
  return src.slice(start, i - 1).trim();
}

function transform(code) {
  return code
    .replace(/\bVEHICLES\b/g, "vehicles")
    .replace(/setPage\("([^"]+)"\)/g, 'go("$1")')
    .replace(/setPage\('([^']+)'\)/g, "go('$1')")
    .replace(
      /setSelectedVehicle\(v\);\s*setPage\("detail"\)/g,
      "goDetail(v)"
    )
    .replace(
      /onClick=\{v=>\{setSelectedVehicle\(v\);setPage\("detail"\);\}\}/g,
      "onClick={goDetail}"
    )
    .replace(
      /onClick=\{\(\)=>\{setSelectedVehicle\(v\);setImgIdx\(0\);window\.scrollTo\(\{top:0,behavior:"smooth"\}\);\}\}/g,
      'onClick={() => { goDetail(v); setImgIdx(0); }}'
    )
    .replace(/if \(!vehicle\) \{ setPage\("inventory"\); return null; \}/g,
      'if (!vehicle) { router.replace("/inventory"); return null; }'
    )
    .replace(/onClick=\{\(\)=>setPage\("home"\)\}/g, 'onClick={() => go("home")}')
    .replace(/onClick=\{\(\)=>setPage\("inventory"\)\}/g, 'onClick={() => go("inventory")}');
}

const clientHeader = `"use client";\n\n`;

const sharedImports = `import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Car, ChevronDown, ChevronRight, ChevronLeft, Search, Filter, X,
  MessageCircle, Phone, Mail, MapPin, Clock, Shield, Award,
  Fuel, Gauge, Settings, Users, Zap, ArrowRight, Star, Check,
  TrendingUp, BarChart2, Eye, Edit2, Trash2, Plus, Upload,
  Calculator, Globe, RefreshCw, Menu, Heart, Share2, Info,
  Truck, Package, FileText, Bell, LogIn, LogOut, AlertCircle,
  Send, Bot, ChevronUp, Layers, SlidersHorizontal
} from "lucide-react";
import { fmt, fmtGHS } from "@/lib/format";
import { calcClearance } from "@/lib/finance/clearance";
import { filterVehicles, sortVehicles } from "@/lib/vehicles/filters";
import { WA_BASE, waLink } from "@/lib/whatsapp";
import { useVehicles } from "@/context/vehicles-context";
import { useAxisNav } from "@/hooks/use-axis-nav";
`;

const uiImports = `import { Star } from "lucide-react";
`;

// UI primitives
const statusTag = bodyOf("StatusTag");
const stars = bodyOf("Stars");
const divider = bodyOf("Divider");

fs.writeFileSync(
  path.join(outDir, "ui.tsx"),
  `${clientHeader}${uiImports}
export function StatusTag({ s }: { s: string }) {
${transform(statusTag)}
}

export function Stars({ n }: { n: number }) {
${transform(stars)}
}

export function Divider({ color }: { color?: string }) {
${transform(divider)}
}
`
);

// Vehicle card
const vehicleCard = bodyOf("VehicleCard");
fs.writeFileSync(
  path.join(outDir, "vehicle-card.tsx"),
  `${clientHeader}${sharedImports}
import { StatusTag, Divider } from "@/components/axis/ui";
import type { Vehicle } from "@/types/vehicle";

export function VehicleCard({
  v,
  onClick,
  saved,
  onToggleSave,
}: {
  v: Vehicle;
  onClick: (v: Vehicle) => void;
  saved?: boolean;
  onToggleSave?: (id: number) => void;
}) {
${transform(vehicleCard)}
}
`
);

console.log("Generated ui.tsx, vehicle-card.tsx");
console.log("Run manual step for remaining page modules or extend this script.");
