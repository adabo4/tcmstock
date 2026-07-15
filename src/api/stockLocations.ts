// src/api/stockLocations.ts
import { authFetch } from "../lib/api";
import type { StockLocation } from "../types/stockLocations";

export function getStockLocationsRequest(): Promise<StockLocation[]> {
  return authFetch("/stock-locations");
}
export type CreateStockLocationDto = {
  name: string;
};

export type UpdateStockLocationDto = {
  name: string;
};

export function createStockLocationRequest(
  dto: CreateStockLocationDto,
): Promise<StockLocation> {
  return authFetch<StockLocation>("/stock-locations", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export function updateStockLocationRequest(
  id: number,
  dto: UpdateStockLocationDto,
): Promise<StockLocation> {
  return authFetch<StockLocation>(`/stock-locations/${id}`, {
    method: "PATCH",
    body: JSON.stringify(dto),
  });
}

export function setDefaultStockLocationRequest(
  id: number,
): Promise<StockLocation> {
  return authFetch<StockLocation>(`/stock-locations/${id}/default`, {
    method: "PATCH",
  });
}

export function deleteStockLocationRequest(
  id: number,
): Promise<{ message: string }> {
  return authFetch<{ message: string }>(`/stock-locations/${id}`, {
    method: "DELETE",
  });
}
