export type ProductType =
  | "TABLET"
  | "DRINK"
  | "SYRUP"
  | "OIL"
  | "CREAM"
  | "CELL_SALT"
  | "BOOK";

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  TABLET: "Tablety",
  DRINK: "Nápoje",
  SYRUP: "Sirupy",
  OIL: "Oleje",
  CREAM: "Krémy",
  CELL_SALT: "Schüsslerove soli",
  BOOK: "Knihy",
};

export type CatalogProduct = {
  id: number;
  code: string;
  name: string;
  productType: ProductType;
};
