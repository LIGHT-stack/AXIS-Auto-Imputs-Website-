"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogIn, Menu, MessageCircle, X } from "lucide-react";
import { axisRoutes, pathToPageKey } from "@/hooks/use-axis-nav";
import { usePathname } from "next/navigation";
import { WA_BASE } from "@/lib/whatsapp";

const links = [
  { key: "home", label: "Home", href: axisRoutes.home },
  { key: "inventory", label: "Inventory", href: axisRoutes.inventory },
  { key: "process", label: "Import Process", href: axisRoutes.process },
  { key: "tools", label: "Tools", href: axisRoutes.tools },
  { key: "about", label: "About", href: axisRoutes.about },
  { key: "contact", label: "Contact", href: axisRoutes.contact },
] as const;

export function SiteNav() {
  const pathname = usePathname();
  const page = pathToPageKey(pathname);
  const [mob, setMob] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    handler();
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`nav ${scrolled ? "nav-scrolled" : "nav-top"}`}
      style={{ padding: "0 24px" }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 68,
        }}
      >
        <Link
          href={axisRoutes.home}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              background: "linear-gradient(135deg,#C9A84C,#E8C86A)",
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Cormorant Garamond',serif",
              fontWeight: 700,
              fontSize: 16,
              color: "#060606",
            }}
          >
            AX
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontWeight: 700,
                fontSize: 18,
                letterSpacing: ".08em",
                lineHeight: 1,
              }}
            >
              AXIS
            </div>
            <div
              style={{
                fontSize: 9,
                letterSpacing: ".18em",
                textTransform: "uppercase",
                color: "var(--gold)",
                lineHeight: 1.2,
              }}
            >
              AUTO IMPORTS
            </div>
          </div>
        </Link>

        <div className="hide-mobile" style={{ display: "flex", gap: 32 }}>
          {links.map((l) => (
            <Link
              key={l.key}
              href={l.href}
              className={`nav-link${page === l.key ? " active" : ""}`}
              style={{ color: page === l.key ? "var(--wht)" : "var(--muted)" }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            className="hide-mobile btn btn-gold btn-sm"
            onClick={() => window.open(WA_BASE, "_blank")}
          >
            <MessageCircle size={13} /> WhatsApp
          </button>
          <Link href={axisRoutes.admin} className="hide-mobile btn btn-ghost btn-sm">
            <LogIn size={13} /> Admin
          </Link>
          <button
            onClick={() => setMob((v) => !v)}
            style={{
              background: "none",
              border: "1px solid var(--bd)",
              padding: 8,
              borderRadius: 3,
              display: "block",
              lineHeight: 0,
            }}
            aria-label="Toggle menu"
          >
            {mob ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mob && (
        <div
          style={{
            background: "rgba(7,7,7,.97)",
            borderTop: "1px solid var(--bd)",
            padding: "20px 24px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {links.map((l) => (
            <Link
              key={l.key}
              href={l.href}
              onClick={() => setMob(false)}
              style={{
                padding: "12px 0",
                borderBottom: "1px solid var(--bd)",
                fontSize: 15,
                fontFamily: "'Cormorant Garamond',serif",
                fontWeight: 600,
                color: page === l.key ? "var(--gold)" : "var(--wht)",
                cursor: "pointer",
              }}
            >
              {l.label}
            </Link>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button
              className="btn btn-gold btn-sm"
              onClick={() => window.open(WA_BASE, "_blank")}
            >
              <MessageCircle size={13} /> WhatsApp
            </button>
            <Link
              href={axisRoutes.admin}
              className="btn btn-ghost btn-sm"
              onClick={() => setMob(false)}
            >
              Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
