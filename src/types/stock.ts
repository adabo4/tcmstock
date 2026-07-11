import type { ProductType } from "./product";

export type TabletCatalogItem = {
  id: number;
  code: string;
  name: string;
  productType: ProductType;
};

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
    productType: string;
  };
};
