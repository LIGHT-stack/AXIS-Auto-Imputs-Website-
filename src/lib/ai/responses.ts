import { WA_BASE } from "@/lib/whatsapp";

const AI_RESPONSES: Record<string, string[]> = {
  kia: [
    "The most popular Kia models we currently have are the Sportage AWD (2018, $14,500) and Seltos Noblesse (2022, $19,900). Both have excellent auction grades. Which would you like to know more about?",
    "Kia vehicles imported from Korea typically have strong resale value in Ghana. The Sportage is especially popular for its ground clearance on rough roads.",
  ],
  hyundai: [
    "We have the Hyundai Tucson (2017 Diesel, $11,800) and Hyundai Accent (2017, $7,200) available. The Tucson is great for fuel economy with 6.8L/100km. Interested in either?",
  ],
  price: [
    "Our inventory ranges from $7,200 for the Hyundai Accent to $29,900 for the BMW 520d. Total landed cost in Ghana is typically 40–60% above the USD vehicle price after clearance and duties.",
    "The most affordable vehicle right now is the 2017 Hyundai Accent at $7,200 — total landed cost approximately GH₵ 95,000.",
  ],
  clear: [
    "Ghana import clearance is typically 20–35% of the CIF value depending on vehicle class. Use our Import Tools calculator for a precise estimate. For a $14,500 vehicle, clearance + duties is around $4,800–$6,500.",
  ],
  ship: [
    "Shipping from South Korea (Incheon/Busan port) to Tema Port, Ghana takes 35–40 days on RORO vessels. Shipping cost is approximately $1,200–$1,600 depending on vehicle size.",
  ],
  bmw: [
    "We have the 2019 BMW 520d M Sport at $29,900 — Carbon Black, M Aerodynamics package, Harman Kardon audio. Auction grade 4. Would you like full specs or a landed cost estimate?",
  ],
  range: [
    "The 2017 Range Rover Evoque SE is available at $24,500. AWD, diesel, 47,900km. Terrain Response system makes it excellent for Ghana's road conditions. Grade 4 certified.",
  ],
  finance: [
    "Yes — we partner with selected Ghanaian banks and microfinance institutions. Typical terms: 20–30% deposit, 12–36 month repayment. Contact us directly on WhatsApp for current rates.",
  ],
  default: [
    "Hi! I'm the AXIS AI assistant. I can help you find the right vehicle, estimate import costs, or explain our process. What are you looking for?",
    "Great question! For the most accurate answer, I'd recommend speaking with our team directly on WhatsApp. Type 'WhatsApp' and I'll connect you.",
    "I'm here to help you find your perfect Korean import. Try asking about specific brands, your budget, or import costs!",
  ],
};

export function getAIResponse(msg: string): string {
  const m = (msg || "").trim().toLowerCase();
  if (!m) return "";
  for (const [k, v] of Object.entries(AI_RESPONSES)) {
    if (k !== "default" && m.includes(k))
      return v[Math.floor(Math.random() * v.length)];
  }
  if (m.includes("whatsapp") || m.includes("contact"))
    return `You can reach our team directly at: ${WA_BASE}`;
  const def = AI_RESPONSES.default;
  return def[Math.floor(Math.random() * def.length)];
}
