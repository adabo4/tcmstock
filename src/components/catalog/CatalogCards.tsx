import type { CatalogProduct } from "../../types/product";
import CatalogCard from "./CatalogCard";

type CatalogCardsProps = {
  products: CatalogProduct[];
  addingProductId: number | null;
  onAdd: (
    product: CatalogProduct,
    fullQuantity: number,
    openedQuantity: number,
  ) => Promise<void>;
};

export default function CatalogCards({
  products,
  addingProductId,
  onAdd,
}: CatalogCardsProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center">
        <p className="font-semibold text-slate-800">
          Nenašli sa žiadne produkty.
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Skúste zmeniť vyhľadávanie alebo typ produktu.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {products.map((product) => (
        <CatalogCard
          key={product.id}
          product={product}
          adding={addingProductId === product.id}
          onAdd={onAdd}
        />
      ))}
    </div>
  );
}
