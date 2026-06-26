import { useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Plus,
  Minus,
} from "lucide-react";
import SearchCatalog from "../components/SearchCatalog";

type CatalogProduct = {
  id: number;
  code: string;
  name: string;
  type: string;
  category: string;
  categoryColor: string;
};

const catalogProducts: CatalogProduct[] = [
  {
    id: 1,
    code: "001",
    name: "Kúzlo prvej pomoci",
    type: "Tablety",
    category: "Imunita",
    categoryColor: "bg-blue-50 text-blue-700",
  },
  {
    id: 2,
    code: "002",
    name: "Chlad rannej hmly",
    type: "Tablety",
    category: "Dýchacie cesty",
    categoryColor: "bg-emerald-50 text-emerald-700",
  },
  {
    id: 3,
    code: "003",
    name: "Krehkosť zvinutého lístku",
    type: "Tablety",
    category: "Trávenie",
    categoryColor: "bg-amber-50 text-amber-700",
  },
  {
    id: 4,
    code: "004",
    name: "Priesmyk veternej hory",
    type: "Tablety",
    category: "Kĺby a svaly",
    categoryColor: "bg-purple-50 text-purple-700",
  },
  {
    id: 5,
    code: "005",
    name: "Vyvanutie dračej jaskyne",
    type: "Tablety",
    category: "Pečeň",
    categoryColor: "bg-lime-50 text-lime-700",
  },
  {
    id: 6,
    code: "006",
    name: "Zrodenie Fénixa",
    type: "Tablety",
    category: "Energie",
    categoryColor: "bg-orange-50 text-orange-700",
  },
  {
    id: 7,
    code: "007",
    name: "Harmónia piatich prvkov",
    type: "Tablety",
    category: "Celkové tonikum",
    categoryColor: "bg-blue-50 text-blue-700",
  },
  {
    id: 8,
    code: "008",
    name: "Strážca pokojného srdca",
    type: "Tablety",
    category: "Srdce",
    categoryColor: "bg-red-50 text-red-700",
  },
];

export default function Catalog() {
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(
    null,
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-950">Catalog</h1>
        <p className="mt-2 text-lg text-slate-500">
          Select products from the catalog and add them to your inventory.
        </p>
      </div>

      <SearchCatalog />

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-white">
              <tr className="border-b border-slate-200 text-left text-sm font-semibold text-slate-500">
                <th className="px-8 py-5">Code</th>
                <th className="px-8 py-5">Name ↑</th>
                <th className="px-8 py-5">Type</th>
                <th className="px-8 py-5">Category</th>
                <th className="px-8 py-5 text-right">Add</th>
              </tr>
            </thead>

            <tbody>
              {catalogProducts.map((product) => (
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

                  <td className="px-8 py-5 text-slate-600">{product.type}</td>

                  <td className="px-8 py-5">
                    <span
                      className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${product.categoryColor}`}
                    >
                      {product.category}
                    </span>
                  </td>

                  <td className="relative px-8 py-5 text-right">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="inline-flex h-12 items-center gap-2 rounded-xl border border-primary px-4 font-bold text-primary transition hover:bg-primary hover:text-white"
                    >
                      <ShoppingCart size={18} />
                      Add
                    </button>

                    {selectedProduct?.id === product.id && (
                      <AddToInventoryPopover
                        product={product}
                        onClose={() => setSelectedProduct(null)}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-100 px-8 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">Showing 1 to 8 of 64 results</p>

          <div className="flex items-center gap-2">
            <PaginationButton>
              <ChevronLeft size={18} />
            </PaginationButton>

            <PaginationButton active>1</PaginationButton>
            <PaginationButton>2</PaginationButton>
            <PaginationButton>3</PaginationButton>

            <span className="px-2 text-slate-500">...</span>

            <PaginationButton>8</PaginationButton>

            <PaginationButton>
              <ChevronRight size={18} />
            </PaginationButton>
          </div>
        </div>
      </section>
    </div>
  );
}

type AddToInventoryPopoverProps = {
  product: CatalogProduct;
  onClose: () => void;
};

function AddToInventoryPopover({
  product,
  onClose,
}: AddToInventoryPopoverProps) {
  const [closedPacks, setClosedPacks] = useState(1);
  const [openedPacks, setOpenedPacks] = useState(0);

  function decreaseClosed() {
    setClosedPacks((prev) => Math.max(0, prev - 1));
  }

  function increaseClosed() {
    setClosedPacks((prev) => prev + 1);
  }

  function decreaseOpened() {
    setOpenedPacks((prev) => Math.max(0, prev - 1));
  }

  function increaseOpened() {
    setOpenedPacks((prev) => prev + 1);
  }

  function handleAddToStock() {
    console.log({
      tabletCatalogId: product.id,
      fullQuantity: closedPacks,
      openedQuantity: openedPacks,
    });

    onClose();
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
          <p className="font-semibold text-slate-800">Closed packs</p>
          <QuantityStepper
            value={closedPacks}
            onDecrease={decreaseClosed}
            onIncrease={increaseClosed}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className="font-semibold text-slate-800">Opened packs</p>
          <QuantityStepper
            value={openedPacks}
            onDecrease={decreaseOpened}
            onIncrease={increaseOpened}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="h-12 rounded-xl border border-slate-200 px-6 font-semibold text-slate-600 hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          onClick={handleAddToStock}
          disabled={closedPacks === 0 && openedPacks === 0}
          className="h-12 rounded-xl bg-blue px-6 font-semibold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Add to stock
        </button>
      </div>
    </div>
  );
}

type QuantityStepperProps = {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

function QuantityStepper({
  value,
  onDecrease,
  onIncrease,
}: QuantityStepperProps) {
  return (
    <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white">
      <button
        onClick={onDecrease}
        className="flex h-11 w-11 items-center justify-center bg-slate-50 text-slate-500 hover:bg-slate-100"
      >
        <Minus size={16} />
      </button>

      <div className="flex h-11 w-16 items-center justify-center border-x border-slate-200 font-bold text-slate-950">
        {value}
      </div>

      <button
        onClick={onIncrease}
        className="flex h-11 w-11 items-center justify-center bg-slate-50 text-slate-700 hover:bg-slate-100"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}

type PaginationButtonProps = {
  children: React.ReactNode;
  active?: boolean;
};

function PaginationButton({ children, active }: PaginationButtonProps) {
  return (
    <button
      className={[
        "flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
