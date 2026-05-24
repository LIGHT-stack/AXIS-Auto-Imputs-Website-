"use client";

import {
  Fuel,
  Gauge,
  Heart,
  Layers,
  MessageCircle,
  Settings,
} from "lucide-react";
import { fmt } from "@/lib/format";
import { waLink } from "@/lib/whatsapp";
import type { Vehicle } from "@/types/vehicle";
import { Divider, StatusTag } from "@/components/axis/ui";

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
  return (
    <div className="v-card" onClick={() => onClick(v)}>
      <div
        style={{
          position: "relative",
          height: 200,
          overflow: "hidden",
          background: "#0a0a0a",
        }}
      >
        <img
          src={v.img}
          alt={`${v.year} ${v.brand} ${v.model}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform .4s",
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
          loading="lazy"
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top,rgba(0,0,0,.5) 0%,transparent 60%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            display: "flex",
            gap: 6,
          }}
        >
          <StatusTag s={v.status} />
          <span className="tag tag-gold">{v.year}</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave?.(v.id);
          }}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "rgba(0,0,0,.5)",
            border: "1px solid rgba(255,255,255,.15)",
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Heart
            size={13}
            fill={saved ? "#C9A84C" : "none"}
            color={saved ? "#C9A84C" : "#aaa"}
          />
        </button>

        <div
          style={{
            position: "absolute",
            bottom: 10,
            right: 12,
            fontSize: 10,
            letterSpacing: ".1em",
            background: "rgba(0,0,0,.7)",
            border: "1px solid var(--gold-bd)",
            borderRadius: 2,
            padding: "2px 7px",
            color: "var(--gold)",
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          Grade {v.auctionGrade}
        </div>
      </div>

      <div style={{ padding: "16px 18px 18px" }}>
        <div style={{ marginBottom: 8 }}>
          <span
            className="label"
            style={{ fontSize: 10, letterSpacing: ".12em" }}
          >
            {v.brand}
          </span>
          <div
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontWeight: 600,
              fontSize: 20,
              lineHeight: 1.2,
              margin: "3px 0 4px",
            }}
          >
            {v.model}{" "}
            <span style={{ fontWeight: 400, opacity: 0.7 }}>{v.trim}</span>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "6px 16px",
            marginBottom: 14,
          }}
        >
          {[
            { icon: Gauge, val: `${v.mileage.toLocaleString()} km` },
            { icon: Fuel, val: v.fuelType },
            {
              icon: Settings,
              val: v.transmission.includes("Auto") ? "Automatic" : "Manual",
            },
            { icon: Layers, val: v.drivetrain },
          ].map(({ icon: I, val }, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 12,
                color: "var(--muted)",
              }}
            >
              <I size={12} color="var(--muted2)" />
              {val}
            </div>
          ))}
        </div>

        <Divider />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                color: "var(--muted)",
                letterSpacing: ".06em",
                textTransform: "uppercase",
                marginBottom: 1,
              }}
            >
              Price
            </div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontWeight: 700,
                fontSize: 24,
                color: "var(--gold)",
              }}
            >
              {fmt(v.price)}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <a
              href={waLink(v)}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="btn btn-wa btn-sm"
              style={{
                borderRadius: 3,
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "8px 12px",
                textDecoration: "none",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: ".06em",
                textTransform: "uppercase",
              }}
            >
              <MessageCircle size={12} /> Inquire
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
