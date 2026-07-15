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
import Pagination from "../components/Pagination";
import StockLocationSelect from "../components/stock/StockLocationSelect";
import { useStockLocation } from "../context/useStockLocation";
import { useNavigate } from "react-router-dom";
import CreateStockLocationModal from "../components/stock/CreateCtockLocationModal";
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

  const [createLocationOpen, setCreateLocationOpen] = useState(false);

  const navigate = useNavigate();

  const { locations, activeLocationId, setActiveLocationId, activeLocation } =
    useStockLocation();

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
    if (!activeLocationId) {
      return;
    }
    try {
      setIsLoading(true);
      setError("");

      const response = await getMyStockRequest({
        search: stockSearch.trim() || undefined,
        type: stockType || undefined,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        stockLocationId: activeLocationId ?? undefined,
      });

      setStock(response.items);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Nepodarilo sa načítať produkty.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [stockSearch, stockType, currentPage, activeLocationId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadStock();
    }, 400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadStock]);

  async function handleDelete(item: MyStockItem) {
    const confirmed = window.confirm(
      `Naozaj chcete odstrániť produkt „${item.tabletCatalog.name}“ zo svojho skladu?`,
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

      showNotification(
        `Produkt bol odstránený zo skladu ${activeLocation?.name ?? ""}.`,
        "success",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Produkt sa nepodarilo odstrániť.";

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

      showNotification("Množstvo produktu bolo aktualizované.", "success");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Množstvo produktu sa nepodarilo aktualizovať.";

      setError(message);
      showNotification(message, "error");
    } finally {
      setUpdatingItemId(null);
    }
  }

  function handleLocationChange(locationId: number) {
    setActiveLocationId(locationId);
    setCurrentPage(1);
  }

  return (
    <>
      <StockLocationSelect
        locations={locations}
        activeLocationId={activeLocationId}
        onChange={handleLocationChange}
        onCreate={() => setCreateLocationOpen(true)}
        onManage={() => navigate("/settings?section=stock-locations")}
      />
      <h1 className="mb-1 ml-15 lg:ml-0 text-5xl font-bold">Prehľad</h1>
      <p className="mb-8 ml-15 lg:ml-0 text-slate-500">
        Prehľad vašich zásob produktov
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
        showCategoryButton={false}
      ></SearchProducts>
      {isLoading && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-slate-500">Načítavam sklad...</p>
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

      <CreateStockLocationModal
        open={createLocationOpen}
        onClose={() => setCreateLocationOpen(false)}
      />
    </>
  );
}
