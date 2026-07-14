import type { MyStockViewProps } from "../../types/stock";
import MyStockCard from "./MyStockCard";

export default function MyStockCards({
  items,
  updatingItemId,
  deletingItemId,
  onQuantityChange,
  onDelete,
}: MyStockViewProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center">
        <p className="font-semibold text-slate-800">
          Na sklade nie sú žiadne produkty.
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Pridať produkt z katalógu.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <MyStockCard
          key={item.id}
          item={item}
          updating={updatingItemId === item.id}
          deleting={deletingItemId === item.id}
          onQuantityChange={onQuantityChange}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
