import type { ProductType } from "./product";

export type MyStockItem = {
  id: number;
  userId: number;
  tabletCatalogId: number;
  fullQuantity: number;
  openedQuantity: number;
  createdAt: string;
  updatedAt: string;
  tabletCatalog: {
    id: number;
    code: string;
    name: string;
    productType: ProductType;
  };
};

export type MyStockQuery = {
  search?: string;
  type?: ProductType | "";
  page?: number;
  limit?: number;
};

export type MyStockResponse = {
  items: MyStockItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type AddToStockDto = {
  tabletCatalogId: number;
  fullQuantity: number;
  openedQuantity: number;
};

export type UpdateStockDto = {
  fullQuantity?: number;
  openedQuantity?: number;
};

export type QuantityField = "fullQuantity" | "openedQuantity";

export type MyStockViewProps = {
  items: MyStockItem[];
  updatingItemId: number | null;
  deletingItemId: number | null;
  onQuantityChange: (
    item: MyStockItem,
    field: QuantityField,
    newValue: number,
  ) => void | Promise<void>;
  onDelete: (item: MyStockItem) => void | Promise<void>;
};

export type MyStockCardProps = {
  item: MyStockItem;
  updating: boolean;
  deleting: boolean;
  onQuantityChange: (
    item: MyStockItem,
    field: QuantityField,
    newValue: number,
  ) => void | Promise<void>;
  onDelete: (item: MyStockItem) => void | Promise<void>;
};
