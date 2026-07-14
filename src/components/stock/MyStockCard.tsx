import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Trash2,
} from "lucide-react";

import { PRODUCT_TYPE_LABELS } from "../../types/product";
import type { MyStockCardProps, MyStockItem } from "../../types/stock";

function getStockStatus(item: MyStockItem) {
  const total = item.fullQuantity + item.openedQuantity;

  if (total === 0) {
    return {
      label: "Out of stock",
      icon: AlertCircle,
      className: "bg-red-50 text-red-600",
    };
  }

  if (total <= 2) {
    return {
      label: "Low stock",
      icon: Clock3,
      className: "bg-amber-50 text-amber-600",
    };
  }

  return {
    label: "In stock",
    icon: CheckCircle2,
    className: "bg-green-50 text-green-600",
  };
}

export default function MyStockCard({
  item,
  onQuantityChange,
  onDelete,
}: MyStockCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const status = getStockStatus(item);
  const StatusIcon = status.icon;

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <button
            type="button"
            className="min-w-0 flex-1 text-left"
            onClick={() => setIsOpen((current) => !current)}
            aria-expanded={isOpen}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600">
                {item.tabletCatalog.code}
              </span>

              <span className="text-sm text-slate-500">
                {PRODUCT_TYPE_LABELS[item.tabletCatalog.productType]}
              </span>
            </div>

            <h3 className="mt-4 text-xl font-bold text-slate-900">
              {item.tabletCatalog.name}
            </h3>

            <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-sm text-slate-500">
              <span>
                <strong className="text-base text-slate-900">
                  {item.fullQuantity}
                </strong>{" "}
                full
              </span>

              <span aria-hidden="true">•</span>

              <span>
                <strong className="text-base text-slate-900">
                  {item.openedQuantity}
                </strong>{" "}
                opened
              </span>
            </div>

            <div
              className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${status.className}`}
            >
              <StatusIcon size={17} />
              {status.label}
            </div>
          </button>

          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => onDelete(item)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[var(--primary)] transition hover:bg-red-50 hover:text-red-500"
              aria-label={`Delete ${item.tabletCatalog.name}`}
            >
              <Trash2 size={19} />
            </button>

            <button
              type="button"
              onClick={() => setIsOpen((current) => !current)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[var(--primary)]"
              aria-label={isOpen ? "Collapse product" : "Expand product"}
              aria-expanded={isOpen}
            >
              <ChevronDown
                size={20}
                className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 px-5 py-4">
          <QuantityRow
            label="Full packages"
            value={item.fullQuantity}
            onDecrease={() =>
              onQuantityChange(
                item,
                "fullQuantity",
                Math.max(0, item.fullQuantity - 1),
              )
            }
            onIncrease={() =>
              onQuantityChange(item, "fullQuantity", item.fullQuantity + 1)
            }
          />

          <div className="my-4 border-t border-slate-100" />

          <QuantityRow
            label="Opened packages"
            value={item.openedQuantity}
            onDecrease={() =>
              onQuantityChange(
                item,
                "openedQuantity",
                Math.max(0, item.openedQuantity - 1),
              )
            }
            onIncrease={() =>
              onQuantityChange(item, "openedQuantity", item.openedQuantity + 1)
            }
          />
        </div>
      )}
    </article>
  );
}

type QuantityRowProps = {
  label: string;
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

function QuantityRow({
  label,
  value,
  onDecrease,
  onIncrease,
}: QuantityRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-medium text-slate-600">{label}</span>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDecrease}
          disabled={value === 0}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-blue text-xl font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          −
        </button>

        <span className="min-w-8 text-center text-lg font-bold text-slate-900">
          {value}
        </span>

        <button
          type="button"
          onClick={onIncrease}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-blue text-xl font-bold text-white"
        >
          +
        </button>
      </div>
    </div>
  );
}
