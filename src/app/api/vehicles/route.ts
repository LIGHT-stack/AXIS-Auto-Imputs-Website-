import { NextResponse } from "next/server";
import { seedVehicles } from "@/data/vehicles.seed";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brand = searchParams.get("brand");
  const status = searchParams.get("status");

  let vehicles = seedVehicles;
  if (brand && brand !== "All") {
    vehicles = vehicles.filter((v) => v.brand === brand);
  }
  if (status && status !== "All") {
    vehicles = vehicles.filter((v) => v.status === status);
  }

  return NextResponse.json({ data: vehicles, count: vehicles.length });
}
