import { authFetch } from "../lib/api";
import type {
  AddToStockDto,
  MyStockItem,
  MyStockQuery,
  MyStockResponse,
  UpdateStockDto,
} from "../types/stock";

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

export function addToMyStockRequest(dto: AddToStockDto): Promise<MyStockItem> {
  return authFetch<MyStockItem>("/tablets/my", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export function updateMyStockRequest(
  stockItemId: number,
  dto: UpdateStockDto,
): Promise<MyStockItem> {
  return authFetch<MyStockItem>(`/tablets/my/${stockItemId}`, {
    method: "PATCH",
    body: JSON.stringify(dto),
  });
}

export function removeFromMyStockRequest(
  stockItemId: number,
): Promise<{ message: string }> {
  return authFetch<{ message: string }>(`/tablets/my/${stockItemId}`, {
    method: "DELETE",
  });
}
