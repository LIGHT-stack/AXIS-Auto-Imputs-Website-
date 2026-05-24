"use client";

import { VehiclesProvider } from "@/context/vehicles-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return <VehiclesProvider>{children}</VehiclesProvider>;
}
