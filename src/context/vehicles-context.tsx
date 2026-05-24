"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { vehicles as seedVehicles } from "@/data/vehicles";
import type { Vehicle } from "@/types/vehicle";

interface VehiclesContextValue {
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  getVehicleById: (id: number) => Vehicle | undefined;
  toggleVehicleStatus: (id: number) => void;
  deleteVehicle: (id: number) => void;
}

const VehiclesContext = createContext<VehiclesContextValue | null>(null);

export function VehiclesProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(seedVehicles);

  const getVehicleById = useCallback(
    (id: number) => vehicles.find((v) => v.id === id),
    [vehicles]
  );

  const toggleVehicleStatus = useCallback((id: number) => {
    setVehicles((v) =>
      v.map((x) =>
        x.id === id
          ? {
              ...x,
              status:
                x.status === "Available"
                  ? "Reserved"
                  : x.status === "Reserved"
                    ? "Sold"
                    : "Available",
            }
          : x
      )
    );
  }, []);

  const deleteVehicle = useCallback((id: number) => {
    setVehicles((v) => v.filter((x) => x.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      vehicles,
      setVehicles,
      getVehicleById,
      toggleVehicleStatus,
      deleteVehicle,
    }),
    [vehicles, getVehicleById, toggleVehicleStatus, deleteVehicle]
  );

  return (
    <VehiclesContext.Provider value={value}>{children}</VehiclesContext.Provider>
  );
}

export function useVehicles() {
  const ctx = useContext(VehiclesContext);
  if (!ctx) throw new Error("useVehicles must be used within VehiclesProvider");
  return ctx;
}
