/**
 * Dealer Management System / marketplace feed adapter.
 * Implement parsers for AutoTrader, DealerCenter, or custom XML/JSON feeds.
 */

export type DmsVehicleRecord = {
  externalId: string;
  vin?: string;
  stockNumber?: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  images: string[];
};

export async function fetchDmsInventory(
  _feedUrl: string
): Promise<DmsVehicleRecord[]> {
  // TODO: fetch + normalize to Vehicle type
  return [];
}
