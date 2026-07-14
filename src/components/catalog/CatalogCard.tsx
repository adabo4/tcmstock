// import { useState } from "react";
// import {
//   Beaker,
//   Book,
//   Droplet,
//   Flower2,
//   Minus,
//   Pill,
//   Plus,
//   Sparkles,
// } from "lucide-react";

// import type { CatalogProduct, ProductType } from "../../types/product";
// import { PRODUCT_TYPE_LABELS } from "../../types/product";

// type CatalogCardProps = {
//   product: CatalogProduct;
//   adding: boolean;
//   onAdd: (
//     product: CatalogProduct,
//     fullQuantity: number,
//     openedQuantity: number,
//   ) => Promise<void>;
// };
// function getProductTypeIcon(type: ProductType) {
//   switch (type) {
//     case "TABLET":
//       return Pill;
//     case "DRINK":
//       return Droplet;
//     case "SYRUP":
//       return Beaker;
//     case "OIL":
//       return Flower2;
//     case "CREAM":
//       return Sparkles;
//     case "CELL_SALT":
//       return Sparkles;
//     case "BOOK":
//       return Book;
//     default:
//       return Pill;
//   }
// }

// export default function CatalogCard({
//   product,
//   adding,
//   onAdd,
// }: CatalogCardProps) {
//   const [quantity, setQuantity] = useState(0);
//   const [error, setError] = useState("");

//   const ProductIcon = getProductTypeIcon(product.productType);

//   async function handleAdd() {
//     if (quantity <= 0) {
//       return;
//     }

//     try {
//       setError("");

//       await onAdd(product, quantity, 0);

//       setQuantity(0);
//     } catch (error) {
//       setError(
//         error instanceof Error ? error.message : "Unable to add product.",
//       );
//     }
//   }

//   return (
//     <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
//       <div className="flex items-center gap-3">
//         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
//           <ProductIcon size={20} />
//         </div>

//         <div className="min-w-0 flex-1">
//           <div className="mb-1 flex flex-wrap items-center gap-2">
//             <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">
//               {product.code}
//             </span>

//             <span className="text-xs text-slate-500">
//               {PRODUCT_TYPE_LABELS[product.productType]}
//             </span>
//           </div>

//           <h3 className="text-lg font-semibold text-slate-950">
//             {product.name}
//           </h3>
//         </div>

//         <div className="flex shrink-0 items-center gap-2">
//           <button
//             type="button"
//             onClick={() =>
//               setQuantity((currentQuantity) => Math.max(0, currentQuantity - 1))
//             }
//             disabled={quantity === 0 || adding}
//             className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
//           >
//             <Minus size={16} />
//           </button>

//           <span className="w-8 text-center font-semibold text-slate-950">
//             {quantity}
//           </span>

//           <button
//             type="button"
//             onClick={() =>
//               setQuantity((currentQuantity) => currentQuantity + 1)
//             }
//             disabled={adding}
//             className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
//           >
//             <Plus size={16} />
//           </button>
//         </div>
//       </div>

//       {quantity > 0 && (
//         <button
//           type="button"
//           onClick={() => void handleAdd()}
//           disabled={adding}
//           className="mt-3 w-full rounded-xl bg-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
//         >
//           {adding ? "Adding..." : "Add to inventory"}
//         </button>
//       )}

//       {error && (
//         <p className="mt-2 text-center text-sm text-red-500">{error}</p>
//       )}
//     </article>
//   );
// }

import { useState } from "react";
import {
  Beaker,
  Book,
  Droplet,
  Flower2,
  Minus,
  Pill,
  Plus,
  Sparkles,
} from "lucide-react";

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

function getProductTypeIcon(type: ProductType) {
  switch (type) {
    case "TABLET":
      return Pill;
    case "DRINK":
      return Droplet;
    case "SYRUP":
      return Beaker;
    case "OIL":
      return Flower2;
    case "CREAM":
      return Sparkles;
    case "CELL_SALT":
      return Sparkles;
    case "BOOK":
      return Book;
    default:
      return Pill;
  }
}

export default function CatalogCard({
  product,
  adding,
  onAdd,
}: CatalogCardProps) {
  const [fullQuantity, setFullQuantity] = useState(0);
  const [openedQuantity, setOpenedQuantity] = useState(0);
  const [error, setError] = useState("");

  const ProductIcon = getProductTypeIcon(product.productType);

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
          <ProductIcon size={20} />
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
