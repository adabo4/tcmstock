import { apiFetch } from "../lib/api";
import type { CatalogProduct, ProductType } from "../types/product";

export type CatalogResponse = {
  items: CatalogProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type GetCatalogParams = {
  search?: string;
  type?: ProductType;
  page?: number;
  limit?: number;
};

export function getCatalogRequest(params: GetCatalogParams = {}) {
  const searchParams = new URLSearchParams();

  if (params.search) {
    searchParams.set("search", params.search);
  }

  if (params.type) {
    searchParams.set("type", params.type);
  }

  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("limit", String(params.limit ?? 15));

  return apiFetch<CatalogResponse>(
    `/tablets/catalog?${searchParams.toString()}`,
  );
}
