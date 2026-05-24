"use client";

import { notFound, useParams } from "next/navigation";
import { VehicleDetailView } from "@/components/axis/views";
import { useVehicles } from "@/context/vehicles-context";

export default function VehicleDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const { getVehicleById } = useVehicles();
  const vehicle = getVehicleById(id);

  if (!vehicle) notFound();

  return <VehicleDetailView vehicle={vehicle} />;
}
