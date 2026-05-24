// @ts-nocheck — migrated from legacy AxisApp.jsx; gradual strict typing planned
"use client";

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

function AIChat({onClose, vehicle}) {
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
}

export function Hero() {
  const { go } = usePageNav();
  // TESTSPEC: slide bounded by modulo — never out of range
  const [idx, setIdx] = useState(0);
  const total = heroSlides.length;
  useEffect(()=>{
    const t = setInterval(()=>setIdx(i=>(i+1)%total),5500);
    return ()=>clearInterval(t);
  },[total]);
  const slide = heroSlides[idx];

  return (
    <div style={{position:"relative",height:"100vh",minHeight:620,overflow:"hidden"}}>
      {heroSlides.map((s,i)=>(
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
            <Link href="/inventory" className="btn btn-gold" style={{padding:"14px 32px",display:"inline-flex",alignItems:"center",justifyContent:"center"}}>
              <Car size={15}/> Browse Inventory
            </Link>
            <button className="btn btn-ghost" onClick={()=>go("tools")} style={{padding:"14px 28px"}}>
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
        {heroSlides.map((_,i)=>(
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
}

export function FeaturedVehicles() {
  const { vehicles, goDetail } = usePageNav();
  const [saved, setSaved] = useState([]);
  const featured = vehicles.filter(v=>v.status!=="Sold").slice(0,4);
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
              onClick={v=>{goDetail(v);}}
            />
          ))}
        </div>

        <div style={{textAlign:"center",marginTop:40}}>
          <Link href="/inventory" className="btn btn-ghost" style={{padding:"13px 36px",display:"inline-flex",alignItems:"center",gap:8}}>
            View All Inventory <ArrowRight size={14}/>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function WhyUs() { return (
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
}

export function ImportProcessSection() {
  const { vehicles, go, goDetail, router } = usePageNav();
 return (
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
          <button className="btn btn-gold" onClick={()=>go("process")} style={{padding:"13px 28px"}}>
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
}

export function Testimonials() { return (
  <section className="section">
    <div className="container">
      <div style={{textAlign:"center",marginBottom:56}}>
        <div className="label" style={{marginBottom:12}}>Testimonials</div>
        <h2 style={{fontSize:"clamp(2rem,4vw,3rem)",marginBottom:12}}>Customer <span className="gold-grad">Stories</span></h2>
        <div className="gold-line" style={{margin:"0 auto"}}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:24}}>
        {testimonials.map((t,i)=>(
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
}

export function FAQSection() {
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
          {faqs.map((f,i)=>(
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
}

export function CTABanner() {
  const { vehicles, go, goDetail, router } = usePageNav();
 return (
  <section style={{padding:"80px 0",background:"linear-gradient(135deg,#0a0a0a 0%,#111 50%,#0a0a0a 100%)",borderTop:"1px solid var(--gold-bd)",borderBottom:"1px solid var(--gold-bd)"}}>
    <div className="container" style={{textAlign:"center"}}>
      <div className="label" style={{marginBottom:12}}>Ready to Import?</div>
      <h2 style={{fontSize:"clamp(2rem,4.5vw,3.4rem)",marginBottom:16}}>Your Premium Korean Car<br/><span className="gold-grad">Awaits in Accra</span></h2>
      <p style={{color:"var(--muted)",maxWidth:480,margin:"0 auto 32px",fontSize:15,lineHeight:1.7}}>
        Join 200+ satisfied customers who've imported premium vehicles from Korea with AXIS. Transparent pricing, expert guidance, zero surprises.
      </p>
      <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
        <Link href="/inventory" className="btn btn-gold" style={{padding:"14px 32px",display:"inline-flex",alignItems:"center",justifyContent:"center"}}>
          <Car size={14}/> Browse Inventory
        </Link>
        <a href={WA_BASE} target="_blank" rel="noreferrer" className="btn btn-wa"
          style={{padding:"14px 28px",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:8,fontSize:12,fontWeight:600,letterSpacing:".1em",textTransform:"uppercase",borderRadius:3}}
        >
          <MessageCircle size={14}/> Chat on WhatsApp
        </a>
      </div>
    </div>
  </section>
);
}

export function SiteFooter() {
  const { vehicles, go, goDetail, router } = usePageNav();
 return (
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
            <div key={t} onClick={()=>go("inventory")} style={{fontSize:13,color:"var(--muted)",marginBottom:9,cursor:"pointer",transition:"color .2s"}}
              onMouseEnter={e=>e.target.style.color="var(--wht)"}
              onMouseLeave={e=>e.target.style.color="var(--muted)"}
            >{t}</div>
          ))}
        </div>

        {/* Services */}
        <div>
          <h5 style={{fontSize:11,letterSpacing:".15em",textTransform:"uppercase",color:"var(--gold)",marginBottom:16}}>Services</h5>
          {["Import Process","Cost Calculator","Shipping Info","Port Clearance","Financing Options","Vehicle Inspection"].map(t=>(
            <div key={t} onClick={()=>go("tools")} style={{fontSize:13,color:"var(--muted)",marginBottom:9,cursor:"pointer",transition:"color .2s"}}
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
          <div style={{marginTop:16}}>
            <a href="https://www.facebook.com/AXISAutoImports" target="_blank" rel="noreferrer" style={{fontSize:13,color:"var(--muted)",textDecoration:"underline"}}>
              Facebook: AXIS Auto Imports
            </a>
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
}

export function HomeView() {
  const { vehicles, go, goDetail, router } = usePageNav();
 return (
  <>
    <Hero />
    <FeaturedVehicles />
    <WhyUs/>
    <ImportProcessSection />
    <Testimonials/>
    <FAQSection/>
    <CTABanner />
  </>
);
}

// ─────────────────────────────────────────────────────────────
// SECTION 8 · INVENTORY PAGE
// ─────────────────────────────────────────────────────────────

export function InventoryView() {
  const { vehicles, go, goDetail, router } = usePageNav();

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [saved, setSaved] = useState([]);
  const toggle = id => setSaved(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);

  const f = v => setFilters(p=>({...p,...v}));
  const clear = () => setFilters({});

  // TESTSPEC: result always Array, never undefined
  const results = useMemo(()=>sortVehicles(filterVehicles(vehicles,filters),sort),[filters,sort]);

  const brands = ["All",...new Set(vehicles.map(v=>v.brand))];
  const cats = ["All",...new Set(vehicles.map(v=>v.category))];
  const fuels = ["All",...new Set(vehicles.map(v=>v.fuelType))];

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
          <p style={{color:"var(--muted)",fontSize:14}}>Korean-sourced premium vehicles ready for Ghana import · {vehicles.length} total listings</p>
        </div>
      </div>

      <div className="container" style={{paddingTop:36,paddingBottom:60}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
          {/* Results count */}
          <div style={{fontSize:13,color:"var(--muted)"}}>
            <span style={{color:"var(--wht)",fontWeight:600}}>{results.length}</span> of {vehicles.length} vehicles
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
                    onClick={v=>{goDetail(v);}}
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

export function VehicleDetailView({ vehicle }: { vehicle: Vehicle }) {
  const { vehicles, go, goDetail, router } = usePageNav();

  const [imgIdx, setImgIdx] = useState(0);
  const [showCalc, setShowCalc] = useState(false);
  const [saved, setSaved] = useState(false);
  if (!vehicle) { router.replace("/inventory"); return null; }

  const imgs = vehicle.imgs||[vehicle.img];
  const clearance = calcClearance(vehicle.price, vehicle.category);
  const shipping = vehicle.category==="Luxury SUV"?1600:1200;
  const landed = vehicle.price + shipping + clearance.total;

  const similar = vehicles.filter(v=>v.id!==vehicle.id&&(v.brand===vehicle.brand||v.category===vehicle.category)).slice(0,3);

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
          <span onClick={()=>go("home")} style={{cursor:"pointer",transition:"color .2s"}} onMouseEnter={e=>e.target.style.color="var(--wht)"} onMouseLeave={e=>e.target.style.color="var(--muted)"}>Home</span>
          <ChevronRight size={12}/>
          <span onClick={()=>go("inventory")} style={{cursor:"pointer",transition:"color .2s"}} onMouseEnter={e=>e.target.style.color="var(--wht)"} onMouseLeave={e=>e.target.style.color="var(--muted)"}>Inventory</span>
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
                      onClick={() => { goDetail(v); setImgIdx(0); }}
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

export function ToolsView() {
  const { vehicles, go, goDetail, router } = usePageNav();

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

export function AboutView() { return (
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
          <h2 style={{fontSize:"clamp(1.5rem,3vw,2rem)",marginBottom:16}}>Ghana&apos;s Premier<br/>Korean Auto Importer</h2>
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
}

export function ContactView() { return (
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
}

// ─────────────────────────────────────────────────────────────
// SECTION 12 · ADMIN DASHBOARD
// ─────────────────────────────────────────────────────────────

export function AdminView() {
  const { vehicles, go, router } = usePageNav();
  const { toggleVehicleStatus, deleteVehicle } = useVehicles();

  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  
  const [confirmDel, setConfirmDel] = useState(null);
  const [activeTab, setActiveTab] = useState("listings");

  // Phase 7: delete guarded by confirmation state
  const handleDelete = (id) => {
    if (confirmDel===id) {
      deleteVehicle(id);
      setConfirmDel(null);
    } else {
      setConfirmDel(id);
      setTimeout(()=>setConfirmDel(null),3000);
    }
  };

  const toggleStatus = toggleVehicleStatus;

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
          <button className="btn btn-ghost btn-sm" onClick={()=>go("home")} style={{justifyContent:"center"}}>
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
            <button className="btn btn-ghost btn-sm" onClick={()=>go("home")}>← Live Site</button>
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
}

export function ImportProcessView() {
  const { go } = useAxisNav();
  return (
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
              <p style={{color:"var(--muted)",fontSize:14,marginBottom:14}}>Contact us today and we&apos;ll guide you through every step of your Korean car import journey.</p>
              <a href={WA_BASE} target="_blank" rel="noreferrer" className="btn btn-wa"
                style={{padding:"11px 22px",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:8,borderRadius:3,fontSize:12,fontWeight:600,letterSpacing:".06em",textTransform:"uppercase"}}
              >
                <MessageCircle size={13}/> Start on WhatsApp
              </a>
            </div>
          </div>
        </div>
  );
}

export function AIChatWidget({ onClose, vehicle }: { onClose: () => void; vehicle?: Vehicle | null }) {
  return <AIChat onClose={onClose} vehicle={vehicle} />;
}
