"use client";

import { Star } from "lucide-react";

export function StatusTag({ s }: { s: string }) {
  if (s === "Available")
    return (
      <span className="tag tag-avail">
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "var(--green)",
            display: "inline-block",
          }}
        />
        Available
      </span>
    );
  if (s === "Reserved") return <span className="tag tag-reserved">Reserved</span>;
  return <span className="tag tag-sold">Sold</span>;
}

export function Stars({ n }: { n: number }) {
  return (
    <span style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={13}
          fill={i <= n ? "#C9A84C" : "none"}
          color={i <= n ? "#C9A84C" : "#444"}
        />
      ))}
    </span>
  );
}

export function Divider({ color }: { color?: string }) {
  return (
    <div
      style={{
        height: "1px",
        background: `linear-gradient(90deg,${color || "var(--gold)"},transparent)`,
        margin: "8px 0",
      }}
    />
  );
}
