export const siteConfig = {
  name: "AXIS Auto Imports",
  description:
    "Premium Korean vehicle imports to Ghana. Direct from Seoul auction houses to your driveway in Accra.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_GH",
  keywords: [
    "used cars Ghana",
    "Korean car import",
    "Kia import Accra",
    "Hyundai import Ghana",
    "Tema port clearance",
    "second hand cars Accra",
  ],
  links: {
    whatsapp: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "233244265976"}`,
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "https://www.facebook.com/AXISAutoImports",
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "info@axisautoimports.com",
  },
} as const;
