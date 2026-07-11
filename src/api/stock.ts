import { authFetch } from "../lib/api";
import type { MyStockQuery, MyStockResponse } from "../types/stock";

export function getMyStockRequest(
  query: MyStockQuery = {},
): Promise<MyStockResponse> {
  const { search, type, page = 1, limit = 15 } = query;

  const params = new URLSearchParams();

  if (search?.trim()) {
    params.set("search", search.trim());
  }

  if (type) {
    params.set("type", type);
  }

  params.set("page", String(page));
  params.set("limit", String(limit));

  return authFetch<MyStockResponse>(`/tablets/my?${params.toString()}`);
}
