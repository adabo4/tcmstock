import {
  BookOpen,
  PillBottle,
  CircleDot,
  Droplets,
  FlaskConical,
  Pill,
  SprayCan,
  type LucideIcon,
  Plus,
  Minus,
  Tablets,
} from "lucide-react";
import { createElement, useState } from "react";

import type { CatalogProduct, ProductType } from "../../types/product";
import { PRODUCT_TYPE_LABELS } from "../../types/product";

type CatalogCardProps = {
  product: CatalogProduct;
  adding: boolean;
  onAdd: (
    product: CatalogProduct,
    fullQuantity: number,
    openedQuantity: number,
  ) => Promise<void>;
};

// function getProductTypeIcon(productType: ProductType): LucideIcon {
//   switch (productType) {
//     case "TABLET":
//       return Pill;

//     case "DRINK":
//       return PillBottle;

//     case "SYRUP":
//       return FlaskConical;

//     case "OIL":
//       return Droplets;

//     case "CREAM":
//       return SprayCan;

//     case "CELL_SALT":
//       return CircleDot;

//     case "BOOK":
//       return BookOpen;

//     default:
//       return Pill;
//   }
// }

const PRODUCT_TYPE_ICONS: Record<ProductType, LucideIcon> = {
  TABLET: Tablets,
  DRINK: PillBottle,
  SYRUP: FlaskConical,
  OIL: Droplets,
  CREAM: SprayCan,
  CELL_SALT: CircleDot,
  BOOK: BookOpen,
  SUPPOSITORY: Pill,
};

export default function CatalogCard({
  product,
  adding,
  onAdd,
}: CatalogCardProps) {
  const [fullQuantity, setFullQuantity] = useState(0);
  const [openedQuantity, setOpenedQuantity] = useState(0);
  const [error, setError] = useState("");

  // const ProductIcon = getProductTypeIcon(product.productType);

  const canAdd = fullQuantity > 0 || openedQuantity > 0;

  async function handleAdd() {
    if (!canAdd) {
      return;
    }

    try {
      setError("");

      await onAdd(product, fullQuantity, openedQuantity);

      setFullQuantity(0);
      setOpenedQuantity(0);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to add product.",
      );
    }
  }

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-xl bg-blue/40 text-primary">
          {createElement(PRODUCT_TYPE_ICONS[product.productType], {
            size: 20,
          })}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">
              {product.code}
            </span>

            <span className="text-xs text-slate-500">
              {PRODUCT_TYPE_LABELS[product.productType]}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-slate-950">
            {product.name}
          </h3>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <QuantityRow
          label="Opened"
          value={openedQuantity}
          disabled={adding}
          onDecrease={() =>
            setOpenedQuantity((current) => Math.max(0, current - 1))
          }
          onIncrease={() => setOpenedQuantity((current) => current + 1)}
        />

        <QuantityRow
          label="Unopened"
          value={fullQuantity}
          disabled={adding}
          onDecrease={() =>
            setFullQuantity((current) => Math.max(0, current - 1))
          }
          onIncrease={() => setFullQuantity((current) => current + 1)}
        />
      </div>

      {canAdd && (
        <button
          type="button"
          onClick={() => void handleAdd()}
          disabled={adding}
          className="mt-4 w-full rounded-xl bg-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {adding ? "Adding..." : "Add to inventory"}
        </button>
      )}

      {error && (
        <p className="mt-2 text-center text-sm text-red-500">{error}</p>
      )}
    </article>
  );
}

type QuantityRowProps = {
  label: string;
  value: number;
  disabled: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
};

function QuantityRow({
  label,
  value,
  disabled,
  onDecrease,
  onIncrease,
}: QuantityRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-slate-500">{label}</span>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDecrease}
          disabled={disabled || value === 0}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={`Decrease ${label}`}
        >
          <Minus size={17} />
        </button>

        <span className="w-8 text-center text-lg font-semibold text-slate-950">
          {value}
        </span>

        <button
          type="button"
          onClick={onIncrease}
          disabled={disabled}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={`Increase ${label}`}
        >
          <Plus size={17} />
        </button>
      </div>
    </div>
  );
}
