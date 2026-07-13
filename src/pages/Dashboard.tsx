import { useCallback, useEffect, useMemo, useState } from "react";
import DashboardSummaryCard from "../components/DashboardSummaryCard";
import SearchProducts from "../components/SearchProducts";
import MyStockTable from "../components/stock/MyStockTable";
import type { ProductType } from "../types/product";
import { useAuth } from "../context/useAuth";
import type { MyStockItem } from "../types/stock";
import { getMyStockRequest } from "../api/stock";

export default function Dashboard() {
  const [stockSearch, setStockSearch] = useState("");
  const [stockType, setStockType] = useState<ProductType | "">("");
  const [stock, setStock] = useState<MyStockItem[]>([]);

  const [stockPage, setStockPage] = useState(1);

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
    setStockPage(1);
  }

  function handleStockTypeChange(value: ProductType | "") {
    setStockType(value);
    setStockPage(1);
  }

  useEffect(() => {
    async function loadSummaryStock() {
      try {
        const response = await getMyStockRequest({
          page: 1,
          limit: 100,
        });

        setStock(response.items);
      } catch (error) {
        console.error("Failed to load stock summary:", error);
      }
    }

    loadSummaryStock();
  }, []);

  const loadSummaryStock = useCallback(async () => {
    try {
      const response = await getMyStockRequest({
        page: 1,
        limit: 100,
      });

      console.log(response);
      setStock(response.items);
    } catch (error) {
      console.error("Failed to load stock summary:", error);
    }
  }, []);

  useEffect(() => {
    loadSummaryStock();
  }, [loadSummaryStock]);

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
      <MyStockTable
        search={stockSearch}
        type={stockType}
        onStockChanged={loadSummaryStock}
      />
    </>
  );
}
