import type { Vehicle } from "@/types/vehicle";
import { siteConfig } from "@/config/site";

export function vehicleProductJsonLd(vehicle: Vehicle) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${vehicle.year} ${vehicle.brand} ${vehicle.model}`,
    description: vehicle.description,
    image: vehicle.imgs?.[0] ?? vehicle.img,
    brand: { "@type": "Brand", name: vehicle.brand },
    offers: {
      "@type": "Offer",
      price: vehicle.price,
      priceCurrency: "USD",
      availability:
        vehicle.status === "Available"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `${siteConfig.url}/inventory/${vehicle.id}`,
    },
  };
}
