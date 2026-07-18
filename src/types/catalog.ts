// components/catalog/types.ts

import type { CatalogProduct } from "../types/product";

export type CatalogViewProps = {
  products: CatalogProduct[];
  addingProductId: number | null;
  onAdd: (product: CatalogProduct, quantity: number) => Promise<void>;
};

// export type CatalogTableProps = {
//   products: CatalogProduct[];
//   selectedProduct: CatalogProduct | null;
//   addingProductId: number | null;

//   onSelectProduct: (product: CatalogProduct) => void;
//   onCloseProduct: () => void;

//   onAdd: (
//     product: CatalogProduct,
//     fullQuantity: number,
//     openedQuantity: number,
//   ) => Promise<void>;
// };

export type CatalogTableProps = {
  products: CatalogProduct[];
  addingProductId: number | null;
  onSelectProduct: (product: CatalogProduct) => void;
};
