function getStockStatus(total: number) {
  if (total === 0) return "Out of stock";
  if (total <= 2) return "Low stock";
  return "In stock";
}

function getStatusClass(total: number) {
  if (total === 0) return "bg-red-50 text-red-700";
  if (total <= 2) return "bg-amber-50 text-amber-700";
  return "bg-green-50 text-green-700";
}
import { Minus, Plus, Trash2 } from "lucide-react";
import type { MyStockViewProps } from "../../types/stock";

export default function MyStockTable({
  items,
  updatingItemId,
  deletingItemId,
  onQuantityChange,
  onDelete,
}: MyStockViewProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">My Stock</h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage your current inventory
          </p>
        </div>

        <button className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover">
          Add product
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl bg-slate-50 p-8 text-center">
          <p className="font-semibold text-slate-700">Your stock is empty.</p>

          <p className="mt-1 text-sm text-slate-500">
            Add a product from the catalog.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-sm text-slate-500">
                <th className="px-4 font-medium">Code</th>
                <th className="px-4 font-medium">Product</th>
                <th className="px-4 font-medium">Type</th>
                <th className="px-4 font-medium">Full</th>
                <th className="px-4 font-medium">Opened</th>
                <th className="px-4 font-medium">Total</th>
                <th className="px-4 font-medium">Status</th>
                <th className="px-4 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => {
                const total = item.fullQuantity + item.openedQuantity;

                return (
                  <tr key={item.id} className="rounded-2xl bg-slate-50">
                    <td className="rounded-l-2xl px-4 py-4 font-semibold text-slate-700">
                      {item.tabletCatalog.code}
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-950">
                        {item.tabletCatalog.name}
                      </p>

                      <p className="text-sm text-slate-500">
                        Stock ID: {item.id}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {item.tabletCatalog.productType}
                    </td>

                    <td className="px-4 py-4">
                      <QuantityControl
                        value={item.fullQuantity}
                        disabled={updatingItemId === item.id}
                        onDecrease={() =>
                          onQuantityChange(
                            item,
                            "fullQuantity",
                            item.fullQuantity - 1,
                          )
                        }
                        onIncrease={() =>
                          onQuantityChange(
                            item,
                            "fullQuantity",
                            item.fullQuantity + 1,
                          )
                        }
                      />
                    </td>

                    <td className="px-4 py-4">
                      <QuantityControl
                        value={item.openedQuantity}
                        disabled={updatingItemId === item.id}
                        onDecrease={() =>
                          onQuantityChange(
                            item,
                            "openedQuantity",
                            item.openedQuantity - 1,
                          )
                        }
                        onIncrease={() =>
                          onQuantityChange(
                            item,
                            "openedQuantity",
                            item.openedQuantity + 1,
                          )
                        }
                      />
                    </td>

                    <td className="px-4 py-4 text-lg font-bold text-slate-950">
                      {total}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                          total,
                        )}`}
                      >
                        {getStockStatus(total)}
                      </span>
                    </td>

                    <td className="rounded-r-2xl px-4 py-4">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => onDelete(item)}
                          disabled={deletingItemId === item.id}
                          aria-label={`Delete ${item.tabletCatalog.name}`}
                          className="flex h-10 w-10 items-center justify-center rounded-xl text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

type QuantityControlProps = {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  disabled?: boolean;
};

function QuantityControl({
  value,
  onDecrease,
  onIncrease,
  disabled = false,
}: QuantityControlProps) {
  return (
    <div className="flex w-fit items-center rounded-xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={onDecrease}
        disabled={disabled || value === 0}
        className="flex h-9 w-9 items-center justify-center text-slate-500 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus size={16} />
      </button>

      <span className="w-8 text-center text-sm font-bold text-slate-950">
        {value}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        disabled={disabled}
        className="flex h-9 w-9 items-center justify-center text-slate-500 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
