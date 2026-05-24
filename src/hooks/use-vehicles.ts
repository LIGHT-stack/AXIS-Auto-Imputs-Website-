"use client";

import { useEffect, useState } from "react";
import type { Vehicle } from "@/types/vehicle";

export function useVehicles(params?: { brand?: string; status?: string }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const qs = new URLSearchParams();
    if (params?.brand) qs.set("brand", params.brand);
    if (params?.status) qs.set("status", params.status);

    fetch(`/api/vehicles?${qs}`)
      .then((r) => r.json())
      .then((json) => setVehicles(json.data ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [params?.brand, params?.status]);

  return { vehicles, loading, error };
}
