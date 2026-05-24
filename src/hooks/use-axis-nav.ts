"use client";

import { usePathname, useRouter } from "next/navigation";
import type { Vehicle } from "@/types/vehicle";

export const axisRoutes = {
  home: "/",
  inventory: "/inventory",
  process: "/import-process",
  tools: "/tools",
  about: "/about",
  contact: "/contact",
  admin: "/admin",
} as const;

export type AxisPageKey = keyof typeof axisRoutes | "detail";

export function pathToPageKey(pathname: string): AxisPageKey {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/inventory/")) return "detail";
  if (pathname === "/inventory") return "inventory";
  if (pathname === "/import-process") return "process";
  if (pathname === axisRoutes.tools) return "tools";
  if (pathname === axisRoutes.about) return "about";
  if (pathname === axisRoutes.contact) return "contact";
  if (pathname === axisRoutes.admin) return "admin";
  return "home";
}

export function useAxisNav() {
  const router = useRouter();
  const pathname = usePathname();
  const page = pathToPageKey(pathname);

  const go = (key: AxisPageKey) => {
    if (key === "detail") return;
    const path = axisRoutes[key as keyof typeof axisRoutes];
    if (path) {
      router.push(path);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goDetail = (vehicle: Vehicle) => {
    router.push(`/inventory/${vehicle.id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return { page, go, goDetail, pathname };
}
