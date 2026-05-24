"use client";

/**
 * AXIS AUTO IMPORTS — Premium Korean Car Import Platform
 * -------------------------------------------------------
 * Phase 6 – Documentation
 * Stack  : React 18, Lucide-React icons, inline CSS-in-JS
 * Design : Luxury dark (obsidian + champagne gold), Cormorant serif + DM Sans
 * Data   : In-memory (no backend); all state via React hooks
 * Tests  : See TESTSPEC comments throughout for mutation-test assertions
 *
 * Phase 7 – Adversarial notes addressed:
 *  - filterVehicles always returns Array (never undefined)
 *  - calcClearance guards against NaN with || 0
 *  - Hero slideIndex bounded by modulo
 *  - AI chat rejects empty/whitespace input
 *  - Admin delete guarded with confirmation flag state
 *  - Currency rate validated >= 1 before dividing
 */

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Car, ChevronDown, ChevronRight, ChevronLeft, Search, Filter, X,
  MessageCircle, Phone, Mail, MapPin, Clock, Shield, Award,
  Fuel, Gauge, Settings, Users, Zap, ArrowRight, Star, Check,
  TrendingUp, BarChart2, Eye, Edit2, Trash2, Plus, Upload,
  Calculator, Globe, RefreshCw, Menu, Heart, Share2, Info,
  Truck, Package, FileText, Bell, LogIn, LogOut, AlertCircle,
  Send, Bot, ChevronUp, Layers, SlidersHorizontal
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// SECTION 1 · GLOBAL STYLES
// ─────────────────────────────────────────────────────────────
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth;font-size:16px}
    :root{
      --gold:#C9A84C;--gold-l:#E8C86A;--gold-xl:#F5DFA0;
      --gold-bg:rgba(201,168,76,0.08);--gold-bd:rgba(201,168,76,0.22);
      --blk:#070707;--surf:#0C0C0C;--card:#111;--card2:#181818;
      --wht:#F0EDE5;--muted:#888;--muted2:#444;
      --bd:rgba(255,255,255,0.07);--bd2:rgba(255,255,255,0.12);
      --green:#22c55e;--red:#ef4444;--amber:#f59e0b;
      --wa:#25D366;
    }
    body{background:var(--blk);color:var(--wht);font-family:'DM Sans',sans-serif;line-height:1.6;overflow-x:hidden}
    h1,h2,h3,h4,h5{font-family:'Cormorant Garamond',serif;font-weight:600;letter-spacing:-0.01em;line-height:1.15}
    button{cursor:pointer;font-family:'DM Sans',sans-serif}
    input,select,textarea{font-family:'DM Sans',sans-serif;background:var(--card2);border:1px solid var(--bd2);color:var(--wht);outline:none;transition:border-color .2s}
    input:focus,select:focus,textarea:focus{border-color:var(--gold-bd)}
    input::placeholder,textarea::placeholder{color:var(--muted)}
    select option{background:var(--card)}
    a{color:inherit;text-decoration:none}
    ::-webkit-scrollbar{width:4px;height:4px}
    ::-webkit-scrollbar-track{background:var(--blk)}
    ::-webkit-scrollbar-thumb{background:var(--muted2);border-radius:4px}

    /* ── Buttons ── */
    .btn{display:inline-flex;align-items:center;gap:8px;padding:11px 24px;border-radius:3px;font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;transition:all .25s;border:none}
    .btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold-l));color:#060606}
    .btn-gold:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(201,168,76,.35)}
    .btn-ghost{background:transparent;border:1px solid var(--bd2);color:var(--wht)}
    .btn-ghost:hover{border-color:var(--gold-bd);color:var(--gold)}
    .btn-wa{background:var(--wa);color:#fff}
    .btn-wa:hover{background:#1ab755;transform:translateY(-1px)}
    .btn-sm{padding:8px 16px;font-size:11px}
    .btn-icon{padding:10px;border-radius:3px;background:var(--card2);border:1px solid var(--bd);color:var(--muted)}
    .btn-icon:hover{border-color:var(--gold-bd);color:var(--gold)}

    /* ── Tags / badges ── */
    .tag{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:2px;font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase}
    .tag-avail{background:rgba(34,197,94,.12);color:var(--green);border:1px solid rgba(34,197,94,.25)}
    .tag-reserved{background:rgba(245,158,11,.12);color:var(--amber);border:1px solid rgba(245,158,11,.25)}
    .tag-sold{background:rgba(239,68,68,.12);color:var(--red);border:1px solid rgba(239,68,68,.25)}
    .tag-gold{background:var(--gold-bg);color:var(--gold);border:1px solid var(--gold-bd)}
    .tag-new{background:rgba(59,130,246,.12);color:#60a5fa;border:1px solid rgba(59,130,246,.25)}

    /* ── Cards ── */
    .glass{background:rgba(255,255,255,.035);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid var(--bd)}
    .v-card{background:var(--card);border:1px solid var(--bd);border-radius:6px;overflow:hidden;transition:all .32s cubic-bezier(.4,0,.2,1);cursor:pointer}
    .v-card:hover{border-color:var(--gold-bd);transform:translateY(-5px);box-shadow:0 24px 48px rgba(0,0,0,.7)}

    /* ── Gold accents ── */
    .gold-text{color:var(--gold)}
    .gold-grad{background:linear-gradient(135deg,var(--gold),var(--gold-l));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .gold-line{width:48px;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent)}
    .gold-line-l{width:80px;height:1px;background:linear-gradient(90deg,var(--gold),transparent)}

    /* ── Section helpers ── */
    .section{padding:100px 0}
    .section-sm{padding:60px 0}
    .container{max-width:1280px;margin:0 auto;padding:0 24px}
    .label{font-size:11px;font-weight:600;letter-spacing:.15em;text-transform:uppercase;color:var(--gold)}

    /* ── Animations ── */
    @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes slideRight{from{transform:translateX(-24px);opacity:0}to{transform:translateX(0);opacity:1}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
    @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
    @keyframes chatIn{from{transform:translateY(12px);opacity:0}to{transform:translateY(0);opacity:1}}
    .anim-up{animation:fadeUp .6s ease forwards}
    .anim-in{animation:fadeIn .5s ease forwards}
    .anim-right{animation:slideRight .5s ease forwards}

    /* ── Hero ── */
    .hero-slide{position:absolute;inset:0;background-size:cover;background-position:center;transition:opacity 1.4s ease}
    .hero-overlay{position:absolute;inset:0;background:linear-gradient(105deg,rgba(7,7,7,.88) 0%,rgba(7,7,7,.55) 55%,rgba(7,7,7,.2) 100%)}

    /* ── Nav ── */
    .nav{position:fixed;top:0;left:0;right:0;z-index:999;transition:background .3s,border-color .3s}
    .nav-scrolled{background:rgba(7,7,7,.96);backdrop-filter:blur(20px);border-bottom:1px solid var(--bd)}
    .nav-top{background:transparent;border-bottom:1px solid transparent}

    /* ── FAQ ── */
    .faq-item{border-bottom:1px solid var(--bd)}
    .faq-answer{overflow:hidden;transition:max-height .35s ease,opacity .3s ease}

    /* ── Admin table ── */
    .tbl{width:100%;border-collapse:collapse}
    .tbl th{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);font-weight:500;padding:12px 16px;border-bottom:1px solid var(--bd);text-align:left}
    .tbl td{padding:14px 16px;border-bottom:1px solid var(--bd);font-size:14px;vertical-align:middle}
    .tbl tr:hover td{background:rgba(255,255,255,.025)}

    /* ── Chat ── */
    .chat-bubble-user{background:var(--gold-bg);border:1px solid var(--gold-bd);border-radius:12px 12px 3px 12px;padding:10px 14px;font-size:14px;max-width:78%;align-self:flex-end}
    .chat-bubble-bot{background:var(--card2);border:1px solid var(--bd2);border-radius:12px 12px 12px 3px;padding:10px 14px;font-size:14px;max-width:82%;align-self:flex-start}

    /* ── Process steps ── */
    .step-line{width:2px;background:linear-gradient(to bottom,var(--gold),transparent);flex-shrink:0}

    /* ── Spec rows ── */
    .spec-row{display:flex;justify-content:space-between;align-items:center;padding:11px 0;border-bottom:1px solid var(--bd)}
    .spec-row:last-child{border-bottom:none}

    /* ── Range slider ── */
    input[type=range]{-webkit-appearance:none;height:3px;background:var(--bd2);border:none;border-radius:2px;padding:0}
    input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:var(--gold);cursor:pointer;border:2px solid var(--blk)}

    /* ── Stat cards ── */
    .stat-card{background:var(--card2);border:1px solid var(--bd);border-radius:6px;padding:20px 24px}

    /* ── Mobile ── */
    @media(max-width:768px){
      .section{padding:64px 0}
      .hide-mobile{display:none!important}
      .mobile-col{flex-direction:column!important}
      .hero-title{font-size:clamp(2.4rem,8vw,4rem)!important}
    }
    @media(max-width:480px){
      .container{padding:0 16px}
      .btn{padding:10px 18px;font-size:11px}
    }
  `}</style>
);

// ─────────────────────────────────────────────────────────────
// SECTION 2 · DATA LAYER
// ─────────────────────────────────────────────────────────────

// TESTSPEC: filterVehicles(VEHICLES, {}) === VEHICLES (no filter = all)
// TESTSPEC: filterVehicles(VEHICLES, {brand:'Kia'}).every(v => v.brand==='Kia')
const VEHICLES = [
  {
    id:1, brand:"Kia", model:"Sportage AWD", year:2018, trim:"GT-Line",
    mileage:62400, fuelType:"Gasoline", transmission:"Automatic (6-speed)",
    drivetrain:"AWD", category:"SUV", price:14500, status:"Available",
    engineCC:2000, horsepower:185, torque:"241 Nm", fuelEconomy:"12.4L/100km",
    seats:5, color:"Platinum Silver", doors:5,
    features:["Sunroof","Heated Seats","Apple CarPlay","Blind Spot Monitor","Lane Assist","LED Headlights","Wireless Charging","Panoramic Camera"],
    auctionGrade:"4",
    description:"A sporty, well-maintained Korean-market Kia Sportage in pristine condition. Full service history, accident-free, exported directly from Hyundai Motor Group dealer network in Seoul.",
    img:"https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80",
    imgs:[
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
    ],
    views:412, inquiries:18,
  },
  {
    id:2, brand:"Hyundai", model:"Tucson", year:2017, trim:"Smart",
    mileage:74800, fuelType:"Diesel", transmission:"Automatic (6-speed)",
    drivetrain:"FWD", category:"SUV", price:11800, status:"Available",
    engineCC:1995, horsepower:136, torque:"320 Nm", fuelEconomy:"6.8L/100km",
    seats:5, color:"Titanium Silver", doors:5,
    features:["Navigation","Reverse Camera","Heated Seats","Keyless Entry","Cruise Control","LED DRL","Automatic Climate"],
    auctionGrade:"3.5",
    description:"Fuel-efficient diesel Tucson ideal for Ghana's intercity routes. Low maintenance, strong resale value, full Korean service records.",
    img:"https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80",
    imgs:[
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1200&q=80",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&q=80",
    ],
    views:289, inquiries:11,
  },
  {
    id:3, brand:"Kia", model:"Seltos", year:2022, trim:"Noblesse",
    mileage:18300, fuelType:"Gasoline", transmission:"Automatic (7-speed DCT)",
    drivetrain:"FWD", category:"SUV", price:19900, status:"Reserved",
    engineCC:1598, horsepower:195, torque:"265 Nm", fuelEconomy:"9.2L/100km",
    seats:5, color:"Gravity Blue", doors:5,
    features:["10.25\" Touchscreen","Bose Sound","360 Camera","ADAS Pack","HUD","Wireless Charging","Ambient Lighting","Sunroof","Memory Seats"],
    auctionGrade:"4.5",
    description:"Near-new 2022 Seltos with premium Noblesse trim and full ADAS safety suite. Low-mileage single-owner from Seoul, still under Korean manufacturer warranty.",
    img:"https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80",
    imgs:[
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1200&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80",
    ],
    views:731, inquiries:34,
  },
  {
    id:4, brand:"Hyundai", model:"Accent", year:2017, trim:"Style",
    mileage:89200, fuelType:"Gasoline", transmission:"Automatic (6-speed)",
    drivetrain:"FWD", category:"Sedan", price:7200, status:"Available",
    engineCC:1591, horsepower:123, torque:"155 Nm", fuelEconomy:"10.5L/100km",
    seats:5, color:"Polar White", doors:4,
    features:["Reverse Camera","Bluetooth","Heated Seats","Keyless Entry","Cruise Control","ABS+EBD"],
    auctionGrade:"3",
    description:"Affordable entry-level sedan with excellent fuel economy. Perfect for city driving in Accra. Very clean interior, no accidents recorded.",
    img:"https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80",
    imgs:[
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1200&q=80",
    ],
    views:155, inquiries:7,
  },
  {
    id:5, brand:"Samsung", model:"SM5 Nova", year:2018, trim:"Premium",
    mileage:55700, fuelType:"LPG / Gasoline", transmission:"Automatic (CVT)",
    drivetrain:"FWD", category:"Sedan", price:9400, status:"Available",
    engineCC:1999, horsepower:140, torque:"192 Nm", fuelEconomy:"9.8L/100km",
    seats:5, color:"Midnight Black", doors:4,
    features:["Full Leather","Navigation","Smart Key","Automatic Wipers","Rain Sensor","Heated/Ventilated Seats","Infinity Audio"],
    auctionGrade:"4",
    description:"Renault-Samsung SM5 Nova — Korea's premium executive sedan. LPG-capable engine dramatically reduces running costs. Luxurious cabin with full leather trim.",
    img:"https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
    imgs:[
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&q=80",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80",
    ],
    views:203, inquiries:9,
  },
  {
    id:6, brand:"Land Rover", model:"Range Rover Evoque", year:2017, trim:"SE",
    mileage:47900, fuelType:"Diesel", transmission:"Automatic (9-speed)",
    drivetrain:"AWD", category:"Luxury SUV", price:24500, status:"Available",
    engineCC:1999, horsepower:150, torque:"380 Nm", fuelEconomy:"7.2L/100km",
    seats:5, color:"Yulong White", doors:5,
    features:["Panoramic Roof","Meridian Sound","InControl Touch Pro","Terrain Response","Heated Steering","Air Suspension","360 Surround Camera","LED Matrix Lights"],
    auctionGrade:"4",
    description:"Iconic Range Rover Evoque from the Korean CBU market. Exceptional build quality with full Land Rover Korea service history. Terrain Response system ideal for Ghana's varied road conditions.",
    img:"https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&q=80",
    imgs:[
      "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=1200&q=80",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&q=80",
    ],
    views:556, inquiries:27,
  },
  {
    id:7, brand:"Toyota", model:"RAV4 Hybrid", year:2020, trim:"Style",
    mileage:39800, fuelType:"Hybrid", transmission:"e-CVT",
    drivetrain:"AWD-i", category:"SUV", price:21500, status:"Available",
    engineCC:2487, horsepower:218, torque:"163 Nm + Motor", fuelEconomy:"6.0L/100km",
    seats:5, color:"Pearl Crystal White", doors:5,
    features:["Toyota Safety Sense","JBL Audio","Wireless Charging","Sunroof","Digital Cluster","Lane Tracing","Pre-Collision System","Adaptive Cruise"],
    auctionGrade:"4.5",
    description:"Toyota's legendary RAV4 in hybrid configuration for exceptional fuel economy. Imported from Toyota Korea's certified used vehicle program.",
    img:"https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80",
    imgs:["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1200&q=80"],
    views:388, inquiries:20,
  },
  {
    id:8, brand:"BMW", model:"520d", year:2019, trim:"M Sport",
    mileage:44200, fuelType:"Diesel", transmission:"Automatic (8-speed)",
    drivetrain:"RWD", category:"Sedan", price:29900, status:"Available",
    engineCC:1995, horsepower:190, torque:"400 Nm", fuelEconomy:"5.4L/100km",
    seats:5, color:"Carbon Black", doors:4,
    features:["M Sport Package","Harman Kardon","iDrive 7","Head-Up Display","Heated Seats","Gesture Control","Active Cruise","Park Assist","M Aerodynamics"],
    auctionGrade:"4",
    description:"The ultimate business sedan. BMW 5 Series M Sport in striking Carbon Black. Korea-spec with full BMW Korea service history and OBC certified report.",
    img:"https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
    imgs:[
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
    ],
    views:621, inquiries:31,
  },
];

const HERO_SLIDES = [
  {
    bg:"https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=1600&q=80",
    tag:"New Arrival", title:"Precision\nEngineered.", sub:"2022 Kia Seltos Noblesse", price:"$19,900",
    color:"#C9A84C",
  },
  {
    bg:"https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1600&q=80",
    tag:"Featured", title:"The Art\nof Driving.", sub:"2019 BMW 520d M Sport", price:"$29,900",
    color:"#E8C86A",
  },
  {
    bg:"https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=1600&q=80",
    tag:"Prestige", title:"Command\nEvery Road.", sub:"2017 Range Rover Evoque SE", price:"$24,500",
    color:"#C9A84C",
  },
];

const TESTIMONIALS = [
  {
    name:"Emmanuel Asante", role:"Business Owner, Accra",
    text:"AXIS made importing my Kia Sportage seamless. End-to-end communication was excellent and the car arrived in perfect condition. Highly recommend!",
    rating:5, vehicle:"2018 Kia Sportage AWD", initials:"EA",
  },
  {
    name:"Abena Mensah", role:"Corporate Executive, Kumasi",
    text:"The clearance cost calculator was spot-on — no surprises at the port. The BMW is flawless. AXIS is the real deal for premium imports.",
    rating:5, vehicle:"2019 BMW 520d M Sport", initials:"AM",
  },
  {
    name:"Kwame Osei", role:"Doctor, Takoradi",
    text:"From WhatsApp inquiry to keys in hand in 6 weeks. The team guided me through every step of the import process. My Hyundai Tucson is perfection.",
    rating:5, vehicle:"2017 Hyundai Tucson Diesel", initials:"KO",
  },
];

const PROCESS_STEPS = [
  {icon:Search, num:"01", title:"Browse & Select", desc:"Explore our curated Korean inventory online. Use smart filters to find your perfect vehicle by brand, budget, fuel type, and features."},
  {icon:MessageCircle, num:"02", title:"Request a Quote", desc:"Contact us via WhatsApp or our inquiry form. We provide a transparent breakdown of vehicle cost, shipping, and Ghana clearance fees."},
  {icon:FileText, num:"03", title:"Agreement & Payment", desc:"Sign a purchase agreement and make a deposit. We handle all Korean export documentation including de-registration and export certificate."},
  {icon:Truck, num:"04", title:"Shipping & Tracking", desc:"Your vehicle is loaded onto a RORO vessel at Incheon or Busan. We provide weekly tracking updates throughout the 30-40 day voyage."},
  {icon:Package, num:"05", title:"Arrival & Clearance", desc:"We coordinate with licensed Ghana Revenue Authority agents to handle all port clearance, duties, and customs documentation at Tema Port."},
];

const WHY_US = [
  {icon:Shield, title:"Korea-Direct Sourcing", desc:"We buy directly from Korean auction houses (HYUNDAI, KIA, GLOVIS) — no middlemen. Every vehicle has a verified Korean auction report and grade."},
  {icon:Award, title:"Auction Grade Certified", desc:"All vehicles come with official Korean auction grades (3–5). We only import grade 3.5 and above — your guarantee of quality."},
  {icon:Globe, title:"Full Import Support", desc:"From Korea to your driveway. We handle export, shipping, CEPS clearance, DVLA registration, and delivery anywhere in Ghana."},
  {icon:Calculator, title:"Transparent Pricing", desc:"Zero hidden charges. Our total-cost calculator shows you the exact landed cost including clearance, duties, and delivery before you commit."},
];

const FAQS = [
  {q:"How long does the import process take?", a:"From payment confirmation to delivery in Ghana, the typical timeline is 6–8 weeks: 2 weeks for Korean export processing, 35–40 days sea transit, and 5–7 days for Tema port clearance."},
  {q:"What documents do I receive with my vehicle?", a:"You receive the original Korean title deed (deregistration certificate), auction grade report, Bill of Lading, CEPS clearance documents, and full DVLA registration papers."},
  {q:"How are clearance/customs duties calculated?", a:"Ghana's import duty on vehicles is typically 20% of CIF value (Vehicle + Insurance + Freight), plus 12.5% VAT and a small ECOWAS levy. Our clearance estimator tool gives you an accurate breakdown."},
  {q:"Can I finance the vehicle purchase?", a:"Yes — we partner with selected Ghanaian banks and microfinance institutions offering import finance. Contact us to discuss available options based on your down-payment and income."},
  {q:"What is a Korean auction grade?", a:"The Korean Vehicle Inspection (KIA/Hyundai auction) grades vehicles on interior and exterior condition from 1–6, with 6 being perfect new-car condition. We only import Grade 3+ vehicles."},
  {q:"Do you offer a warranty?", a:"We offer a 30-day post-clearance mechanical warranty on all vehicles. Extended warranties through partner workshops in Accra are available for purchase."},
];

// TESTSPEC: usd(14500) === '$14,500' (number formatting)
const fmt = n => `$${(n||0).toLocaleString()}`;
const fmtGHS = n => `GH₵ ${(n||0).toLocaleString()}`;

// TESTSPEC: calcClearance(14500,'SUV',0) >= 5000 (reasonable floor)
// TESTSPEC: calcClearance(NaN,...) returns object with all numeric fields
const calcClearance = (priceUSD, cat, freight=0) => {
  const price = Math.max(Number(priceUSD)||0, 0);
  const fr = Math.max(Number(freight)||1200, 0);
  const cif = price + fr + Math.round(price * 0.005); // insurance ~0.5%
  const levy = cat==="Luxury SUV" ? 0.35 : cat==="Sedan" ? 0.20 : 0.25; // simplified Levy %
  const duty = Math.round(cif * levy);
  const vat = Math.round((cif + duty) * 0.125);
  const ecowas = Math.round(cif * 0.005);
  const examinFees = 450;
  const total = duty + vat + ecowas + examinFees;
  return {cif, duty, vat, ecowas, examinFees, total};
};

// TESTSPEC: filterVehicles(arr, {}) returns arr
// TESTSPEC: filterVehicles(arr, {maxPrice:5000}) returns [] when all > 5000
const filterVehicles = (vehicles, filters) => {
  if (!Array.isArray(vehicles)) return [];
  return vehicles.filter(v => {
    if (filters.brand && filters.brand!=="All" && v.brand!==filters.brand) return false;
    if (filters.category && filters.category!=="All" && v.category!==filters.category) return false;
    if (filters.fuel && filters.fuel!=="All" && v.fuelType!==filters.fuel) return false;
    if (filters.transmission && filters.transmission!=="All" && !v.transmission.includes(filters.transmission)) return false;
    if (filters.drivetrain && filters.drivetrain!=="All" && v.drivetrain!==filters.drivetrain) return false;
    if (filters.status && filters.status!=="All" && v.status!==filters.status) return false;
    if (filters.minYear && v.year < +filters.minYear) return false;
    if (filters.maxYear && v.year > +filters.maxYear) return false;
    if (filters.maxPrice && v.price > +filters.maxPrice) return false;
    if (filters.minPrice && v.price < +filters.minPrice) return false;
    if (filters.maxMileage && v.mileage > +filters.maxMileage) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!`${v.brand} ${v.model} ${v.year} ${v.trim}`.toLowerCase().includes(q)) return false;
    }
    return true;
  });
};

const sortVehicles = (vehicles, sort) => {
  const v = [...vehicles];
  if (sort==="cheapest") return v.sort((a,b)=>a.price-b.price);
  if (sort==="expensive") return v.sort((a,b)=>b.price-a.price);
  if (sort==="mileage") return v.sort((a,b)=>a.mileage-b.mileage);
  if (sort==="oldest") return v.sort((a,b)=>a.year-b.year);
  return v.sort((a,b)=>b.year-a.year); // newest default
};

const WA_BASE = "https://wa.me/233244265976";
const waLink = (vehicle) =>
  `${WA_BASE}?text=${encodeURIComponent(`Hi AXIS Auto Imports! I'm interested in the ${vehicle.year} ${vehicle.brand} ${vehicle.model} (${fmt(vehicle.price)}). Please send more details.`)}`;

// ─────────────────────────────────────────────────────────────
// SECTION 3 · REUSABLE UI
// ─────────────────────────────────────────────────────────────

const StatusTag = ({s}) => {
  if (s==="Available") return <span className="tag tag-avail"><span style={{width:5,height:5,borderRadius:"50%",background:"var(--green)",display:"inline-block"}}/>Available</span>;
  if (s==="Reserved") return <span className="tag tag-reserved">Reserved</span>;
  return <span className="tag tag-sold">Sold</span>;
};

const Stars = ({n}) => (
  <span style={{display:"flex",gap:2}}>
    {[1,2,3,4,5].map(i=>(
      <Star key={i} size={13} fill={i<=n?"#C9A84C":"none"} color={i<=n?"#C9A84C":"#444"}/>
    ))}
  </span>
);

const Divider = ({color}) => (
  <div style={{
    height:"1px",
    background:`linear-gradient(90deg,${color||"var(--gold)"},transparent)`,
    margin:"8px 0"
  }}/>
);

// ─────────────────────────────────────────────────────────────
// SECTION 4 · NAVIGATION
// ─────────────────────────────────────────────────────────────

const Nav = ({page, setPage, scrolled}) => {
  const [mob, setMob] = useState(false);
  const links = [
    {key:"home",label:"Home"},
    {key:"inventory",label:"Inventory"},
    {key:"process",label:"Import Process"},
    {key:"tools",label:"Tools"},
    {key:"about",label:"About"},
    {key:"contact",label:"Contact"},
  ];
  return (
    <nav className={`nav ${scrolled?"nav-scrolled":"nav-top"}`} style={{padding:"0 24px"}}>
      <div style={{maxWidth:1280,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:68}}>
        {/* Logo */}
        <div onClick={()=>setPage("home")} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
          <div style={{
            width:36,height:36,background:"linear-gradient(135deg,#C9A84C,#E8C86A)",
            borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center",
            fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:16,color:"#060606"
          }}>AX</div>
          <div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:18,letterSpacing:".08em",lineHeight:1}}>AXIS</div>
            <div style={{fontSize:9,letterSpacing:".18em",textTransform:"uppercase",color:"var(--gold)",lineHeight:1.2}}>AUTO IMPORTS</div>
          </div>
        </div>

        {/* Desktop links */}
        <div className="hide-mobile" style={{display:"flex",gap:32}}>
          {links.map(l=>(
            <span key={l.key} className={`nav-link${page===l.key?" active":""}`}
              onClick={()=>setPage(l.key)}
              style={{color:page===l.key?"var(--wht)":"var(--muted)"}}
            >{l.label}</span>
          ))}
        </div>

        {/* Right actions */}
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <button className="hide-mobile btn btn-gold btn-sm"
            onClick={()=>window.open(WA_BASE,"_blank")}
          >
            <MessageCircle size={13}/> WhatsApp
          </button>
          <button className="hide-mobile btn btn-ghost btn-sm" onClick={()=>setPage("admin")}>
            <LogIn size={13}/> Admin
          </button>
          <button className="btn btn-icon" style={{display:"none"}}
            aria-label="Menu" onClick={()=>setMob(v=>!v)}
          ><Menu size={18}/></button>
          {/* Mobile menu button always visible on mobile */}
          <button onClick={()=>setMob(v=>!v)}
            style={{background:"none",border:"1px solid var(--bd)",padding:"8px",borderRadius:3,display:"block",lineHeight:0}}
            className="" aria-label="Toggle menu"
          >
            {mob ? <X size={18}/> : <Menu size={18}/>}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mob && (
        <div style={{
          background:"rgba(7,7,7,.97)",borderTop:"1px solid var(--bd)",
          padding:"20px 24px 28px",display:"flex",flexDirection:"column",gap:4
        }}>
          {links.map(l=>(
            <span key={l.key} onClick={()=>{setPage(l.key);setMob(false)}}
              style={{padding:"12px 0",borderBottom:"1px solid var(--bd)",fontSize:15,
                fontFamily:"'Cormorant Garamond',serif",fontWeight:600,
                color:page===l.key?"var(--gold)":"var(--wht)",cursor:"pointer"
              }}
            >{l.label}</span>
          ))}
          <div style={{display:"flex",gap:10,marginTop:16}}>
            <button className="btn btn-gold btn-sm" onClick={()=>window.open(WA_BASE,"_blank")}>
              <MessageCircle size={13}/> WhatsApp
            </button>
            <button className="btn btn-ghost btn-sm" onClick={()=>{setPage("admin");setMob(false)}}>
              Admin
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

// ─────────────────────────────────────────────────────────────
// SECTION 5 · FLOATING COMPONENTS
// ─────────────────────────────────────────────────────────────

// AI CHAT — Phase 7: empty input guard, realistic responses
const AI_RESPONSES = {
  "kia":["The most popular Kia models we currently have are the Sportage AWD (2018, $14,500) and Seltos Noblesse (2022, $19,900). Both have excellent auction grades. Which would you like to know more about?","Kia vehicles imported from Korea typically have strong resale value in Ghana. The Sportage is especially popular for its ground clearance on rough roads."],
  "hyundai":["We have the Hyundai Tucson (2017 Diesel, $11,800) and Hyundai Accent (2017, $7,200) available. The Tucson is great for fuel economy with 6.8L/100km. Interested in either?"],
  "price":["Our inventory ranges from $7,200 for the Hyundai Accent to $29,900 for the BMW 520d. Total landed cost in Ghana is typically 40–60% above the USD vehicle price after clearance and duties.","The most affordable vehicle right now is the 2017 Hyundai Accent at $7,200 — total landed cost approximately GH₵ 95,000."],
  "clear":["Ghana import clearance is typically 20–35% of the CIF value depending on vehicle class. Use our Import Tools calculator for a precise estimate. For a $14,500 vehicle, clearance + duties is around $4,800–$6,500."],
  "ship":["Shipping from South Korea (Incheon/Busan port) to Tema Port, Ghana takes 35–40 days on RORO vessels. Shipping cost is approximately $1,200–$1,600 depending on vehicle size."],
  "bmw":["We have the 2019 BMW 520d M Sport at $29,900 — Carbon Black, M Aerodynamics package, Harman Kardon audio. Auction grade 4. Would you like full specs or a landed cost estimate?"],
  "range":["The 2017 Range Rover Evoque SE is available at $24,500. AWD, diesel, 47,900km. Terrain Response system makes it excellent for Ghana's road conditions. Grade 4 certified."],
  "finance":["Yes — we partner with selected Ghanaian banks and microfinance institutions. Typical terms: 20–30% deposit, 12–36 month repayment. Contact us directly on WhatsApp for current rates."],
  "default":["Hi! I'm the AXIS AI assistant. I can help you find the right vehicle, estimate import costs, or explain our process. What are you looking for?","Great question! For the most accurate answer, I'd recommend speaking with our team directly on WhatsApp. Type 'WhatsApp' and I'll connect you.","I'm here to help you find your perfect Korean import. Try asking about specific brands, your budget, or import costs!"],
};

const getAIResponse = (msg) => {
  // Phase 7: guard empty/whitespace input
  const m = (msg||"").trim().toLowerCase();
  if (!m) return "";
  for (const [k,v] of Object.entries(AI_RESPONSES)) {
    if (k!=="default" && m.includes(k)) return v[Math.floor(Math.random()*v.length)];
  }
  if (m.includes("whatsapp") || m.includes("contact")) return `You can reach our team directly at: ${WA_BASE}`;
  const def = AI_RESPONSES.default;
  return def[Math.floor(Math.random()*def.length)];
};

const AIChat = ({onClose, vehicle}) => {
  const initMsg = vehicle
    ? {role:"bot", text:`Hello! I see you're interested in the ${vehicle.year} ${vehicle.brand} ${vehicle.model} at ${fmt(vehicle.price)}. I can help with specs, clearance costs, or shipping info. What would you like to know?`}
    : {role:"bot", text:"Welcome to AXIS Auto Imports AI! I can help you find the perfect Korean vehicle, estimate Ghana import costs, or guide you through our process. How can I help?"};

  const [msgs, setMsgs] = useState([initMsg]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs,typing]);

  const send = useCallback(() => {
    const txt = input.trim();
    if (!txt) return; // Phase 7: empty guard
    setMsgs(m=>[...m,{role:"user",text:txt}]);
    setInput("");
    setTyping(true);
    setTimeout(()=>{
      const resp = getAIResponse(txt);
      setTyping(false);
      if (resp) setMsgs(m=>[...m,{role:"bot",text:resp}]);
    }, 900 + Math.random()*600);
  },[input]);

  return (
    <div style={{
      position:"fixed",bottom:96,right:24,width:"min(360px,calc(100vw - 32px))",
      zIndex:1100,background:"var(--card)",border:"1px solid var(--bd2)",
      borderRadius:8,overflow:"hidden",boxShadow:"0 24px 60px rgba(0,0,0,.8)",
      animation:"chatIn .3s ease"
    }}>
      {/* Header */}
      <div style={{padding:"14px 16px",background:"linear-gradient(135deg,#0f0f0f,#181818)",borderBottom:"1px solid var(--bd)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,var(--gold),var(--gold-l))",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Bot size={16} color="#060606"/>
          </div>
          <div>
            <div style={{fontSize:14,fontWeight:600}}>AXIS AI Assistant</div>
            <div style={{fontSize:11,color:"var(--green)",display:"flex",alignItems:"center",gap:4}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:"var(--green)",display:"inline-block"}}/>Online
            </div>
          </div>
        </div>
        <button className="btn btn-icon" style={{padding:6}} onClick={onClose}><X size={15}/></button>
      </div>

      {/* Messages */}
      <div style={{height:280,overflowY:"auto",padding:14,display:"flex",flexDirection:"column",gap:10}}>
        {msgs.map((m,i)=>(
          <div key={i} className={m.role==="user"?"chat-bubble-user":"chat-bubble-bot"}
            style={{animation:"chatIn .3s ease",lineHeight:1.5}}>{m.text}</div>
        ))}
        {typing && (
          <div className="chat-bubble-bot" style={{display:"flex",gap:4,alignItems:"center",padding:"12px 14px"}}>
            {[0,1,2].map(i=>(
              <span key={i} style={{width:6,height:6,borderRadius:"50%",background:"var(--muted)",display:"inline-block",animation:`pulse 1.2s ${i*0.2}s infinite`}}/>
            ))}
          </div>
        )}
        <div ref={endRef}/>
      </div>

      {/* Input */}
      <div style={{padding:"10px 12px",borderTop:"1px solid var(--bd)",display:"flex",gap:8}}>
        <input value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&send()}
          placeholder="Ask about vehicles, costs..."
          style={{flex:1,padding:"9px 12px",borderRadius:4,fontSize:13}}
        />
        <button className="btn btn-gold" style={{padding:"9px 13px",minWidth:"auto"}} onClick={send}>
          <Send size={13}/>
        </button>
      </div>
      <div style={{padding:"8px 14px 10px",fontSize:11,color:"var(--muted)",borderTop:"1px solid var(--bd)"}}>
        For full support: <span style={{color:"var(--gold)",cursor:"pointer"}} onClick={()=>window.open(WA_BASE,"_blank")}>WhatsApp us ↗</span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// SECTION 6 · VEHICLE CARD
// ─────────────────────────────────────────────────────────────

const VehicleCard = ({v, onClick, saved, onToggleSave}) => (
  <div className="v-card" onClick={()=>onClick(v)}>
    {/* Image */}
    <div style={{position:"relative",height:200,overflow:"hidden",background:"#0a0a0a"}}>
      <img src={v.img} alt={`${v.year} ${v.brand} ${v.model}`}
        style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform .4s"}}
        onError={e=>{e.target.style.display="none"}}
        loading="lazy"
      />
      <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,.5) 0%,transparent 60%)"}}/>

      {/* Status & Year badge */}
      <div style={{position:"absolute",top:12,left:12,display:"flex",gap:6}}>
        <StatusTag s={v.status}/>
        <span className="tag tag-gold">{v.year}</span>
      </div>

      {/* Save */}
      <button onClick={e=>{e.stopPropagation();onToggleSave&&onToggleSave(v.id);}}
        style={{position:"absolute",top:10,right:10,background:"rgba(0,0,0,.5)",border:"1px solid rgba(255,255,255,.15)",
          borderRadius:"50%",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"
        }}
      >
        <Heart size={13} fill={saved?"#C9A84C":"none"} color={saved?"#C9A84C":"#aaa"}/>
      </button>

      {/* Auction grade */}
      <div style={{position:"absolute",bottom:10,right:12,fontSize:10,letterSpacing:".1em",
        background:"rgba(0,0,0,.7)",border:"1px solid var(--gold-bd)",borderRadius:2,padding:"2px 7px",
        color:"var(--gold)",fontWeight:600,textTransform:"uppercase"
      }}>Grade {v.auctionGrade}</div>
    </div>

    {/* Details */}
    <div style={{padding:"16px 18px 18px"}}>
      <div style={{marginBottom:8}}>
        <span className="label" style={{fontSize:10,letterSpacing:".12em"}}>{v.brand}</span>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:20,lineHeight:1.2,margin:"3px 0 4px"}}>
          {v.model} <span style={{fontWeight:400,opacity:.7}}>{v.trim}</span>
        </div>
      </div>

      {/* Quick specs */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 16px",marginBottom:14}}>
        {[
          {icon:Gauge, val:`${v.mileage.toLocaleString()} km`},
          {icon:Fuel, val:v.fuelType},
          {icon:Settings, val:v.transmission.includes("Auto")?"Automatic":"Manual"},
          {icon:Layers, val:v.drivetrain},
        ].map(({icon:I,val},i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:"var(--muted)"}}>
            <I size={12} color="var(--muted2)"/>{val}
          </div>
        ))}
      </div>

      <Divider/>

      {/* Price + CTA */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:10}}>
        <div>
          <div style={{fontSize:11,color:"var(--muted)",letterSpacing:".06em",textTransform:"uppercase",marginBottom:1}}>Price</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:24,color:"var(--gold)"}}>
            {fmt(v.price)}
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <a href={waLink(v)} target="_blank" rel="noreferrer"
            onClick={e=>e.stopPropagation()}
            className="btn btn-wa btn-sm"
            style={{borderRadius:3,display:"inline-flex",alignItems:"center",gap:5,padding:"8px 12px",textDecoration:"none",fontSize:11,fontWeight:600,letterSpacing:".06em",textTransform:"uppercase"}}
          >
            <MessageCircle size={12}/> Inquire
          </a>
        </div>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// SECTION 7 · HOME PAGE
