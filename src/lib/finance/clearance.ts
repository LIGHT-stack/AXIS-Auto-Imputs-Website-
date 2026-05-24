export interface ClearanceBreakdown {
  cif: number;
  duty: number;
  vat: number;
  ecowas: number;
  examinFees: number;
  total: number;
}

export function calcClearance(
  priceUSD: number,
  category: string,
  freight = 0
): ClearanceBreakdown {
  const price = Math.max(Number(priceUSD) || 0, 0);
  const fr = Math.max(Number(freight) || 1200, 0);
  const cif = price + fr + Math.round(price * 0.005);
  const levy =
    category === "Luxury SUV" ? 0.35 : category === "Sedan" ? 0.2 : 0.25;
  const duty = Math.round(cif * levy);
  const vat = Math.round((cif + duty) * 0.125);
  const ecowas = Math.round(cif * 0.005);
  const examinFees = 450;
  const total = duty + vat + ecowas + examinFees;
  return { cif, duty, vat, ecowas, examinFees, total };
}
