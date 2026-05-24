/**
 * Seed Prisma from vehicles.seed.ts — run after `npx prisma db push`
 * Usage: npx tsx scripts/seed-inventory.ts
 */
import { seedVehicles } from "../src/data/vehicles.seed";

console.log(`Would seed ${seedVehicles.length} vehicles — connect Prisma client here.`);