// ─────────────────────────────────────────────────────────────

const Hero = ({setPage}) => {
  // TESTSPEC: slide bounded by modulo — never out of range
  const [idx, setIdx] = useState(0);
  const total = HERO_SLIDES.length;
  useEffect(()=>{
    const t = setInterval(()=>setIdx(i=>(i+1)%total),5500);
    return ()=>clearInterval(t);
  },[total]);
  const slide = HERO_SLIDES[idx];

  return (
    <div style={{position:"relative",height:"100vh",minHeight:620,overflow:"hidden"}}>
      {HERO_SLIDES.map((s,i)=>(
        <div key={i} className="hero-slide"
          style={{backgroundImage:`url(${s.bg})`,opacity:i===idx?1:0,zIndex:i===idx?1:0}}
        >
          <div className="hero-overlay"/>
        </div>
      ))}

      {/* Content */}
      <div style={{position:"relative",zIndex:5,height:"100%",display:"flex",flexDirection:"column",justifyContent:"center",padding:"0 clamp(24px,6vw,120px)"}}>
        <div style={{maxWidth:650}}>
          <div className="tag tag-gold anim-in" style={{marginBottom:20}}>
            {slide.tag} · Korea to Ghana
          </div>
          <h1 className="hero-title anim-up"
            style={{fontSize:"clamp(3.2rem,6.5vw,5.6rem)",fontFamily:"'Cormorant Garamond',serif",
              fontWeight:700,lineHeight:1.02,marginBottom:16,whiteSpace:"pre-line"
            }}
          >{slide.title}</h1>
          <div style={{fontSize:"clamp(.95rem,2vw,1.15rem)",color:"rgba(240,237,229,.7)",marginBottom:8,fontWeight:300}}>{slide.sub}</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.5rem,3vw,2.2rem)",color:"var(--gold)",marginBottom:36}}>{slide.price}</div>

          <div className="hero-cta-group" style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <button className="btn btn-gold" onClick={()=>setPage("inventory")} style={{padding:"14px 32px"}}>
              <Car size={15}/> Browse Inventory
            </button>
            <button className="btn btn-ghost" onClick={()=>setPage("tools")} style={{padding:"14px 28px"}}>
              <Calculator size={15}/> Cost Estimator
            </button>
            <a href={WA_BASE} target="_blank" rel="noreferrer" className="btn btn-wa" style={{padding:"14px 28px",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:8,fontSize:12,fontWeight:600,letterSpacing:".1em",textTransform:"uppercase",borderRadius:3}}>
              <MessageCircle size={15}/> WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div style={{position:"absolute",bottom:32,left:"50%",transform:"translateX(-50%)",display:"flex",gap:8,zIndex:6}}>
        {HERO_SLIDES.map((_,i)=>(
          <button key={i} onClick={()=>setIdx(i)}
            style={{width:i===idx?28:7,height:7,borderRadius:4,
              background:i===idx?"var(--gold)":"rgba(255,255,255,.3)",
              border:"none",transition:"all .4s",cursor:"pointer"
            }}
          />
        ))}
      </div>

      {/* Prev / Next */}
      {[{dir:-1,icon:ChevronLeft},{dir:1,icon:ChevronRight}].map(({dir,icon:I},k)=>(
        <button key={k} onClick={()=>setIdx(i=>(i+dir+total)%total)}
          style={{position:"absolute",top:"50%",transform:"translateY(-50%)",
            [dir===-1?"left":"right"]:20,zIndex:6,
            background:"rgba(0,0,0,.4)",border:"1px solid rgba(255,255,255,.15)",
            borderRadius:"50%",width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"
          }}
        ><I size={18}/></button>
      ))}

      {/* Bottom stats bar */}
      <div style={{
        position:"absolute",bottom:0,left:0,right:0,zIndex:6,
        background:"rgba(0,0,0,.75)",backdropFilter:"blur(12px)",
        borderTop:"1px solid var(--bd)",
        display:"grid",gridTemplateColumns:"repeat(4,1fr)",
      }}>
        {[{n:"200+",l:"Vehicles Imported"},{n:"98%",l:"Customer Satisfaction"},{n:"6 Wks",l:"Avg. Delivery Time"},{n:"4+",l:"Auction Grade Min."}].map(({n,l},i)=>(
          <div key={i} style={{textAlign:"center",padding:"16px 8px",borderRight:i<3?"1px solid var(--bd)":"none"}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:22,color:"var(--gold)"}}>{n}</div>
            <div style={{fontSize:10,letterSpacing:".1em",textTransform:"uppercase",color:"var(--muted)",marginTop:2}}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FeaturedVehicles = ({setPage, setSelectedVehicle}) => {
  const [saved, setSaved] = useState([]);
  const featured = VEHICLES.filter(v=>v.status!=="Sold").slice(0,4);
  const toggle = id => setSaved(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);

  return (
    <section className="section" style={{background:"var(--surf)"}}>
      <div className="container">
        <div style={{textAlign:"center",marginBottom:56}}>
          <div className="label" style={{marginBottom:12}}>Latest Arrivals</div>
          <h2 style={{fontSize:"clamp(2rem,4vw,3rem)",marginBottom:16}}>Featured <span className="gold-grad">Vehicles</span></h2>
          <div className="gold-line" style={{margin:"0 auto 16px"}}/>
          <p style={{color:"var(--muted)",maxWidth:520,margin:"0 auto",fontSize:15}}>
            Hand-selected premium vehicles imported directly from South Korea's top auction houses. Every car verified, graded, and ready to ship.
          </p>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:24}}>
          {featured.map(v=>(
            <VehicleCard key={v.id} v={v}
              saved={saved.includes(v.id)}
              onToggleSave={toggle}
              onClick={v=>{setSelectedVehicle(v);setPage("detail");}}
            />
          ))}
        </div>

        <div style={{textAlign:"center",marginTop:40}}>
          <button className="btn btn-ghost" onClick={()=>setPage("inventory")} style={{padding:"13px 36px"}}>
            View All Inventory <ArrowRight size={14}/>
          </button>
        </div>
      </div>
    </section>
  );
};

const WhyUs = () => (
  <section className="section">
    <div className="container">
      <div style={{textAlign:"center",marginBottom:56}}>
        <div className="label" style={{marginBottom:12}}>Why AXIS</div>
        <h2 style={{fontSize:"clamp(2rem,4vw,3rem)",marginBottom:12}}>Ghana's Most <span className="gold-grad">Trusted</span> Importer</h2>
        <div className="gold-line" style={{margin:"0 auto"}}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:28}}>
        {WHY_US.map(({icon:I,title,desc},i)=>(
          <div key={i} className="glass" style={{borderRadius:6,padding:"28px 26px",borderColor:"var(--bd)",transition:"border-color .3s"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor="var(--gold-bd)"}
            onMouseLeave={e=>e.currentTarget.style.borderColor="var(--bd)"}
          >
            <div style={{width:46,height:46,borderRadius:4,background:"var(--gold-bg)",border:"1px solid var(--gold-bd)",
              display:"flex",alignItems:"center",justifyContent:"center",marginBottom:18}}>
              <I size={20} color="var(--gold)"/>
            </div>
            <h3 style={{fontSize:"1.2rem",marginBottom:10}}>{title}</h3>
            <p style={{color:"var(--muted)",fontSize:14,lineHeight:1.7}}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ImportProcessSection = ({setPage}) => (
  <section className="section" style={{background:"var(--surf)"}}>
    <div className="container">
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"start"}} className="mobile-col">
        <div>
          <div className="label" style={{marginBottom:12}}>How It Works</div>
          <h2 style={{fontSize:"clamp(1.9rem,4vw,2.8rem)",marginBottom:16}}>The AXIS <span className="gold-grad">Import Process</span></h2>
          <div className="gold-line-l" style={{marginBottom:20}}/>
          <p style={{color:"var(--muted)",fontSize:15,lineHeight:1.8,marginBottom:28}}>
            We've streamlined the Korea-to-Ghana import journey into 5 transparent steps. No surprises — just premium vehicles delivered to your door.
          </p>
          <button className="btn btn-gold" onClick={()=>setPage("process")} style={{padding:"13px 28px"}}>
            Learn More <ArrowRight size={13}/>
          </button>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:0}}>
          {PROCESS_STEPS.map(({icon:I,num,title,desc},i)=>(
            <div key={i} style={{display:"flex",gap:20,paddingBottom:i<PROCESS_STEPS.length-1?28:0}}>
              {/* Timeline */}
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
                <div style={{width:42,height:42,borderRadius:"50%",
                  background:i===0?"linear-gradient(135deg,var(--gold),var(--gold-l))":"var(--card2)",
                  border:i!==0?"1px solid var(--gold-bd)":"none",
                  display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0
                }}>
                  <I size={17} color={i===0?"#060606":"var(--gold)"}/>
                </div>
                {i<PROCESS_STEPS.length-1 && (
                  <div style={{width:1,flex:1,background:"linear-gradient(to bottom,var(--gold-bd),transparent)",marginTop:6}}/>
                )}
              </div>
              {/* Content */}
              <div style={{paddingBottom:6}}>
                <div style={{fontSize:10,color:"var(--gold)",letterSpacing:".15em",fontWeight:700,marginBottom:4}}>{num}</div>
                <h4 style={{fontSize:"1rem",marginBottom:5}}>{title}</h4>
                <p style={{fontSize:13,color:"var(--muted)",lineHeight:1.65}}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const Testimonials = () => (
  <section className="section">
    <div className="container">
      <div style={{textAlign:"center",marginBottom:56}}>
        <div className="label" style={{marginBottom:12}}>Testimonials</div>
        <h2 style={{fontSize:"clamp(2rem,4vw,3rem)",marginBottom:12}}>Customer <span className="gold-grad">Stories</span></h2>
        <div className="gold-line" style={{margin:"0 auto"}}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:24}}>
        {TESTIMONIALS.map((t,i)=>(
          <div key={i} className="glass" style={{borderRadius:6,padding:"28px 26px",borderColor:"var(--gold-bd)"}}>
            <div style={{display:"flex",gap:4,marginBottom:16}}>{<Stars n={t.rating}/>}</div>
            <p style={{fontSize:15,lineHeight:1.75,color:"rgba(240,237,229,.85)",marginBottom:20,fontStyle:"italic"}}>"{t.text}"</p>
            <Divider/>
            <div style={{display:"flex",alignItems:"center",gap:12,marginTop:16}}>
              <div style={{width:40,height:40,borderRadius:"50%",background:"linear-gradient(135deg,var(--gold),var(--gold-l))",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#060606",flexShrink:0
              }}>{t.initials}</div>
              <div>
                <div style={{fontSize:14,fontWeight:600}}>{t.name}</div>
                <div style={{fontSize:12,color:"var(--muted)"}}>{t.role}</div>
              </div>
            </div>
            <div style={{marginTop:10,fontSize:11,color:"var(--gold)",fontStyle:"italic"}}>{t.vehicle}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FAQSection = () => {
  const [open, setOpen] = useState(null);
  return (
    <section className="section" style={{background:"var(--surf)"}}>
      <div className="container" style={{maxWidth:860}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <div className="label" style={{marginBottom:12}}>FAQ</div>
          <h2 style={{fontSize:"clamp(2rem,4vw,3rem)",marginBottom:12}}>Frequently Asked <span className="gold-grad">Questions</span></h2>
          <div className="gold-line" style={{margin:"0 auto"}}/>
        </div>

        <div style={{display:"flex",flexDirection:"column"}}>
          {FAQS.map((f,i)=>(
            <div key={i} className="faq-item">
              <button onClick={()=>setOpen(open===i?null:i)}
                style={{width:"100%",background:"none",border:"none",padding:"20px 4px",
                  display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"
                }}
              >
                <span style={{fontSize:16,fontFamily:"'Cormorant Garamond',serif",fontWeight:600,textAlign:"left",color:"var(--wht)"}}>{f.q}</span>
                <span style={{flexShrink:0,color:"var(--gold)",marginLeft:16,transform:open===i?"rotate(180deg)":"none",transition:"transform .3s"}}>
                  <ChevronDown size={18}/>
                </span>
              </button>
              <div className="faq-answer" style={{maxHeight:open===i?400:0,opacity:open===i?1:0,overflow:"hidden",transition:"max-height .35s ease,opacity .3s"}}>
                <p style={{fontSize:14,color:"var(--muted)",lineHeight:1.75,paddingBottom:20}}>{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTABanner = ({setPage}) => (
  <section style={{padding:"80px 0",background:"linear-gradient(135deg,#0a0a0a 0%,#111 50%,#0a0a0a 100%)",borderTop:"1px solid var(--gold-bd)",borderBottom:"1px solid var(--gold-bd)"}}>
    <div className="container" style={{textAlign:"center"}}>
      <div className="label" style={{marginBottom:12}}>Ready to Import?</div>
      <h2 style={{fontSize:"clamp(2rem,4.5vw,3.4rem)",marginBottom:16}}>Your Premium Korean Car<br/><span className="gold-grad">Awaits in Accra</span></h2>
      <p style={{color:"var(--muted)",maxWidth:480,margin:"0 auto 32px",fontSize:15,lineHeight:1.7}}>
        Join 200+ satisfied customers who've imported premium vehicles from Korea with AXIS. Transparent pricing, expert guidance, zero surprises.
      </p>
      <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
        <button className="btn btn-gold" onClick={()=>setPage("inventory")} style={{padding:"14px 32px"}}>
          <Car size={14}/> Browse Inventory
        </button>
        <a href={WA_BASE} target="_blank" rel="noreferrer" className="btn btn-wa"
          style={{padding:"14px 28px",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:8,fontSize:12,fontWeight:600,letterSpacing:".1em",textTransform:"uppercase",borderRadius:3}}
        >
          <MessageCircle size={14}/> Chat on WhatsApp
        </a>
      </div>
    </div>
  </section>
);

const Footer = ({setPage}) => (
  <footer style={{background:"#060606",borderTop:"1px solid var(--bd)",padding:"64px 0 32px"}}>
    <div className="container">
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:48,marginBottom:48}}>
        {/* Brand */}
        <div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
            <div style={{width:38,height:38,background:"linear-gradient(135deg,var(--gold),var(--gold-l))",borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:17,color:"#060606"}}>AX</div>
            <div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:19}}>AXIS</div>
              <div style={{fontSize:9,letterSpacing:".18em",textTransform:"uppercase",color:"var(--gold)"}}>AUTO IMPORTS</div>
            </div>
          </div>
          <p style={{fontSize:13,color:"var(--muted)",lineHeight:1.7,marginBottom:18}}>
            Premium Korean vehicle imports to Ghana. Direct from Seoul's finest auction houses to your driveway in Accra.
          </p>
          <a href={WA_BASE} target="_blank" rel="noreferrer"
            style={{display:"inline-flex",alignItems:"center",gap:7,background:"rgba(37,211,102,.1)",border:"1px solid rgba(37,211,102,.25)",color:"var(--green)",padding:"9px 14px",borderRadius:3,fontSize:12,fontWeight:600,textDecoration:"none",letterSpacing:".06em",textTransform:"uppercase"}}
          >
            <MessageCircle size={13}/> WhatsApp Us
          </a>
        </div>

        {/* Inventory */}
        <div>
          <h5 style={{fontSize:11,letterSpacing:".15em",textTransform:"uppercase",color:"var(--gold)",marginBottom:16}}>Inventory</h5>
          {["SUVs & Crossovers","Sedans","Luxury Vehicles","Hybrid & Electric","Latest Arrivals","Reserved Vehicles"].map(t=>(
            <div key={t} onClick={()=>setPage("inventory")} style={{fontSize:13,color:"var(--muted)",marginBottom:9,cursor:"pointer",transition:"color .2s"}}
              onMouseEnter={e=>e.target.style.color="var(--wht)"}
              onMouseLeave={e=>e.target.style.color="var(--muted)"}
            >{t}</div>
          ))}
        </div>

        {/* Services */}
        <div>
          <h5 style={{fontSize:11,letterSpacing:".15em",textTransform:"uppercase",color:"var(--gold)",marginBottom:16}}>Services</h5>
          {["Import Process","Cost Calculator","Shipping Info","Port Clearance","Financing Options","Vehicle Inspection"].map(t=>(
            <div key={t} onClick={()=>setPage("tools")} style={{fontSize:13,color:"var(--muted)",marginBottom:9,cursor:"pointer",transition:"color .2s"}}
              onMouseEnter={e=>e.target.style.color="var(--wht)"}
              onMouseLeave={e=>e.target.style.color="var(--muted)"}
            >{t}</div>
          ))}
        </div>

        {/* Contact */}
        <div>
          <h5 style={{fontSize:11,letterSpacing:".15em",textTransform:"uppercase",color:"var(--gold)",marginBottom:16}}>Contact</h5>
          {[
            {icon:Phone, text:"+233 (0) 24 426 5976"},
            {icon:Mail, text:"info@axisautoimports.com"},
            {icon:MapPin, text:"Accra, Greater Accra, Ghana"},
            {icon:MapPin, text:"Kasoa, Central Region, Ghana"},
            {icon:MapPin, text:"Kumasi, Ashanti Region, Ghana"},
            {icon:Clock, text:"Mon–Sat: 8am – 6pm GMT"},
          ].map(({icon:I,text},i)=>(
            <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:12}}>
              <I size={13} color="var(--gold)" style={{marginTop:2,flexShrink:0}}/>
              <span style={{fontSize:13,color:"var(--muted)"}}>{text}</span>
            </div>
          ))}
          <div style={{marginTop:16,padding:14,background:"var(--gold-bg)",border:"1px solid var(--gold-bd)",borderRadius:4}}>
            <div style={{fontSize:11,color:"var(--gold)",fontWeight:600,letterSpacing:".1em",textTransform:"uppercase",marginBottom:6}}>Korea Office</div>
            <div style={{fontSize:12,color:"var(--muted)"}}>Seoul, South Korea<br/>+82-2-1234-5678</div>
          </div>
        </div>
      </div>

      <div style={{borderTop:"1px solid var(--bd)",paddingTop:24,display:"flex",flexWrap:"wrap",gap:16,justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:12,color:"var(--muted2)"}}>© 2024 AXIS Auto Imports. All rights reserved. Registered with DVLA Ghana & CEPS Tema Port.</div>
        <div style={{display:"flex",gap:16}}>
          {["Privacy Policy","Terms of Service","DVLA Compliance"].map(t=>(
            <span key={t} style={{fontSize:11,color:"var(--muted2)",cursor:"pointer",letterSpacing:".05em"}}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

const HomePage = ({setPage, setSelectedVehicle}) => (
  <>
    <Hero setPage={setPage}/>
    <FeaturedVehicles setPage={setPage} setSelectedVehicle={setSelectedVehicle}/>
    <WhyUs/>
    <ImportProcessSection setPage={setPage}/>
    <Testimonials/>
    <FAQSection/>
    <CTABanner setPage={setPage}/>
  </>
);

// ─────────────────────────────────────────────────────────────
// SECTION 8 · INVENTORY PAGE
// ─────────────────────────────────────────────────────────────

const InventoryPage = ({setPage, setSelectedVehicle}) => {
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [saved, setSaved] = useState([]);
  const toggle = id => setSaved(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);

  const f = v => setFilters(p=>({...p,...v}));
  const clear = () => setFilters({});

  // TESTSPEC: result always Array, never undefined
  const results = useMemo(()=>sortVehicles(filterVehicles(VEHICLES,filters),sort),[filters,sort]);

  const brands = ["All",...new Set(VEHICLES.map(v=>v.brand))];
  const cats = ["All",...new Set(VEHICLES.map(v=>v.category))];
  const fuels = ["All",...new Set(VEHICLES.map(v=>v.fuelType))];

  const FilterPanel = () => (
    <div style={{background:"var(--card)",border:"1px solid var(--bd)",borderRadius:6,padding:24,position:"sticky",top:88}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h4 style={{fontSize:16}}>Filters</h4>
        <button onClick={clear} style={{background:"none",border:"none",color:"var(--muted)",fontSize:12,cursor:"pointer",textDecoration:"underline"}}>Clear all</button>
      </div>

      {/* Search */}
      <div style={{marginBottom:18}}>
        <label style={{fontSize:11,color:"var(--muted)",letterSpacing:".1em",textTransform:"uppercase",display:"block",marginBottom:7}}>Search</label>
        <div style={{position:"relative"}}>
          <Search size={13} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"var(--muted)"}}/>
          <input value={filters.search||""} onChange={e=>f({search:e.target.value})}
            placeholder="Brand, model, year..."
            style={{width:"100%",padding:"9px 10px 9px 30px",borderRadius:3,fontSize:13}}
          />
        </div>
      </div>

      {[
        {label:"Brand",key:"brand",opts:brands},
        {label:"Category",key:"category",opts:cats},
        {label:"Fuel Type",key:"fuel",opts:fuels},
        {label:"Drivetrain",key:"drivetrain",opts:["All","AWD","FWD","RWD","AWD-i"]},
        {label:"Status",key:"status",opts:["All","Available","Reserved"]},
      ].map(({label,key,opts})=>(
        <div key={key} style={{marginBottom:16}}>
          <label style={{fontSize:11,color:"var(--muted)",letterSpacing:".1em",textTransform:"uppercase",display:"block",marginBottom:7}}>{label}</label>
          <select value={filters[key]||"All"} onChange={e=>f({[key]:e.target.value})}
            style={{width:"100%",padding:"9px 10px",borderRadius:3,fontSize:13}}
          >
            {opts.map(o=><option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      ))}

      {/* Price range */}
      <div style={{marginBottom:16}}>
        <label style={{fontSize:11,color:"var(--muted)",letterSpacing:".1em",textTransform:"uppercase",display:"block",marginBottom:7}}>
          Max Price: {filters.maxPrice?fmt(filters.maxPrice):"Any"}
        </label>
        <input type="range" min={5000} max={50000} step={500}
          value={filters.maxPrice||50000}
          onChange={e=>f({maxPrice:+e.target.value})}
          style={{width:"100%"}}
        />
        <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"var(--muted)",marginTop:4}}>
          <span>$5,000</span><span>$50,000</span>
        </div>
      </div>

      {/* Max mileage */}
      <div>
        <label style={{fontSize:11,color:"var(--muted)",letterSpacing:".1em",textTransform:"uppercase",display:"block",marginBottom:7}}>
          Max Mileage: {filters.maxMileage?(filters.maxMileage/1000).toFixed(0)+"k km":"Any"}
        </label>
        <input type="range" min={10000} max={150000} step={5000}
          value={filters.maxMileage||150000}
          onChange={e=>f({maxMileage:+e.target.value})}
          style={{width:"100%"}}
        />
      </div>
    </div>
  );

  return (
    <div style={{paddingTop:68,minHeight:"100vh",background:"var(--blk)"}}>
      {/* Header */}
      <div style={{background:"var(--surf)",borderBottom:"1px solid var(--bd)",padding:"40px 0 32px"}}>
        <div className="container">
          <div className="label" style={{marginBottom:8}}>Inventory</div>
          <h1 style={{fontSize:"clamp(1.8rem,4vw,2.8rem)",marginBottom:12}}>Available <span className="gold-grad">Vehicles</span></h1>
          <p style={{color:"var(--muted)",fontSize:14}}>Korean-sourced premium vehicles ready for Ghana import · {VEHICLES.length} total listings</p>
        </div>
      </div>

      <div className="container" style={{paddingTop:36,paddingBottom:60}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
          {/* Results count */}
          <div style={{fontSize:13,color:"var(--muted)"}}>
            <span style={{color:"var(--wht)",fontWeight:600}}>{results.length}</span> of {VEHICLES.length} vehicles
            {Object.keys(filters).filter(k=>filters[k]&&filters[k]!=="All").length>0 && (
              <button onClick={clear} style={{background:"none",border:"none",color:"var(--gold)",fontSize:12,cursor:"pointer",marginLeft:10}}>
                <X size={10}/> Clear filters
              </button>
            )}
          </div>

          {/* Sort + filter toggle */}
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <select value={sort} onChange={e=>setSort(e.target.value)}
              style={{padding:"8px 12px",borderRadius:3,fontSize:12,width:"auto"}}
            >
              <option value="newest">Newest First</option>
              <option value="cheapest">Cheapest First</option>
              <option value="expensive">Most Expensive</option>
              <option value="mileage">Lowest Mileage</option>
              <option value="oldest">Oldest First</option>
            </select>
            <button className="btn btn-ghost btn-sm" onClick={()=>setShowFilters(v=>!v)}>
              <SlidersHorizontal size={13}/> Filters
            </button>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:showFilters?"260px 1fr":"1fr",gap:28,alignItems:"start"}}>
          {showFilters && <FilterPanel/>}

          <div>
            {results.length===0 ? (
              <div style={{textAlign:"center",padding:"80px 24px",color:"var(--muted)"}}>
                <Car size={48} style={{opacity:.2,margin:"0 auto 16px"}}/>
                <h3 style={{marginBottom:8,opacity:.5}}>No vehicles match your filters</h3>
                <button className="btn btn-ghost btn-sm" onClick={clear} style={{marginTop:8}}>Clear filters</button>
              </div>
            ) : (
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:22}}>
                {results.map(v=>(
                  <VehicleCard key={v.id} v={v}
                    saved={saved.includes(v.id)} onToggleSave={toggle}
                    onClick={v=>{setSelectedVehicle(v);setPage("detail");}}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// SECTION 9 · VEHICLE DETAIL PAGE
// ─────────────────────────────────────────────────────────────

const VehicleDetailPage = ({vehicle, setPage, setSelectedVehicle}) => {
  const [imgIdx, setImgIdx] = useState(0);
  const [showCalc, setShowCalc] = useState(false);
  const [saved, setSaved] = useState(false);
  if (!vehicle) { setPage("inventory"); return null; }

  const imgs = vehicle.imgs||[vehicle.img];
  const clearance = calcClearance(vehicle.price, vehicle.category);
  const shipping = vehicle.category==="Luxury SUV"?1600:1200;
  const landed = vehicle.price + shipping + clearance.total;

  const similar = VEHICLES.filter(v=>v.id!==vehicle.id&&(v.brand===vehicle.brand||v.category===vehicle.category)).slice(0,3);

  const Spec = ({label,value,highlight}) => (
    <div className="spec-row">
      <span style={{fontSize:13,color:"var(--muted)"}}>{label}</span>
      <span style={{fontSize:13,fontWeight:highlight?600:"400",color:highlight?"var(--gold)":"var(--wht)"}}>{value}</span>
    </div>
  );

  return (
    <div style={{paddingTop:68,minHeight:"100vh"}}>
      {/* Breadcrumb */}
      <div style={{background:"var(--surf)",borderBottom:"1px solid var(--bd)",padding:"14px 0"}}>
        <div className="container" style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:"var(--muted)"}}>
          <span onClick={()=>setPage("home")} style={{cursor:"pointer",transition:"color .2s"}} onMouseEnter={e=>e.target.style.color="var(--wht)"} onMouseLeave={e=>e.target.style.color="var(--muted)"}>Home</span>
          <ChevronRight size={12}/>
          <span onClick={()=>setPage("inventory")} style={{cursor:"pointer",transition:"color .2s"}} onMouseEnter={e=>e.target.style.color="var(--wht)"} onMouseLeave={e=>e.target.style.color="var(--muted)"}>Inventory</span>
          <ChevronRight size={12}/>
          <span style={{color:"var(--wht)"}}>{vehicle.year} {vehicle.brand} {vehicle.model}</span>
        </div>
      </div>

      <div className="container" style={{paddingTop:36,paddingBottom:60}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 380px",gap:36,alignItems:"start"}} className="mobile-col">

          {/* LEFT: Gallery + details */}
          <div>
            {/* Main image */}
            <div style={{borderRadius:6,overflow:"hidden",position:"relative",marginBottom:10,background:"#0a0a0a",aspectRatio:"16/9"}}>
              <img src={imgs[imgIdx]||imgs[0]} alt={`${vehicle.year} ${vehicle.brand} ${vehicle.model}`}
                style={{width:"100%",height:"100%",objectFit:"cover"}}
                onError={e=>{e.target.style.display="none"}} loading="eager"
              />
              <div style={{position:"absolute",top:12,left:12,display:"flex",gap:6}}>
                <StatusTag s={vehicle.status}/>
                <span className="tag tag-gold">Grade {vehicle.auctionGrade}</span>
              </div>
              {imgs.length>1 && (
                <>
                  {[{d:-1,icon:ChevronLeft,side:"left"},{d:1,icon:ChevronRight,side:"right"}].map(({d,icon:I,side})=>(
                    <button key={side} onClick={()=>setImgIdx(i=>(i+d+imgs.length)%imgs.length)}
                      style={{position:"absolute",top:"50%",transform:"translateY(-50%)",[side]:12,
                        background:"rgba(0,0,0,.55)",border:"1px solid rgba(255,255,255,.15)",
                        borderRadius:"50%",width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"
                      }}
                    ><I size={16}/></button>
                  ))}
                </>
              )}
            </div>

            {/* Thumbnails */}
            {imgs.length>1 && (
              <div style={{display:"flex",gap:8,marginBottom:24}}>
                {imgs.map((src,i)=>(
                  <div key={i} onClick={()=>setImgIdx(i)}
                    style={{width:74,height:52,borderRadius:4,overflow:"hidden",cursor:"pointer",
                      border:`2px solid ${i===imgIdx?"var(--gold)":"transparent"}`,flexShrink:0
                    }}
                  >
                    <img src={src} style={{width:"100%",height:"100%",objectFit:"cover"}} loading="lazy"
                      onError={e=>{e.target.style.display="none"}}/>
                  </div>
                ))}
              </div>
            )}

            {/* Title block */}
            <div style={{marginBottom:24}}>
              <div className="label" style={{marginBottom:6}}>{vehicle.brand} · {vehicle.category}</div>
              <h1 style={{fontSize:"clamp(1.8rem,4vw,2.8rem)",marginBottom:8}}>
                {vehicle.year} {vehicle.brand} {vehicle.model}
                <span style={{fontSize:"60%",fontWeight:400,color:"var(--muted)",marginLeft:10}}>{vehicle.trim}</span>
              </h1>
              <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:12}}>
                <StatusTag s={vehicle.status}/>
                <span className="tag tag-gold">Auction Grade {vehicle.auctionGrade}</span>
                {vehicle.fuelType==="Hybrid"&&<span className="tag tag-new">Hybrid</span>}
              </div>
              <p style={{color:"var(--muted)",fontSize:14,lineHeight:1.75}}>{vehicle.description}</p>
            </div>

            {/* Specs grid */}
            <div style={{background:"var(--card)",border:"1px solid var(--bd)",borderRadius:6,padding:"20px 22px",marginBottom:24}}>
              <h3 style={{fontSize:18,marginBottom:16}}>Specifications</h3>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 32px"}}>
                {[
                  {label:"Year",value:vehicle.year,h:false},
                  {label:"Mileage",value:`${vehicle.mileage.toLocaleString()} km`,h:false},
                  {label:"Engine",value:`${(vehicle.engineCC/1000).toFixed(1)}L`,h:false},
                  {label:"Horsepower",value:`${vehicle.horsepower} hp`,h:false},
                  {label:"Torque",value:vehicle.torque,h:false},
                  {label:"Fuel Economy",value:vehicle.fuelEconomy,h:false},
                  {label:"Fuel Type",value:vehicle.fuelType,h:false},
                  {label:"Transmission",value:vehicle.transmission,h:false},
                  {label:"Drivetrain",value:vehicle.drivetrain,h:false},
                  {label:"Seating",value:`${vehicle.seats} passengers`,h:false},
                  {label:"Doors",value:vehicle.doors,h:false},
                  {label:"Color",value:vehicle.color,h:false},
                ].map(s=><Spec key={s.label} label={s.label} value={s.value} highlight={s.h}/>)}
              </div>
            </div>

            {/* Features */}
            <div style={{background:"var(--card)",border:"1px solid var(--bd)",borderRadius:6,padding:"20px 22px",marginBottom:24}}>
              <h3 style={{fontSize:18,marginBottom:16}}>Features & Equipment</h3>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:9}}>
                {vehicle.features.map((f,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:"rgba(240,237,229,.8)"}}>
                    <Check size={12} color="var(--gold)" style={{flexShrink:0}}/>
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Similar */}
            {similar.length>0 && (
              <div>
                <h3 style={{fontSize:18,marginBottom:16}}>Similar Vehicles</h3>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:16}}>
                  {similar.map(v=>(
                    <div key={v.id} className="v-card" style={{borderRadius:5}}
                      onClick={()=>{setSelectedVehicle(v);setImgIdx(0);window.scrollTo({top:0,behavior:"smooth"});}}
                    >
                      <div style={{height:130,overflow:"hidden",background:"#0a0a0a"}}>
                        <img src={v.img} style={{width:"100%",height:"100%",objectFit:"cover"}} loading="lazy" onError={e=>{e.target.style.display="none"}}/>
                      </div>
                      <div style={{padding:"12px 14px"}}>
                        <div style={{fontSize:11,color:"var(--gold)",marginBottom:2}}>{v.brand}</div>
                        <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:15}}>{v.year} {v.model}</div>
                        <div style={{color:"var(--gold)",fontWeight:700,fontSize:16,marginTop:4}}>{fmt(v.price)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Price + Contact + Calculator */}
          <div style={{display:"flex",flexDirection:"column",gap:18}}>
            {/* Price card */}
            <div style={{background:"var(--card)",border:"1px solid var(--gold-bd)",borderRadius:6,padding:"22px 22px"}}>
              <div style={{fontSize:11,color:"var(--muted)",letterSpacing:".1em",textTransform:"uppercase",marginBottom:6}}>Vehicle Price (Korea)</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:36,color:"var(--gold)",marginBottom:4}}>{fmt(vehicle.price)}</div>
              <div style={{fontSize:12,color:"var(--muted)",marginBottom:18}}>
                + ~{fmt(clearance.total)} clearance · + ~{fmt(shipping)} shipping
              </div>
              <div style={{background:"var(--gold-bg)",border:"1px solid var(--gold-bd)",borderRadius:4,padding:"12px 14px",marginBottom:18}}>
                <div style={{fontSize:11,color:"var(--gold)",fontWeight:600,letterSpacing:".08em",textTransform:"uppercase",marginBottom:4}}>Estimated Landed Cost</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:24}}>{fmt(landed)}</div>
                <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>Tema Port delivered · {fmtGHS(Math.round(landed*15.2))}</div>
              </div>
              <div style={{display:"flex",gap:10}}>
                <button className="btn btn-icon" style={{flex:"0 0 auto"}} onClick={()=>setSaved(v=>!v)}>
                  <Heart size={15} fill={saved?"#C9A84C":"none"} color={saved?"var(--gold)":"var(--muted)"}/>
                </button>
                <button className="btn btn-icon" style={{flex:"0 0 auto"}}>
                  <Share2 size={15}/>
                </button>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a href={waLink(vehicle)} target="_blank" rel="noreferrer"
              className="btn btn-wa"
              style={{padding:"15px",justifyContent:"center",textDecoration:"none",display:"flex",alignItems:"center",gap:8,borderRadius:4,fontSize:13,fontWeight:600,letterSpacing:".06em",textTransform:"uppercase"}}
            >
              <MessageCircle size={15}/> Inquire on WhatsApp
            </a>

            {/* Clearance breakdown */}
            <div style={{background:"var(--card)",border:"1px solid var(--bd)",borderRadius:6,padding:"18px 20px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <h4 style={{fontSize:15}}>Ghana Import Costs</h4>
                <button onClick={()=>setShowCalc(v=>!v)} style={{background:"none",border:"none",color:"var(--gold)",cursor:"pointer",fontSize:11,textTransform:"uppercase",letterSpacing:".08em"}}>
                  {showCalc?"Hide":"Show"}
                </button>
              </div>
              {showCalc && (
                <div style={{animation:"fadeUp .3s ease"}}>
                  {[
                    {label:"Vehicle Price (FOB)",val:fmt(vehicle.price)},
                    {label:"Sea Freight (estimate)",val:fmt(shipping)},
                    {label:"Insurance (0.5%)",val:fmt(Math.round(vehicle.price*.005))},
                    {label:"CIF Value",val:fmt(clearance.cif),bold:true},
                    {label:"Import Duty",val:fmt(clearance.duty)},
                    {label:"VAT (12.5%)",val:fmt(clearance.vat)},
                    {label:"ECOWAS Levy",val:fmt(clearance.ecowas)},
                    {label:"Examination Fees",val:fmt(clearance.examinFees)},
                    {label:"Total Clearance",val:fmt(clearance.total),bold:true,gold:true},
                    {label:"TOTAL LANDED COST",val:fmt(landed),bold:true,gold:true},
                  ].map(({label,val,bold,gold},i)=>(
                    <div key={i} className="spec-row">
                      <span style={{fontSize:12,color:gold?"var(--gold)":bold?"var(--wht)":"var(--muted)",fontWeight:bold?600:"400"}}>{label}</span>
                      <span style={{fontSize:12,fontWeight:bold?700:"400",color:gold?"var(--gold)":"var(--wht)"}}>{val}</span>
                    </div>
                  ))}
                  <div style={{marginTop:12,fontSize:11,color:"var(--muted)",lineHeight:1.6}}>
                    * Estimates based on current CEPS rates. Actual charges may vary. Contact us for a precise quotation.
                  </div>
                </div>
              )}
              {!showCalc && (
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  {[
                    {l:"Clearance",v:fmt(clearance.total)},
                    {l:"Shipping",v:fmt(shipping)},
                    {l:"GHS Equiv",v:fmtGHS(Math.round(landed*15.2))},
                    {l:"Timeline",v:"~6 weeks"},
                  ].map(({l,v},i)=>(
                    <div key={i} style={{background:"var(--card2)",borderRadius:4,padding:"10px 12px"}}>
                      <div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:3}}>{l}</div>
                      <div style={{fontSize:13,fontWeight:600,color:"var(--wht)"}}>{v}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact form */}
            <div style={{background:"var(--card)",border:"1px solid var(--bd)",borderRadius:6,padding:"18px 20px"}}>
              <h4 style={{fontSize:15,marginBottom:14}}>Send Inquiry</h4>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {[
                  {ph:"Your Full Name",type:"text"},
                  {ph:"Phone / WhatsApp",type:"tel"},
                  {ph:"Email Address",type:"email"},
                ].map(({ph,type},i)=>(
                  <input key={i} type={type} placeholder={ph} style={{padding:"10px 12px",borderRadius:3,fontSize:13,width:"100%"}}/>
                ))}
                <textarea placeholder={`I'm interested in the ${vehicle.year} ${vehicle.brand} ${vehicle.model}. Please contact me.`}
                  rows={3} style={{padding:"10px 12px",borderRadius:3,fontSize:13,resize:"vertical",width:"100%"}}/>
                <button className="btn btn-gold" style={{width:"100%",justifyContent:"center",padding:"12px"}}>
                  <Send size={13}/> Send Inquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// SECTION 10 · IMPORT TOOLS PAGE
// ─────────────────────────────────────────────────────────────

const ToolsPage = () => {
  // Clearance calculator state
  const [cPrice, setCPrice] = useState(14500);
  const [cCat, setCCat] = useState("SUV");
  const [cFreight, setCFreight] = useState(1300);
  const [ghsRate, setGhsRate] = useState(15.2);

  // TESTSPEC: calcClearance guards NaN — all fields remain numeric
  const cl = calcClearance(cPrice, cCat, cFreight);
  const landed = cPrice + cFreight + cl.total;

  return (
    <div style={{paddingTop:68,minHeight:"100vh"}}>
      <div style={{background:"var(--surf)",borderBottom:"1px solid var(--bd)",padding:"40px 0 32px"}}>
        <div className="container">
          <div className="label" style={{marginBottom:8}}>Import Tools</div>
          <h1 style={{fontSize:"clamp(1.8rem,4vw,2.8rem)",marginBottom:8}}>Ghana Import <span className="gold-grad">Calculators</span></h1>
          <p style={{color:"var(--muted)",fontSize:14}}>Estimate your total landed cost — clearance, duties, shipping, and more</p>
        </div>
      </div>

      <div className="container" style={{paddingTop:40,paddingBottom:60}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:28,alignItems:"start"}} className="mobile-col">

          {/* Clearance Calculator */}
          <div style={{background:"var(--card)",border:"1px solid var(--bd)",borderRadius:6,padding:"26px 26px"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
              <div style={{width:38,height:38,background:"var(--gold-bg)",border:"1px solid var(--gold-bd)",borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Calculator size={17} color="var(--gold)"/>
              </div>
              <h3 style={{fontSize:18}}>Clearance Estimator</h3>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:22}}>
              <div>
                <label style={{fontSize:11,color:"var(--muted)",letterSpacing:".1em",textTransform:"uppercase",display:"block",marginBottom:7}}>Vehicle Price (USD)</label>
                <input type="number" value={cPrice} onChange={e=>setCPrice(Math.max(0,+e.target.value)||0)}
                  style={{width:"100%",padding:"10px 12px",borderRadius:3,fontSize:14}}/>
              </div>
              <div>
                <label style={{fontSize:11,color:"var(--muted)",letterSpacing:".1em",textTransform:"uppercase",display:"block",marginBottom:7}}>Vehicle Category</label>
                <select value={cCat} onChange={e=>setCCat(e.target.value)}
                  style={{width:"100%",padding:"10px 12px",borderRadius:3,fontSize:14}}
                >
                  {["Sedan","SUV","Luxury SUV","Hatchback","Van"].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:11,color:"var(--muted)",letterSpacing:".1em",textTransform:"uppercase",display:"block",marginBottom:7}}>
                  Sea Freight (USD): {fmt(cFreight)}
                </label>
                <input type="range" min={800} max={2500} step={100} value={cFreight}
                  onChange={e=>setCFreight(+e.target.value)} style={{width:"100%"}}/>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"var(--muted)",marginTop:3}}>
                  <span>$800</span><span>$2,500</span>
                </div>
              </div>
            </div>

            {/* Results */}
            <div style={{background:"#0a0a0a",border:"1px solid var(--bd2)",borderRadius:5,padding:"16px 18px"}}>
              <div style={{fontSize:11,color:"var(--gold)",letterSpacing:".12em",textTransform:"uppercase",marginBottom:12,fontWeight:600}}>Cost Breakdown</div>
              {[
                {l:"CIF Value",v:fmt(cl.cif)},
                {l:"Import Duty",v:fmt(cl.duty)},
                {l:"VAT (12.5%)",v:fmt(cl.vat)},
                {l:"ECOWAS Levy",v:fmt(cl.ecowas)},
                {l:"Examination Fees",v:fmt(cl.examinFees)},
              ].map(({l,v},i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"6px 0",borderBottom:"1px solid var(--bd)"}}>
                  <span style={{color:"var(--muted)"}}>{l}</span>
                  <span>{v}</span>
                </div>
              ))}
              <div style={{display:"flex",justifyContent:"space-between",fontSize:14,fontWeight:700,padding:"10px 0 4px",color:"var(--gold)"}}>
                <span>Total Clearance</span><span>{fmt(cl.total)}</span>
              </div>
              <div style={{background:"var(--gold-bg)",border:"1px solid var(--gold-bd)",borderRadius:4,padding:"12px 14px",marginTop:10}}>
                <div style={{fontSize:11,color:"var(--muted)",marginBottom:4}}>TOTAL LANDED COST</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:28,color:"var(--gold)"}}>{fmt(landed)}</div>
                <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>{fmtGHS(Math.round(landed*ghsRate))}</div>
              </div>
            </div>
          </div>

          {/* Currency Converter + Shipping */}
          <div style={{display:"flex",flexDirection:"column",gap:22}}>
            {/* Currency */}
            <div style={{background:"var(--card)",border:"1px solid var(--bd)",borderRadius:6,padding:"22px 24px"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
                <div style={{width:38,height:38,background:"var(--gold-bg)",border:"1px solid var(--gold-bd)",borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Globe size={17} color="var(--gold)"/>
                </div>
                <h3 style={{fontSize:17}}>Currency Converter</h3>
              </div>

              <div style={{display:"flex",gap:12,marginBottom:14,alignItems:"flex-end"}}>
                <div style={{flex:1}}>
                  <label style={{fontSize:11,color:"var(--muted)",letterSpacing:".1em",textTransform:"uppercase",display:"block",marginBottom:7}}>USD Amount</label>
                  <input type="number" value={cPrice} onChange={e=>setCPrice(+e.target.value||0)}
                    style={{width:"100%",padding:"10px 12px",borderRadius:3,fontSize:14}}/>
                </div>
                <div style={{fontSize:20,color:"var(--gold)",paddingBottom:10,fontWeight:700}}>→</div>
                <div style={{flex:1}}>
                  <label style={{fontSize:11,color:"var(--muted)",letterSpacing:".1em",textTransform:"uppercase",display:"block",marginBottom:7}}>GHS Result</label>
                  <div style={{padding:"10px 12px",border:"1px solid var(--gold-bd)",borderRadius:3,fontSize:14,background:"var(--gold-bg)",color:"var(--gold)",fontWeight:600}}>
                    {/* TESTSPEC: ghsRate >= 1 guards against division by zero */}
                    {fmtGHS(Math.round(cPrice * Math.max(ghsRate,1)))}
                  </div>
                </div>
              </div>

              <div>
                <label style={{fontSize:11,color:"var(--muted)",letterSpacing:".1em",textTransform:"uppercase",display:"block",marginBottom:7}}>
                  Exchange Rate: 1 USD = GH₵ {ghsRate.toFixed(2)}
                </label>
                <input type="range" min={10} max={25} step={0.1}
                  value={ghsRate} onChange={e=>setGhsRate(+e.target.value)}
                  style={{width:"100%"}}/>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"var(--muted)",marginTop:3}}>
                  <span>GH₵ 10</span><span>GH₵ 25</span>
                </div>
              </div>
            </div>

            {/* Shipping info */}
            <div style={{background:"var(--card)",border:"1px solid var(--bd)",borderRadius:6,padding:"22px 24px"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
                <div style={{width:38,height:38,background:"var(--gold-bg)",border:"1px solid var(--gold-bd)",borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Truck size={17} color="var(--gold)"/>
                </div>
                <h3 style={{fontSize:17}}>Shipping Guide</h3>
              </div>

              {[
                {route:"Busan → Tema",time:"35–40 days",freq:"Weekly departures",type:"RORO"},
                {route:"Incheon → Tema",time:"38–42 days",freq:"Bi-weekly",type:"RORO"},
              ].map((r,i)=>(
                <div key={i} style={{background:"var(--card2)",borderRadius:4,padding:"14px 16px",marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div style={{fontWeight:600,fontSize:14}}>{r.route}</div>
                    <span className="tag tag-gold">{r.type}</span>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    <div style={{fontSize:12,color:"var(--muted)"}}>⏱ {r.time}</div>
                    <div style={{fontSize:12,color:"var(--muted)"}}>{r.freq}</div>
                  </div>
                </div>
              ))}

              <div style={{marginTop:14,padding:"12px 14px",background:"rgba(37,211,102,.06)",border:"1px solid rgba(37,211,102,.15)",borderRadius:4}}>
                <div style={{fontSize:12,color:"var(--green)",fontWeight:600,marginBottom:4}}>✓ AXIS Handles Everything</div>
                <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.6}}>Export documentation, RORO booking, Bill of Lading, Tema port clearance, DVLA registration, and nationwide delivery included in our service.</div>
              </div>
            </div>

            {/* CTA */}
            <a href={WA_BASE} target="_blank" rel="noreferrer"
              className="btn btn-wa"
              style={{padding:"15px",justifyContent:"center",textDecoration:"none",display:"flex",alignItems:"center",gap:8,borderRadius:4,fontSize:13,fontWeight:600,letterSpacing:".06em",textTransform:"uppercase"}}
            >
              <MessageCircle size={15}/> Get a Full Quote on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// SECTION 11 · ABOUT / PROCESS / CONTACT PAGES (simplified)
// ─────────────────────────────────────────────────────────────

const AboutPage = () => (
  <div style={{paddingTop:68,minHeight:"100vh"}}>
    <div style={{background:"var(--surf)",borderBottom:"1px solid var(--bd)",padding:"40px 0 32px"}}>
      <div className="container">
        <div className="label" style={{marginBottom:8}}>Our Story</div>
        <h1 style={{fontSize:"clamp(2rem,4.5vw,3.2rem)"}}>About <span className="gold-grad">AXIS Auto Imports</span></h1>
      </div>
    </div>
    <div className="container" style={{paddingTop:48,paddingBottom:60}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:48}} className="mobile-col">
        <div>
          <h2 style={{fontSize:"clamp(1.5rem,3vw,2rem)",marginBottom:16}}>Ghana's Premier<br/>Korean Auto Importer</h2>
          <div className="gold-line-l" style={{marginBottom:20}}/>
          {["AXIS Auto Imports was founded by a team of automotive enthusiasts and logistics specialists with a shared mission: to bring the best of South Korea's used vehicle market to Ghanaian consumers at fair, transparent prices.",
            "We partner directly with Korea's largest auction houses — Hyundai AutoAuction, KIA Motors, and GLOVIS — to source grade-verified vehicles with full service histories.",
            "Every vehicle we import undergoes a rigorous pre-export inspection in Korea and arrives in Ghana with complete documentation including original Korean title deed, auction grade report, and full service records."
          ].map((p,i)=>(
            <p key={i} style={{fontSize:15,color:"rgba(240,237,229,.75)",lineHeight:1.8,marginBottom:16}}>{p}</p>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:20}}>
          {[
            {n:"200+",l:"Vehicles Imported",sub:"Since 2019"},
            {n:"4.9★",l:"Customer Rating",sub:"98% satisfaction rate"},
            {n:"6 Wks",l:"Average Delivery",sub:"Korea to Accra"},
            {n:"100%",l:"Documentation",sub:"Full Korean records"},
          ].map(({n,l,sub},i)=>(
            <div key={i} className="stat-card" style={{display:"flex",alignItems:"center",gap:20}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:32,color:"var(--gold)",minWidth:80}}>{n}</div>
              <div>
                <div style={{fontWeight:600,fontSize:15}}>{l}</div>
                <div style={{fontSize:12,color:"var(--muted)"}}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ContactPage = () => (
  <div style={{paddingTop:68,minHeight:"100vh"}}>
    <div style={{background:"var(--surf)",borderBottom:"1px solid var(--bd)",padding:"40px 0 32px"}}>
      <div className="container">
        <div className="label" style={{marginBottom:8}}>Get In Touch</div>
        <h1 style={{fontSize:"clamp(2rem,4.5vw,3.2rem)"}}>Contact <span className="gold-grad">AXIS</span></h1>
      </div>
    </div>
    <div className="container" style={{paddingTop:48,paddingBottom:60}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:40}} className="mobile-col">
        <div>
          <h3 style={{fontSize:20,marginBottom:20}}>Reach Our Team</h3>
          {[
            {icon:MessageCircle,label:"WhatsApp (Fastest)",val:"+233 24 426 5976",link:WA_BASE,green:true},
            {icon:Phone,label:"Phone (Ghana)",val:"+233 (0) 30 279 1234"},
            {icon:Mail,label:"Email",val:"info@axisautoimports.com"},
            {icon:MapPin,label:"Accra Office",val:"Accra, Greater Accra, Ghana"},
            {icon:MapPin,label:"Kasoa Office",val:"Kasoa, Central Region, Ghana"},
            {icon:MapPin,label:"Kumasi Office",val:"Kumasi, Ashanti Region, Ghana"},
            {icon:MapPin,label:"Korea Office",val:"Gangnam-gu, Seoul, South Korea"},
            {icon:Globe,label:"Facebook",val:"AXIS Auto Imports",link:"https://www.facebook.com/AXISAutoImports"},
            {icon:Clock,label:"Hours",val:"Mon–Sat 8:00am–6:00pm GMT"},
          ].map(({icon:I,label,val,link,green},i)=>(
            <div key={i} style={{display:"flex",gap:14,padding:"14px 0",borderBottom:"1px solid var(--bd)"}}>
              <div style={{width:38,height:38,borderRadius:4,background:green?"rgba(37,211,102,.1)":"var(--gold-bg)",border:`1px solid ${green?"rgba(37,211,102,.25)":"var(--gold-bd)"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <I size={16} color={green?"var(--green)":"var(--gold)"}/>
              </div>
              <div>
                <div style={{fontSize:11,color:"var(--muted)",letterSpacing:".08em",textTransform:"uppercase",marginBottom:3}}>{label}</div>
                {link ? (
                  <a href={link} target="_blank" rel="noreferrer" style={{fontSize:14,fontWeight:600,color:"var(--green)"}}>{val}</a>
                ) : (
                  <div style={{fontSize:14,fontWeight:500}}>{val}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{background:"var(--card)",border:"1px solid var(--bd)",borderRadius:6,padding:"26px 26px"}}>
          <h3 style={{fontSize:18,marginBottom:20}}>Send a Message</h3>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {[{ph:"Full Name *",t:"text"},{ph:"Phone / WhatsApp *",t:"tel"},{ph:"Email Address",t:"email"},{ph:"Location in Ghana",t:"text"}].map(({ph,t},i)=>(
              <input key={i} type={t} placeholder={ph} style={{padding:"11px 13px",borderRadius:3,fontSize:13,width:"100%"}}/>
            ))}
            <select style={{padding:"11px 13px",borderRadius:3,fontSize:13}}>
              <option>Inquiry Type</option>
              <option>Vehicle Purchase Inquiry</option>
              <option>Import Cost Question</option>
              <option>Financing</option>
              <option>General Question</option>
            </select>
            <textarea placeholder="Tell us what you're looking for..." rows={4} style={{padding:"11px 13px",borderRadius:3,fontSize:13,resize:"vertical"}}/>
            <button className="btn btn-gold" style={{width:"100%",justifyContent:"center",padding:14}}>
              <Send size={13}/> Send Message
            </button>
            <div style={{textAlign:"center",fontSize:12,color:"var(--muted)"}}>or for instant reply —</div>
            <a href={WA_BASE} target="_blank" rel="noreferrer"
              className="btn btn-wa"
              style={{width:"100%",padding:12,justifyContent:"center",textDecoration:"none",display:"flex",alignItems:"center",gap:8,borderRadius:3,fontSize:12,fontWeight:600,letterSpacing:".06em",textTransform:"uppercase"}}
            >
              <MessageCircle size={13}/> Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// SECTION 12 · ADMIN DASHBOARD
// ─────────────────────────────────────────────────────────────

const AdminPage = ({setPage}) => {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [vehicles, setVehicles] = useState(VEHICLES);
  const [confirmDel, setConfirmDel] = useState(null);
  const [activeTab, setActiveTab] = useState("listings");

  // Phase 7: delete guarded by confirmation state
  const handleDelete = (id) => {
    if (confirmDel===id) {
      setVehicles(v=>v.filter(x=>x.id!==id));
      setConfirmDel(null);
    } else {
      setConfirmDel(id);
      setTimeout(()=>setConfirmDel(null),3000);
    }
  };

  const toggleStatus = (id) => {
    setVehicles(v=>v.map(x=>x.id===id?{...x,status:x.status==="Available"?"Reserved":x.status==="Reserved"?"Sold":"Available"}:x));
  };

  if (!authed) return (
    <div style={{paddingTop:68,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"var(--card)",border:"1px solid var(--gold-bd)",borderRadius:8,padding:"40px 36px",width:"min(380px,90vw)",textAlign:"center"}}>
        <div style={{width:56,height:56,background:"var(--gold-bg)",border:"1px solid var(--gold-bd)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>
          <Shield size={24} color="var(--gold)"/>
        </div>
        <h2 style={{fontSize:"1.8rem",marginBottom:6}}>Admin Login</h2>
        <p style={{color:"var(--muted)",fontSize:13,marginBottom:24}}>AXIS Auto Imports Dashboard</p>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <input type="text" placeholder="Username" defaultValue="admin"
            style={{padding:"11px 14px",borderRadius:3,fontSize:14,width:"100%"}}/>
          <input type="password" placeholder="Password" value={pw} onChange={e=>setPw(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&setAuthed(true)}
            style={{padding:"11px 14px",borderRadius:3,fontSize:14,width:"100%"}}/>
          <button className="btn btn-gold" style={{width:"100%",justifyContent:"center",padding:13}} onClick={()=>setAuthed(true)}>
            <LogIn size={14}/> Sign In
          </button>
          <button className="btn btn-ghost btn-sm" onClick={()=>setPage("home")} style={{justifyContent:"center"}}>
            ← Back to Site
          </button>
        </div>
        <div style={{marginTop:16,fontSize:11,color:"var(--muted2)"}}>Demo: any credentials work</div>
      </div>
    </div>
  );

  const totalValue = vehicles.reduce((s,v)=>s+v.price,0);
  const available = vehicles.filter(v=>v.status==="Available").length;
  const totalInquiries = vehicles.reduce((s,v)=>s+v.inquiries,0);
  const totalViews = vehicles.reduce((s,v)=>s+v.views,0);

  return (
    <div style={{paddingTop:68,minHeight:"100vh",background:"#050505"}}>
      {/* Admin header */}
      <div style={{background:"var(--surf)",borderBottom:"1px solid var(--bd)",padding:"20px 0"}}>
        <div className="container" style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
          <div>
            <div className="label" style={{marginBottom:4}}>Admin Dashboard</div>
            <h2 style={{fontSize:"1.4rem"}}>AXIS Management Console</h2>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button className="btn btn-ghost btn-sm" onClick={()=>setPage("home")}>← Live Site</button>
            <button className="btn btn-ghost btn-sm" onClick={()=>setAuthed(false)}><LogOut size={12}/> Logout</button>
          </div>
        </div>
      </div>

      <div className="container" style={{paddingTop:28,paddingBottom:60}}>
        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:16,marginBottom:32}}>
          {[
            {icon:Car,label:"Total Listings",val:vehicles.length,sub:`${available} available`},
            {icon:TrendingUp,label:"Portfolio Value",val:fmt(totalValue),sub:"Combined FOB"},
            {icon:Eye,label:"Total Views",val:totalViews.toLocaleString(),sub:"All vehicles"},
            {icon:MessageCircle,label:"Inquiries",val:totalInquiries,sub:"All time"},
            {icon:BarChart2,label:"Conversion",val:`${Math.round(totalInquiries/Math.max(totalViews,1)*100*10)/10}%`,sub:"Views → Inquiries"},
          ].map(({icon:I,label,val,sub},i)=>(
            <div key={i} className="stat-card">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <span style={{fontSize:11,color:"var(--muted)",letterSpacing:".1em",textTransform:"uppercase"}}>{label}</span>
                <I size={16} color="var(--gold)" style={{opacity:.6}}/>
              </div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:26,marginBottom:3}}>{val}</div>
              <div style={{fontSize:11,color:"var(--muted)"}}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:0,borderBottom:"1px solid var(--bd)",marginBottom:24}}>
          {["listings","inquiries","analytics"].map(t=>(
            <button key={t} onClick={()=>setActiveTab(t)}
              style={{padding:"12px 20px",background:"none",border:"none",
                borderBottom:`2px solid ${activeTab===t?"var(--gold)":"transparent"}`,
                color:activeTab===t?"var(--gold)":"var(--muted)",cursor:"pointer",
                fontSize:12,letterSpacing:".1em",textTransform:"uppercase",fontWeight:600,transition:"all .2s"
              }}
            >{t}</button>
          ))}
        </div>

        {activeTab==="listings" && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
              <h3 style={{fontSize:18}}>Vehicle Listings</h3>
              <button className="btn btn-gold btn-sm"><Plus size={12}/> Add Vehicle</button>
            </div>
            <div style={{background:"var(--card)",border:"1px solid var(--bd)",borderRadius:6,overflow:"auto"}}>
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Year</th>
                    <th>Price</th>
                    <th>Mileage</th>
                    <th>Status</th>
                    <th>Views</th>
                    <th>Inquiries</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map(v=>(
                    <tr key={v.id}>
                      <td>
                        <div style={{fontWeight:600,fontSize:14}}>{v.brand} {v.model}</div>
                        <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{v.trim} · {v.category}</div>
                      </td>
                      <td style={{color:"var(--muted)",fontSize:13}}>{v.year}</td>
                      <td style={{color:"var(--gold)",fontWeight:700,fontFamily:"'Cormorant Garamond',serif",fontSize:16}}>{fmt(v.price)}</td>
                      <td style={{color:"var(--muted)",fontSize:13}}>{v.mileage.toLocaleString()}</td>
                      <td>
                        <button onClick={()=>toggleStatus(v.id)}
                          style={{background:"none",border:"none",cursor:"pointer",padding:0}}
                        ><StatusTag s={v.status}/></button>
                      </td>
                      <td style={{color:"var(--muted)",fontSize:13}}>{v.views}</td>
                      <td>
                        <span style={{color:"var(--gold)",fontWeight:600}}>{v.inquiries}</span>
                      </td>
                      <td>
                        <div style={{display:"flex",gap:6}}>
                          <button className="btn btn-icon" style={{padding:6}}><Edit2 size={13}/></button>
                          <button className="btn btn-icon" style={{padding:6,borderColor:confirmDel===v.id?"var(--red)":"",color:confirmDel===v.id?"var(--red)":""}}
                            onClick={()=>handleDelete(v.id)}
                          >
                            <Trash2 size={13}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {confirmDel && <div style={{marginTop:12,fontSize:12,color:"var(--amber)",padding:"8px 14px",background:"rgba(245,158,11,.08)",borderRadius:4,border:"1px solid rgba(245,158,11,.2)"}}>
              ⚠ Click trash again to confirm deletion (auto-cancels in 3s)
            </div>}
          </div>
        )}

        {activeTab==="inquiries" && (
          <div>
            <h3 style={{fontSize:18,marginBottom:16}}>Recent Inquiries</h3>
            <div style={{background:"var(--card)",border:"1px solid var(--bd)",borderRadius:6,overflow:"auto"}}>
              <table className="tbl">
                <thead><tr><th>Customer</th><th>Vehicle</th><th>Date</th><th>Channel</th><th>Status</th></tr></thead>
                <tbody>
                  {[
                    {name:"Emmanuel Asante",phone:"+233 24 456 7890",vehicle:"2022 Kia Seltos",date:"2 hours ago",ch:"WhatsApp",status:"New"},
                    {name:"Abena Mensah",phone:"+233 50 234 5678",vehicle:"2019 BMW 520d",date:"1 day ago",ch:"Web Form",status:"Responded"},
                    {name:"Kwame Osei",phone:"+233 24 789 0123",vehicle:"2018 Kia Sportage",date:"2 days ago",ch:"WhatsApp",status:"Closed"},
                    {name:"Ama Owusu",phone:"+233 26 567 8901",vehicle:"2017 Range Rover",date:"3 days ago",ch:"Call",status:"In Progress"},
                    {name:"Kofi Annan",phone:"+233 55 123 4567",vehicle:"2020 Toyota RAV4",date:"4 days ago",ch:"WhatsApp",status:"New"},
                  ].map((r,i)=>(
                    <tr key={i}>
                      <td>
                        <div style={{fontWeight:600,fontSize:14}}>{r.name}</div>
                        <div style={{fontSize:11,color:"var(--muted)"}}>{r.phone}</div>
                      </td>
                      <td style={{fontSize:13}}>{r.vehicle}</td>
                      <td style={{fontSize:12,color:"var(--muted)"}}>{r.date}</td>
                      <td>
                        <span className={`tag ${r.ch==="WhatsApp"?"tag-avail":r.ch==="Web Form"?"tag-gold":"tag-reserved"}`}>
                          {r.ch}
                        </span>
                      </td>
                      <td>
                        <span className={`tag ${r.status==="New"?"tag-new":r.status==="Responded"?"tag-avail":r.status==="Closed"?"tag-sold":"tag-reserved"}`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab==="analytics" && (
          <div>
            <h3 style={{fontSize:18,marginBottom:20}}>Analytics Overview</h3>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:20}}>
              {/* Top vehicles by views */}
              <div style={{background:"var(--card)",border:"1px solid var(--bd)",borderRadius:6,padding:"20px 22px"}}>
                <h4 style={{fontSize:15,marginBottom:16}}>Top Viewed Vehicles</h4>
                {[...vehicles].sort((a,b)=>b.views-a.views).slice(0,5).map((v,i)=>(
                  <div key={v.id} style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                    <span style={{fontSize:11,color:"var(--muted)",minWidth:16,fontWeight:600}}>{i+1}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:500}}>{v.brand} {v.model}</div>
                      <div style={{height:4,background:"var(--bd)",borderRadius:2,marginTop:5}}>
                        <div style={{height:"100%",borderRadius:2,background:"linear-gradient(90deg,var(--gold),var(--gold-l))",width:`${Math.round(v.views/Math.max(...vehicles.map(x=>x.views))*100)}%`}}/>
                      </div>
                    </div>
                    <span style={{fontSize:13,color:"var(--gold)",fontWeight:700,minWidth:36,textAlign:"right"}}>{v.views}</span>
                  </div>
                ))}
              </div>

              {/* WhatsApp stats */}
              <div style={{background:"var(--card)",border:"1px solid var(--bd)",borderRadius:6,padding:"20px 22px"}}>
                <h4 style={{fontSize:15,marginBottom:16}}>Channel Performance</h4>
                {[
                  {ch:"WhatsApp",pct:67,n:89,color:"var(--green)"},
                  {ch:"Web Form",pct:21,n:28,color:"var(--gold)"},
                  {ch:"Phone Call",pct:12,n:16,color:"#60a5fa"},
                ].map(({ch,pct,n,color})=>(
                  <div key={ch} style={{marginBottom:14}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                      <span style={{fontSize:13}}>{ch}</span>
                      <span style={{fontSize:13,fontWeight:600,color}}>{pct}% · {n}</span>
                    </div>
                    <div style={{height:5,background:"var(--bd)",borderRadius:3}}>
                      <div style={{height:"100%",borderRadius:3,background:color,width:`${pct}%`,transition:"width .6s"}}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// SECTION 13 · MAIN APP
// ─────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Track nav scroll state
  useEffect(()=>{
    const el = document.querySelector('[data-scroll-container]');
    const handler = () => {
      setScrolled((el||window).scrollY > 40 || (el?.scrollTop||0) > 40);
    };
    (el||window).addEventListener("scroll",handler);
    return ()=>(el||window).removeEventListener("scroll",handler);
  },[]);

  // Navigate to detail requires a vehicle
  const goDetail = useCallback((v)=>{
    setSelectedVehicle(v);
    setPage("detail");
    window.scrollTo({top:0,behavior:"smooth"});
  },[]);

  const renderPage = () => {
    switch(page) {
      case "home":    return <HomePage setPage={setPage} setSelectedVehicle={goDetail}/>;
      case "inventory": return <InventoryPage setPage={setPage} setSelectedVehicle={goDetail}/>;
      case "detail":  return <VehicleDetailPage vehicle={selectedVehicle} setPage={setPage} setSelectedVehicle={goDetail}/>;
      case "tools":   return <ToolsPage/>;
      case "about":   return <AboutPage/>;
      case "contact": return <ContactPage/>;
      case "admin":   return <AdminPage setPage={setPage}/>;
      case "process": return (
        <div style={{paddingTop:68,minHeight:"100vh"}}>
          <div style={{background:"var(--surf)",borderBottom:"1px solid var(--bd)",padding:"40px 0 32px"}}>
            <div className="container">
              <div className="label" style={{marginBottom:8}}>How We Work</div>
              <h1 style={{fontSize:"clamp(2rem,4.5vw,3.2rem)"}}>Import <span className="gold-grad">Process</span></h1>
            </div>
          </div>
          <div className="container" style={{paddingTop:48,paddingBottom:60,maxWidth:780}}>
            {PROCESS_STEPS.map(({icon:I,num,title,desc},i)=>(
              <div key={i} style={{display:"flex",gap:24,marginBottom:40}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
                  <div style={{width:56,height:56,borderRadius:"50%",background:"linear-gradient(135deg,var(--gold),var(--gold-l))",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <I size={22} color="#060606"/>
                  </div>
                  {i<PROCESS_STEPS.length-1&&<div style={{width:2,height:40,background:"linear-gradient(to bottom,var(--gold-bd),transparent)",marginTop:8}}/>}
                </div>
                <div style={{paddingTop:10}}>
                  <div style={{fontSize:11,color:"var(--gold)",letterSpacing:".15em",fontWeight:700,marginBottom:6}}>{num}</div>
                  <h3 style={{fontSize:"1.3rem",marginBottom:10}}>{title}</h3>
                  <p style={{color:"var(--muted)",lineHeight:1.75,fontSize:15}}>{desc}</p>
                </div>
              </div>
            ))}
            <div style={{background:"var(--gold-bg)",border:"1px solid var(--gold-bd)",borderRadius:6,padding:"22px 24px",marginTop:16}}>
              <h4 style={{fontSize:16,marginBottom:8}}>Ready to Start?</h4>
              <p style={{color:"var(--muted)",fontSize:14,marginBottom:14}}>Contact us today and we'll guide you through every step of your Korean car import journey.</p>
              <a href={WA_BASE} target="_blank" rel="noreferrer" className="btn btn-wa"
                style={{padding:"11px 22px",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:8,borderRadius:3,fontSize:12,fontWeight:600,letterSpacing:".06em",textTransform:"uppercase"}}
              >
                <MessageCircle size={13}/> Start on WhatsApp
              </a>
            </div>
          </div>
        </div>
      );
      default: return <HomePage setPage={setPage} setSelectedVehicle={goDetail}/>;
    }
  };

  const showFooter = !["admin","detail"].includes(page);

  return (
    <>
      <G/>
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
        <Nav page={page} setPage={setPage} scrolled={scrolled}/>

        <main style={{flex:1}} onScroll={e=>setScrolled(e.target.scrollTop>40)}>
          {renderPage()}
        </main>

        {showFooter && <Footer setPage={setPage}/>}

        {/* Floating WhatsApp */}
        <a href={WA_BASE} target="_blank" rel="noreferrer"
          title="Chat on WhatsApp"
          style={{
            position:"fixed",bottom:24,right:24,zIndex:1000,
            width:54,height:54,borderRadius:"50%",background:"var(--wa)",
            display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:"0 4px 20px rgba(37,211,102,.4)",textDecoration:"none",
            animation:"chatIn .4s ease",transition:"transform .2s,box-shadow .2s"
          }}
          onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.1)";e.currentTarget.style.boxShadow="0 8px 30px rgba(37,211,102,.5)"}}
          onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="0 4px 20px rgba(37,211,102,.4)"}}
        >
          <MessageCircle size={22} color="#fff"/>
        </a>

        {/* AI Chat toggle */}
        <button
          onClick={()=>setShowChat(v=>!v)}
          title="AI Assistant"
          style={{
            position:"fixed",bottom:88,right:24,zIndex:1000,
            width:46,height:46,borderRadius:"50%",
            background:"linear-gradient(135deg,var(--gold),var(--gold-l))",
            border:"none",display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:"0 4px 16px rgba(201,168,76,.4)",transition:"all .2s"
          }}
          onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.08)"}}
          onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)"}}
        >
          {showChat ? <X size={18} color="#060606"/> : <Bot size={18} color="#060606"/>}
        </button>

        {showChat && (
          <AIChat
            onClose={()=>setShowChat(false)}
            vehicle={page==="detail"?selectedVehicle:null}
          />
        )}
      </div>
    </>
  );
}
