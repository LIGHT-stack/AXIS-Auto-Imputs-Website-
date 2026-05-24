"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bot, MessageCircle, X } from "lucide-react";
import { SiteNav } from "@/components/axis/site-nav";
import {
  AIChatWidget,
  SiteFooter,
} from "@/components/axis/views";
import { useVehicles } from "@/context/vehicles-context";
import { pathToPageKey } from "@/hooks/use-axis-nav";
import { WA_BASE } from "@/lib/whatsapp";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const page = pathToPageKey(pathname);
  const { getVehicleById } = useVehicles();
  const [showChat, setShowChat] = useState(false);

  const detailId = pathname.match(/^\/inventory\/(\d+)/)?.[1];
  const detailVehicle = detailId
    ? getVehicleById(Number(detailId))
    : null;

  const showFooter = !["admin", "detail"].includes(page);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SiteNav />
      <main style={{ flex: 1 }}>{children}</main>
      {showFooter && <SiteFooter />}
      <a
        href={WA_BASE}
        target="_blank"
        rel="noreferrer"
        title="Chat on WhatsApp"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
          width: 54,
          height: 54,
          borderRadius: "50%",
          background: "var(--wa)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(37,211,102,.4)",
          textDecoration: "none",
          animation: "chatIn .4s ease",
          transition: "transform .2s,box-shadow .2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 8px 30px rgba(37,211,102,.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(37,211,102,.4)";
        }}
      >
        <MessageCircle size={22} color="#fff" />
      </a>
      <button
        onClick={() => setShowChat((v) => !v)}
        title="AI Assistant"
        style={{
          position: "fixed",
          bottom: 88,
          right: 24,
          zIndex: 1000,
          width: 46,
          height: 46,
          borderRadius: "50%",
          background: "linear-gradient(135deg,var(--gold),var(--gold-l))",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 16px rgba(201,168,76,.4)",
          transition: "all .2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        {showChat ? <X size={18} color="#060606" /> : <Bot size={18} color="#060606" />}
      </button>
      {showChat && (
        <AIChatWidget
          onClose={() => setShowChat(false)}
          vehicle={page === "detail" ? detailVehicle : null}
        />
      )}
    </div>
  );
}
