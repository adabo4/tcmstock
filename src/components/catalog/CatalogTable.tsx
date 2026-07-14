import AddToInventoryPopover from "../stock/AddToInventoryPopover";
import { ShoppingCart } from "lucide-react";
import type { CatalogTableProps } from "../../types/catalog";
import { PRODUCT_TYPE_LABELS } from "../../types/product";

export default function CatalogTable({
  products,
  selectedProduct,
  addingProductId,
  onAdd,
  onSelectProduct,
  onCloseProduct,
}: CatalogTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-white">
            <tr className="border-b border-slate-200 text-left text-sm font-semibold text-slate-500">
              <th className="px-8 py-5">Code</th>
              <th className="px-8 py-5">Name ↑</th>
              <th className="px-8 py-5">Type</th>
              <th className="px-8 py-5 text-right">Add</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60"
              >
                <td className="px-8 py-5">
                  <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-bold text-slate-700">
                    {product.code}
                  </span>
                </td>

                <td className="px-8 py-5">
                  <p className="font-bold text-slate-950">{product.name}</p>
                </td>

                <td className="px-8 py-5 text-slate-600">
                  {PRODUCT_TYPE_LABELS[product.productType]}
                </td>

                <td className="relative px-8 py-5 text-right">
                  <button
                    type="button"
                    onClick={() => onSelectProduct(product)}
                    disabled={addingProductId === product.id}
                    className="inline-flex h-12 items-center gap-2 rounded-xl border border-primary px-4 font-bold text-primary transition hover:bg-blue hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ShoppingCart size={18} />
                    Add
                  </button>

                  {selectedProduct?.id === product.id && (
                    <AddToInventoryPopover
                      product={product}
                      adding={addingProductId === product.id}
                      onClose={onCloseProduct}
                      onAdd={onAdd}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
