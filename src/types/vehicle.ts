export type VehicleStatus = "Available" | "Reserved" | "Sold";

export type VehicleCategory =
  | "Sedan"
  | "SUV"
  | "Luxury SUV"
  | "Hatchback"
  | "Van";

export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: number;
  trim: string;
  mileage: number;
  fuelType: string;
  transmission: string;
  drivetrain: string;
  category: VehicleCategory | string;
  price: number;
  status: VehicleStatus;
  engineCC: number;
  horsepower: number;
  torque: string;
  fuelEconomy: string;
  seats: number;
  color: string;
  doors: number;
  features: string[];
  auctionGrade: string;
  description: string;
  img: string;
  imgs: string[];
  views: number;
  inquiries: number;
}

export interface VehicleFilters {
  brand?: string;
  category?: string;
  fuel?: string;
  transmission?: string;
  drivetrain?: string;
  status?: string;
  minYear?: number;
  maxYear?: number;
  minPrice?: number;
  maxPrice?: number;
  maxMileage?: number;
  search?: string;
}
