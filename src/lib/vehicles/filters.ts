import type { Vehicle, VehicleFilters } from "@/types/vehicle";

export function filterVehicles(
  vehicles: Vehicle[],
  filters: VehicleFilters
): Vehicle[] {
  if (!Array.isArray(vehicles)) return [];
  return vehicles.filter((v) => {
    if (filters.brand && filters.brand !== "All" && v.brand !== filters.brand)
      return false;
    if (
      filters.category &&
      filters.category !== "All" &&
      v.category !== filters.category
    )
      return false;
    if (filters.fuel && filters.fuel !== "All" && v.fuelType !== filters.fuel)
      return false;
    if (
      filters.transmission &&
      filters.transmission !== "All" &&
      !v.transmission.includes(filters.transmission)
    )
      return false;
    if (
      filters.drivetrain &&
      filters.drivetrain !== "All" &&
      v.drivetrain !== filters.drivetrain
    )
      return false;
    if (filters.status && filters.status !== "All" && v.status !== filters.status)
      return false;
    if (filters.minYear && v.year < +filters.minYear) return false;
    if (filters.maxYear && v.year > +filters.maxYear) return false;
    if (filters.maxPrice && v.price > +filters.maxPrice) return false;
    if (filters.minPrice && v.price < +filters.minPrice) return false;
    if (filters.maxMileage && v.mileage > +filters.maxMileage) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (
        !`${v.brand} ${v.model} ${v.year} ${v.trim}`.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });
}

export function sortVehicles(
  vehicles: Vehicle[],
  sort: string
): Vehicle[] {
  const v = [...vehicles];
  if (sort === "cheapest") return v.sort((a, b) => a.price - b.price);
  if (sort === "expensive") return v.sort((a, b) => b.price - a.price);
  if (sort === "mileage") return v.sort((a, b) => a.mileage - b.mileage);
  if (sort === "oldest") return v.sort((a, b) => a.year - b.year);
  return v.sort((a, b) => b.year - a.year);
}
