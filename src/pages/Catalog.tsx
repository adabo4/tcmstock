import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import type { CatalogProduct, ProductType } from "../types/product";
import { getCatalogRequest } from "../api/catalog";
import { PRODUCT_TYPE_LABELS } from "../types/product";
import SearchProducts from "../components/SearchProducts";
import AddToInventoryPopover from "../components/stock/AddToInventoryPopover";

export default function Catalog() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const ITEMS_PER_PAGE = 15;

  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [type, setType] = useState<ProductType | "">("");

  useEffect(() => {
    async function loadCatalog() {
      try {
        setLoading(true);
        setError("");

        const response = await getCatalogRequest({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          search: debouncedSearch,
          type: type || undefined,
        });

        setProducts(response.items);
        setTotal(response.total);
        setTotalPages(response.totalPages);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load catalog.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadCatalog();
  }, [currentPage, debouncedSearch, type]);

  function handleSearchChange(value: string) {
    setSearch(value);
    setCurrentPage(1);
  }

  function handleTypeChange(value: ProductType | "") {
    setType(value);
    setCurrentPage(1);
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-950">Catalog</h1>
        <p className="mt-2 text-lg text-slate-500">
          Select products from the catalog and add them to your inventory.
        </p>
      </div>

      <SearchProducts
        search={search}
        setSearch={handleSearchChange}
        type={type}
        setType={handleTypeChange}
        placeholder="Vyhľadaj podľa názvu, kódu aleby typu..."
      />

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          {loading && (
            <p className="mb-4 rounded-xl bg-white p-4 text-slate-500">
              Loading catalog...
            </p>
          )}

          {error && (
            <p className="mb-4 rounded-xl bg-red-50 p-4 text-red-600">
              {error}
            </p>
          )}
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
                      onClick={() => setSelectedProduct(product)}
                      className="inline-flex h-12 items-center gap-2 rounded-xl border border-primary px-4 font-bold text-primary transition hover:bg-blue hover:text-white"
                    >
                      <ShoppingCart size={18} />
                      Add
                    </button>

                    {selectedProduct?.id === product.id && (
                      <AddToInventoryPopover
                        product={product}
                        onClose={() => setSelectedProduct(null)}
                        onAdded={() => {
                          console.log("Product added successfully");
                        }}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-100 px-8 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Showing {total === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}{" "}
            to {Math.min(currentPage * ITEMS_PER_PAGE, total)} of {total}{" "}
            products
          </p>

          <div className="flex items-center gap-2">
            <PaginationButton
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              <ChevronLeft size={18} />
            </PaginationButton>

            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;

              return (
                <PaginationButton
                  key={page}
                  active={currentPage === page}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PaginationButton>
              );
            })}

            <PaginationButton
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              <ChevronRight size={18} />
            </PaginationButton>
          </div>
        </div>
      </section>
    </div>
  );
}

type PaginationButtonProps = {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

function PaginationButton({
  children,
  active,
  disabled,
  onClick,
}: PaginationButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
        disabled ? "cursor-not-allowed opacity-40" : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
