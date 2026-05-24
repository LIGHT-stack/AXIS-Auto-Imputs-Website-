/** Shipping routes and estimates — Korea → Tema Port */

export const SHIPPING_ROUTES = [
  { origin: "Busan", destination: "Tema", daysMin: 35, daysMax: 40, type: "RORO" },
  { origin: "Incheon", destination: "Tema", daysMin: 38, daysMax: 42, type: "RORO" },
] as const;

export function estimateFreightUsd(category: string): number {
  if (category === "Luxury SUV") return 1600;
  if (category === "Van") return 1400;
  return 1200;
}
