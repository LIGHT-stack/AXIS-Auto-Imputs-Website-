"use client";

import dynamic from "next/dynamic";

const AxisApp = dynamic(() => import("./AxisApp"), { ssr: false });

export function LegacyApp() {
  return <AxisApp />;
}
