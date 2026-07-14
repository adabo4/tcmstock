import { useState, useEffect } from "react";
import type { CatalogProduct, ProductType } from "../types/product";
import { getCatalogRequest } from "../api/catalog";
import SearchProducts from "../components/SearchProducts";
import { useNotification } from "../context/useNotification";
import { addToMyStockRequest } from "../api/stock";
import CatalogTable from "../components/catalog/CatalogTable";
import CatalogCards from "../components/catalog/CatalogCards";
import Pagination from "../components/Pagination";
import { useStockLocation } from "../context/useStockLocation";

const ITEMS_PER_PAGE = 15;
export default function Catalog() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [type, setType] = useState<ProductType | "">("");

  const [addingProductId, setAddingProductId] = useState<number | null>(null);

  const { showNotification } = useNotification();

  const { activeLocationId, activeLocation } = useStockLocation();

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

  async function handleAddProduct(
    product: CatalogProduct,
    fullQuantity: number,
    openedQuantity: number,
  ) {
    if (fullQuantity <= 0 && openedQuantity <= 0) {
      return;
    }

    if (!activeLocationId) {
      showNotification("Najprv vyberte sklad.", "error");
      return;
    }

    try {
      setAddingProductId(product.id);

      await addToMyStockRequest({
        tabletCatalogId: product.id,
        fullQuantity,
        openedQuantity,
        stockLocationId: activeLocationId,
      });

      // showNotification("Stock updated successfully.", "success");
      showNotification(
        `Produkt bol pridaný do skladu ${activeLocation?.name ?? ""}.`,
        "success",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to add product.";

      showNotification(message, "error");

      throw error;
    } finally {
      setAddingProductId(null);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-950">Katalóg produktov</h1>
        <p className="mt-2 text-lg text-slate-500">
          Vyberte produkty z katalógu a pridajte ich do svojho skladu.
        </p>
      </div>

      <SearchProducts
        search={search}
        setSearch={handleSearchChange}
        type={type}
        setType={handleTypeChange}
        showCategoryButton={false}
      />

      {loading && (
        <p className="mb-4 rounded-xl bg-white p-4 text-slate-500">
          Načítavam katalóg...
        </p>
      )}

      {!loading && error && (
        <p className="mb-4 rounded-xl bg-red-50 p-4 text-red-600">{error}</p>
      )}

      {!loading && !error && (
        <>
          <div className="hidden md:block">
            <CatalogTable
              products={products}
              selectedProduct={selectedProduct}
              addingProductId={addingProductId}
              onSelectProduct={setSelectedProduct}
              onCloseProduct={() => setSelectedProduct(null)}
              onAdd={handleAddProduct}
            />
          </div>

          <div className="md:hidden">
            <CatalogCards
              products={products}
              addingProductId={addingProductId}
              onAdd={handleAddProduct}
            />
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            total={total}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            itemLabel="produktov"
          />
        </>
      )}
    </div>
  );
}
