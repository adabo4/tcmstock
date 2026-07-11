import { authFetch } from "../lib/api";
import type { MyStockItem } from "../types/stock";

export function getMyStockRequest() {
  return authFetch<MyStockItem[]>("/tablets/my");
}
