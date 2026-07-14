import { useCallback, useEffect, useMemo, useState } from "react";
import DashboardSummaryCard from "../components/DashboardSummaryCard";
import SearchProducts from "../components/SearchProducts";
import MyStockTable from "../components/stock/MyStockTable";
import type { ProductType } from "../types/product";
import { useAuth } from "../context/useAuth";
import type { MyStockItem, QuantityField } from "../types/stock";
import {
  getMyStockRequest,
  removeFromMyStockRequest,
  updateMyStockRequest,
} from "../api/stock";
import { useNotification } from "../context/useNotification";
import MyStockCards from "../components/stock/MyStockCards";
import { ChevronLeft, ChevronRight } from "lucide-react";
const ITEMS_PER_PAGE = 15;

export default function Dashboard() {
  const [stockSearch, setStockSearch] = useState("");
  const [stockType, setStockType] = useState<ProductType | "">("");
  const [stock, setStock] = useState<MyStockItem[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);
  const { showNotification } = useNotification();

  // const [, setStockPage] = useState(1);

  const { user } = useAuth();

  const summary = useMemo(() => {
    let totalItems = 0;
    let lowStock = 0;
    let outOfStock = 0;

    for (const item of stock) {
      const quantity = item.fullQuantity + item.openedQuantity;

      totalItems += quantity;

      if (quantity === 0) {
        outOfStock++;
      } else if (quantity < 3) {
        lowStock++;
      }
    }

    return {
      totalItems,
      lowStock,
      outOfStock,
    };
  }, [stock]);

  function handleStockSearchChange(value: string) {
    setStockSearch(value);
    setCurrentPage(1);
  }

  function handleStockTypeChange(value: ProductType | "") {
    setStockType(value);
    setCurrentPage(1);
  }
  const loadStock = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getMyStockRequest({
        search: stockSearch.trim() || undefined,
        type: stockType || undefined,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });

      setStock(response.items);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load stock.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [stockSearch, stockType, currentPage]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadStock();
    }, 400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadStock]);

  // async function handleDelete(itemId: number) {
  //   const confirmed = window.confirm(
  //     "Are you sure you want to remove this product from your stock?",
  //   );

  //   if (!confirmed) {
  //     return;
  //   }

  //   try {
  //     setDeletingItemId(itemId);
  //     setError("");

  //     await removeFromMyStockRequest(itemId);

  //     const data = await getMyStockRequest({
  //       search: stockSearch,
  //       type: stockType || undefined,
  //       page: currentPage,
  //       limit: ITEMS_PER_PAGE,
  //     });

  //     setStock(data.items);
  //     setTotal(data.total);
  //     setTotalPages(data.totalPages);

  //     showNotification("Product removed from stock.", "success");
  //   } catch (error) {
  //     const message =
  //       error instanceof Error ? error.message : "Failed to remove product.";

  //     setError(message);
  //     showNotification(message, "error");
  //   } finally {
  //     setDeletingItemId(null);
  //   }
  // }

  async function handleDelete(item: MyStockItem) {
    const confirmed = window.confirm(
      `Are you sure you want to remove ${item.tabletCatalog.name} from your stock?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingItemId(item.id);
      setError("");

      await removeFromMyStockRequest(item.id);

      if (stock.length === 1 && currentPage > 1) {
        setCurrentPage((page) => page - 1);
      } else {
        await loadStock();
      }

      showNotification("Product removed from stock.", "success");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to remove product.";

      setError(message);
      showNotification(message, "error");
    } finally {
      setDeletingItemId(null);
    }
  }

  async function handleUpdateQuantity(
    item: MyStockItem,
    field: QuantityField,
    newValue: number,
  ) {
    if (newValue < 0) {
      return;
    }

    try {
      setUpdatingItemId(item.id);
      setError("");

      const updatedItem = await updateMyStockRequest(item.id, {
        fullQuantity: field === "fullQuantity" ? newValue : item.fullQuantity,

        openedQuantity:
          field === "openedQuantity" ? newValue : item.openedQuantity,
      });

      setStock((currentStock) =>
        currentStock.map((stockItem) =>
          stockItem.id === updatedItem.id ? updatedItem : stockItem,
        ),
      );

      showNotification("Product quantity updated.", "success");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update product.";

      setError(message);
      showNotification(message, "error");
    } finally {
      setUpdatingItemId(null);
    }
  }

  return (
    <>
      <h1 className="mb-1 ml-15 lg:ml-0 text-5xl font-bold">Dashboard</h1>
      <p className="mb-8 ml-15 lg:ml-0 text-slate-500">
        Overview of your pill inventory
      </p>
      <DashboardSummaryCard
        userName={user?.name}
        totalItems={summary.totalItems}
        lowStock={summary.lowStock}
        outOfStock={summary.outOfStock}
      />
      <SearchProducts
        search={stockSearch}
        setSearch={handleStockSearchChange}
        type={stockType}
        setType={handleStockTypeChange}
        placeholder="Nájdi podľa názvu, kódu alebo typu..."
        showCategoryButton={false}
      ></SearchProducts>
      {isLoading && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-slate-500">Loading your stock...</p>
        </section>
      )}

      {!isLoading && error && (
        <section className="rounded-3xl border border-red-200 bg-red-50 p-6">
          <p className="font-medium text-red-700">{error}</p>
        </section>
      )}

      {!isLoading && !error && (
        <>
          <div className="hidden md:block">
            <MyStockTable
              items={stock}
              updatingItemId={updatingItemId}
              deletingItemId={deletingItemId}
              onQuantityChange={handleUpdateQuantity}
              onDelete={handleDelete}
            />
          </div>

          <div className="md:hidden">
            <MyStockCards
              items={stock}
              updatingItemId={updatingItemId}
              deletingItemId={deletingItemId}
              onQuantityChange={handleUpdateQuantity}
              onDelete={handleDelete}
            />
          </div>
        </>
      )}

      {!isLoading && !error && totalPages > 1 && (
        <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Showing {total === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}{" "}
            to {Math.min(currentPage * ITEMS_PER_PAGE, total)} of {total}{" "}
            products
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <PaginationButton
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => page - 1)}
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
              onClick={() => setCurrentPage((page) => page + 1)}
            >
              <ChevronRight size={18} />
            </PaginationButton>
          </div>
        </div>
      )}
    </>
  );
}

type PaginationButtonProps = {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

function PaginationButton({
  children,
  active = false,
  disabled = false,
  onClick,
}: PaginationButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition",
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
