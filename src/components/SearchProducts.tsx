import { ChevronDown, Search, ShoppingCart, X } from "lucide-react";
import { PRODUCT_TYPE_LABELS, type ProductType } from "../types/product";
import type { PackageStatus } from "../types/stock";

type SearchProductsProps = {
  search: string;
  setSearch: (value: string) => void;
  type: ProductType | "";
  setType: (value: ProductType | "") => void;
  placeholder?: string;
  showCategoryButton?: boolean;
  packageStatus?: PackageStatus;
  setPackageStatus?: (value: PackageStatus) => void;
  showPackageStatus?: boolean;
};

export default function SearchProducts({
  search,
  setSearch,
  type,
  setType,
  placeholder = "Nájdi podľa názvu alebo kódu...",
  showCategoryButton = true,
  packageStatus,
  setPackageStatus,
  showPackageStatus,
}: SearchProductsProps) {
  return (
    <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative w-full xl:max-w-xl">
          <Search
            size={22}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={placeholder}
            className="h-14 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <X size={22} />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {showPackageStatus && setPackageStatus && (
            <select
              value={packageStatus ?? ""}
              onChange={(e) =>
                setPackageStatus(e.target.value as PackageStatus)
              }
              className="h-14 rounded-xl border border-slate-200 bg-white px-4"
            >
              <option value="">Všetky balenia</option>
              <option value="OPENED">Má otvorené</option>
              <option value="CLOSED">Má zatvorené</option>
            </select>
          )}
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ProductType | "")}
            className="h-14 rounded-xl border border-slate-200 px-4"
          >
            <option value="">Všetky typy</option>

            {Object.entries(PRODUCT_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          {showCategoryButton && (
            <button className="flex h-14 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-5 font-semibold text-slate-800 hover:bg-slate-50">
              <ShoppingCart size={20} />
              Všetky kategórie
              <ChevronDown size={18} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
