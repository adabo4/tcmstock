// src/api/stockLocations.ts
import { authFetch } from "../lib/api";
import type { StockLocation } from "../types/stockLocations";

export function getStockLocationsRequest(): Promise<StockLocation[]> {
  return authFetch("/stock-locations");
}
