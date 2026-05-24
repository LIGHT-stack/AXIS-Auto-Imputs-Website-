import { fmt } from "@/lib/format";
import type { Vehicle } from "@/types/vehicle";

const number =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "233244123456";

export const WA_BASE = `https://wa.me/${number}`;

export function waLink(vehicle: Vehicle) {
  return `${WA_BASE}?text=${encodeURIComponent(
    `Hi AXIS Auto Imports! I'm interested in the ${vehicle.year} ${vehicle.brand} ${vehicle.model} (${fmt(vehicle.price)}). Please send more details.`
  )}`;
}
