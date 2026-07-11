import { useState } from "react";
import DashboardSummaryCard from "../components/DashboardSummaryCard";
import SearchProducts from "../components/SearchProducts";
import MyStockTable from "../components/stock/MyStockTable";
import type { ProductType } from "../types/product";

export default function Dashboard() {
  const [stockSearch, setStockSearch] = useState("");
  const [stockType, setStockType] = useState<ProductType | "">("");
  const [stockPage, setStockPage] = useState(1);

  function handleStockSearchChange(value: string) {
    setStockSearch(value);
    setStockPage(1);
  }

  function handleStockTypeChange(value: ProductType | "") {
    setStockType(value);
    setStockPage(1);
  }
  return (
    <>
      <h1 className="mb-1 ml-15 lg:ml-0 text-5xl font-bold">Dashboard</h1>
      <p className="mb-8 ml-15 lg:ml-0 text-slate-500">
        Overview of your pill inventory
      </p>
      <DashboardSummaryCard
        userName="Adriána Bohunická"
        totalItems={64}
        lowStock={3}
        outOfStock={1}
      />
      <SearchProducts
        search={stockSearch}
        setSearch={handleStockSearchChange}
        type={stockType}
        setType={handleStockTypeChange}
        placeholder="Nájdi podľa názvu, kódu alebo typu..."
        showCategoryButton={false}
      ></SearchProducts>
      <MyStockTable search={stockSearch} type={stockType} />
    </>
  );
}
