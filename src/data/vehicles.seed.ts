import type { Vehicle } from "@/types/vehicle";

/** Seed inventory — replace with Prisma/CMS in production */
export const seedVehicles: Vehicle[] = [
  {
    id: 1,
    brand: "Kia",
    model: "Sportage AWD",
    year: 2018,
    trim: "GT-Line",
    mileage: 62400,
    fuelType: "Gasoline",
    transmission: "Automatic (6-speed)",
    drivetrain: "AWD",
    category: "SUV",
    price: 14500,
    status: "Available",
    engineCC: 2000,
    horsepower: 185,
    torque: "241 Nm",
    fuelEconomy: "12.4L/100km",
    seats: 5,
    color: "Platinum Silver",
    doors: 5,
    features: ["Sunroof", "Heated Seats", "Apple CarPlay"],
    auctionGrade: "4",
    description: "Sporty Kia Sportage from Seoul dealer network.",
    img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80",
    imgs: ["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80"],
    views: 412,
    inquiries: 18,
  },
];
