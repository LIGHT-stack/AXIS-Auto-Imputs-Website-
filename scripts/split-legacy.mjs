import fs from "node:fs";
import path from "node:path";

const root = path.join(import.meta.dirname, "..");
const lines = fs
  .readFileSync(path.join(root, "src/components/legacy/AxisApp.jsx"), "utf-8")
  .split("\n");

function range(start, end) {
  return lines.slice(start - 1, end).join("\n");
}

function write(name, content, header = "") {
  const dir = path.join(root, "src/components/axis");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, name), header + content + "\n");
}

const transform = (s) =>
  s
    .replace(/\bVEHICLES\b/g, "vehicles")
    .replace(/setPage\("([^"]+)"\)/g, 'go("$1")')
    .replace(/setPage\('([^']+)'\)/g, "go('$1')")
    .replace(/setSelectedVehicle\(v\);\s*go\("detail"\)/g, "goDetail(v)")
    .replace(
      /onClick=\{v=>\{setSelectedVehicle\(v\);go\("detail"\);\}\}/g,
      "onClick={goDetail}"
    )
    .replace(
      /onClick=\{\(\)=>\{setSelectedVehicle\(v\);setImgIdx\(0\);window\.scrollTo\(\{top:0,behavior:"smooth"\}\);\}\}/g,
      "onClick={() => { goDetail(v); setImgIdx(0); }}"
    )
    .replace(
      /if \(!vehicle\) \{ go\("inventory"\); return null; \}/g,
      'if (!vehicle) { router.replace("/inventory"); return null; }'
    );

const client = `"use client";\n\n`;
const icons = `import {
  Car, ChevronDown, ChevronRight, ChevronLeft, Search, X,
  MessageCircle, Phone, Mail, MapPin, Clock, Shield, Award,
  Fuel, Gauge, Settings, ArrowRight, Star, Check,
  TrendingUp, BarChart2, Eye, Edit2, Trash2, Plus,
  Calculator, Globe, Truck, Package, FileText,
  LogIn, LogOut, Send, Bot, Layers, SlidersHorizontal, Menu, Heart, Share2
} from "lucide-react";\n`;
const core = `import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { fmt, fmtGHS } from "@/lib/format";
import { calcClearance } from "@/lib/finance/clearance";
import { filterVehicles, sortVehicles } from "@/lib/vehicles/filters";
import { WA_BASE, waLink } from "@/lib/whatsapp";
import { useVehicles } from "@/context/vehicles-context";
import { useAxisNav } from "@/hooks/use-axis-nav";
`;

// UI 414-434
write(
  "ui.tsx",
  transform(range(414, 434)),
  `${client}import { Star } from "lucide-react";

export function StatusTag({ s }: { s: string }) {
  ${transform(range(415, 417)).replace(/^  /gm, "")}
}

export function Stars({ n }: { n: number }) {
  return (
${range(421, 425)}
  );
}

export function Divider({ color }: { color?: string }) {
  return (
${range(429, 433)}
  );
}
`
);

console.log("split-legacy: partial - building full modules next");
