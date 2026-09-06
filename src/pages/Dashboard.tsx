import { useCallback, useEffect, useState } from "react";
import DashboardSummaryCard from "../components/DashboardSummaryCard";
import SearchProducts from "../components/SearchProducts";
import MyStockTable from "../components/stock/MyStockTable";
import type { ProductType } from "../types/product";
import { useAuth } from "../context/useAuth";
import type {
  MyStockItem,
  PackageStatus,
  QuantityField,
  StockStatus,
} from "../types/stock";
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
import { useNavigate, useOutletContext } from "react-router-dom";
import CreateStockLocationModal from "../components/stock/CreateCtockLocationModal";
import type { AppLayoutOutletContext } from "../layouts/AppLayout";
import MobileMenuButton from "../components/ui/MobileMenuButton";
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
  const [stockStatus, setStockStatus] = useState<
    "LOW_STOCK" | "OUT_OF_STOCK" | ""
  >("");
  const [summary, setSummary] = useState({
    totalProducts: 0,
    lowStock: 0,
    outOfStock: 0,
  });

  const [packageStatus, setPackageStatus] = useState<PackageStatus>("");

  const [createLocationOpen, setCreateLocationOpen] = useState(false);

  const { openSidebar } = useOutletContext<AppLayoutOutletContext>();

  const navigate = useNavigate();

  const { locations, activeLocationId, setActiveLocationId, activeLocation } =
    useStockLocation();

  const { user } = useAuth();

  // const summary = useMemo(() => {
  //   let totalItems = 0;
  //   let lowStock = 0;
  //   let outOfStock = 0;

  //   for (const item of stock) {
  //     const quantity = item.fullQuantity + item.openedQuantity;

  //     totalItems += quantity;

  //     if (quantity === 0) {
  //       outOfStock++;
  //     } else if (quantity < 2) {
  //       lowStock++;
  //     }
  //   }

  //   return {
  //     totalItems,
  //     lowStock,
  //     outOfStock,
  //   };
  // }, [stock]);

  function handleStockSearchChange(value: string) {
    setStockSearch(value);
    setCurrentPage(1);
  }

  function handleStockTypeChange(value: ProductType | "") {
    setStockType(value);
    setCurrentPage(1);
  }

  function handleSummaryClick(status: StockStatus) {
    setStockStatus((current) => (current === status ? "" : status));
    setCurrentPage(1);
  }

  function handlePackageStatusChange(value: "OPENED" | "CLOSED" | "") {
    setPackageStatus(value);
    setCurrentPage(1);
  }

  // const loadStock = useCallback(async () => {
  //   if (!activeLocationId) {
  //     return;
  //   }
  //   try {
  //     setIsLoading(true);
  //     setError("");

  //     const response = await getMyStockRequest({
  //       search: stockSearch.trim() || undefined,
  //       type: stockType || undefined,
  //       status: stockStatus || undefined,
  //       page: currentPage,
  //       limit: ITEMS_PER_PAGE,
  //       stockLocationId: activeLocationId ?? undefined,
  //       packageStatus: packageStatus || undefined,
  //     });

  //     setStock(response.items);
  //     setTotal(response.total);
  //     setTotalPages(response.totalPages);
  //     setSummary(response.summary);
  //   } catch (error) {
  //     const message =
  //       error instanceof Error
  //         ? error.message
  //         : "Nepodarilo sa načítať produkty.";

  //     setError(message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [
  //   stockSearch,
  //   stockType,
  //   currentPage,
  //   activeLocationId,
  //   stockStatus,
  //   packageStatus,
  // ]);

  const loadStock = useCallback(
    async (showLoader = true) => {
      if (!activeLocationId) {
        return;
      }

      try {
        if (showLoader) {
          setIsLoading(true);
        }

        setError("");

        const response = await getMyStockRequest({
          search: stockSearch.trim() || undefined,
          type: stockType || undefined,
          status: stockStatus || undefined,
          packageStatus: packageStatus || undefined,
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          stockLocationId: activeLocationId,
        });

        setStock(response.items);
        setTotal(response.total);
        setTotalPages(response.totalPages);
        setSummary(response.summary);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Nepodarilo sa načítať produkty.";

        setError(message);
      } finally {
        if (showLoader) {
          setIsLoading(false);
        }
      }
    },
    [
      stockSearch,
      stockType,
      stockStatus,
      packageStatus,
      currentPage,
      activeLocationId,
    ],
  );

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

  // async function handleUpdateQuantity(
  //   item: MyStockItem,
  //   field: QuantityField,
  //   newValue: number,
  // ) {
  //   if (newValue < 0) {
  //     return;
  //   }

  //   try {
  //     setUpdatingItemId(item.id);
  //     setError("");

  //     await updateMyStockRequest(item.id, {
  //       fullQuantity: field === "fullQuantity" ? newValue : item.fullQuantity,
  //       openedQuantity:
  //         field === "openedQuantity" ? newValue : item.openedQuantity,
  //     });

  //     await loadStock();

  //     showNotification("Množstvo produktu bolo aktualizované.", "success");
  //   } catch (error) {
  //     const message =
  //       error instanceof Error
  //         ? error.message
  //         : "Množstvo produktu sa nepodarilo aktualizovať.";

  //     setError(message);
  //     showNotification(message, "error");
  //   } finally {
  //     setUpdatingItemId(null);
  //   }
  // }

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

      await updateMyStockRequest(item.id, {
        fullQuantity: field === "fullQuantity" ? newValue : item.fullQuantity,
        openedQuantity:
          field === "openedQuantity" ? newValue : item.openedQuantity,
      });

      await loadStock(false);

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
      <div className="w-full min-w-0 overflow-x-hidden">
        <div className="mb-8 min-w-0">
          <div className="mb-6 flex w-full min-w-0 items-center gap-2 sm:gap-3">
            <MobileMenuButton onClick={openSidebar} />

            <div className="min-w-0 flex-1">
              <StockLocationSelect
                locations={locations}
                activeLocationId={activeLocationId}
                onChange={handleLocationChange}
                onCreate={() => setCreateLocationOpen(true)}
                onManage={() => navigate("/settings?section=stock-locations")}
              />
            </div>
          </div>

          <div className="min-w-0 ">
            <h1 className="break-words text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Prehľad
            </h1>

            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              Prehľad vašich zásob produktov
            </p>
          </div>
        </div>
        <DashboardSummaryCard
          userName={user?.name ?? undefined}
          totalItems={summary.totalProducts}
          lowStock={summary.lowStock}
          outOfStock={summary.outOfStock}
          onLowStockClick={() => handleSummaryClick("LOW_STOCK")}
          onOutOfStockClick={() => handleSummaryClick("OUT_OF_STOCK")}
          onTotalClick={() => handleSummaryClick("")}
        />

        <SearchProducts
          search={stockSearch}
          setSearch={handleStockSearchChange}
          type={stockType}
          setType={handleStockTypeChange}
          showCategoryButton={false}
          setPackageStatus={handlePackageStatusChange}
          packageStatus={packageStatus}
          showPackageStatus={true}
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
      </div>
    </>
  );
}
