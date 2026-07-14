import { useState } from "react";

import type { CatalogProduct } from "../../types/product";
import QuantityStepper from "./QuantityStepper";

type AddToInventoryPopoverProps = {
  product: CatalogProduct;
  adding: boolean;
  onClose: () => void;
  onAdd: (
    product: CatalogProduct,
    fullQuantity: number,
    openedQuantity: number,
  ) => Promise<void>;
};

export default function AddToInventoryPopover({
  product,
  adding,
  onClose,
  onAdd,
}: AddToInventoryPopoverProps) {
  const [fullQuantity, setFullQuantity] = useState(0);
  const [openedQuantity, setOpenedQuantity] = useState(0);
  const [error, setError] = useState("");

  async function handleAddToStock() {
    if (fullQuantity <= 0 && openedQuantity <= 0) {
      setError("Select at least one package.");
      return;
    }

    try {
      setError("");

      await onAdd(product, fullQuantity, openedQuantity);

      setFullQuantity(0);
      setOpenedQuantity(0);

      onClose();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update stock.",
      );
    }
  }

  return (
    <div className="absolute right-8 top-[72px] z-30 w-96 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-2xl">
      <div className="absolute -top-2 right-10 h-4 w-4 rotate-45 border-l border-t border-slate-200 bg-white" />

      <h3 className="text-lg font-bold text-slate-950">Add to inventory</h3>

      <p className="mt-1 font-semibold text-primary">
        {product.name} ({product.code})
      </p>

      <div className="mt-6 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <p className="font-semibold text-slate-800">Full packs</p>

          <QuantityStepper
            value={fullQuantity}
            onDecrease={() =>
              setFullQuantity((previous) => Math.max(0, previous - 1))
            }
            onIncrease={() => setFullQuantity((previous) => previous + 1)}
            disabled={adding}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className="font-semibold text-slate-800">Opened packs</p>

          <QuantityStepper
            value={openedQuantity}
            onDecrease={() =>
              setOpenedQuantity((previous) => Math.max(0, previous - 1))
            }
            onIncrease={() => setOpenedQuantity((previous) => previous + 1)}
            disabled={adding}
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={adding}
          className="h-12 rounded-xl border border-slate-200 px-6 font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={() => void handleAddToStock()}
          disabled={adding || (fullQuantity === 0 && openedQuantity === 0)}
          className="h-12 rounded-xl bg-blue px-6 font-semibold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {adding ? "Adding..." : "Add to stock"}
        </button>
      </div>
    </div>
  );
}
