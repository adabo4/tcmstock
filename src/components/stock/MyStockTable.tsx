// import { Minus, Plus, Trash2 } from "lucide-react";

// type StockItem = {
//   id: number;
//   code: string;
//   name: string;
//   productType: string;
//   fullQuantity: number;
//   openedQuantity: number;
// };

// const mockStock: StockItem[] = [
//   {
//     id: 1,
//     code: "001",
//     name: "Kúzlo prvej pomoci",
//     productType: "TABLET",
//     fullQuantity: 2,
//     openedQuantity: 1,
//   },
//   {
//     id: 2,
//     code: "005",
//     name: "Nápoj čínskych mudrcov",
//     productType: "DRINK",
//     fullQuantity: 0,
//     openedQuantity: 1,
//   },
//   {
//     id: 3,
//     code: "010",
//     name: "Pôvab jazmínovej pleti",
//     productType: "CREME",
//     fullQuantity: 0,
//     openedQuantity: 0,
//   },
// ];

// function getStockStatus(total: number) {
//   if (total === 0) return "Out of stock";
//   if (total <= 2) return "Low stock";
//   return "In stock";
// }

// function getStatusClass(total: number) {
//   if (total === 0) return "bg-red-50 text-red-700";
//   if (total <= 2) return "bg-amber-50 text-amber-700";
//   return "bg-green-50 text-green-700";
// }

// export default function MyStockTable() {
//   return (
//     <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
//       <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-slate-950">My Stock</h2>
//           <p className="mt-1 text-sm text-slate-500">
//             Manage your current inventory
//           </p>
//         </div>

//         <button className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover">
//           Add product
//         </button>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full min-w-[850px] border-separate border-spacing-y-3">
//           <thead>
//             <tr className="text-left text-sm text-slate-500">
//               <th className="px-4 font-medium">Code</th>
//               <th className="px-4 font-medium">Product</th>
//               <th className="px-4 font-medium">Type</th>
//               <th className="px-4 font-medium">Full</th>
//               <th className="px-4 font-medium">Opened</th>
//               <th className="px-4 font-medium">Total</th>
//               <th className="px-4 font-medium">Status</th>
//               <th className="px-4 text-right font-medium">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {mockStock.map((item) => {
//               const total = item.fullQuantity + item.openedQuantity;

//               return (
//                 <tr key={item.id} className="rounded-2xl bg-slate-50">
//                   <td className="rounded-l-2xl px-4 py-4 font-semibold text-slate-700">
//                     {item.code}
//                   </td>

//                   <td className="px-4 py-4">
//                     <p className="font-semibold text-slate-950">{item.name}</p>
//                     <p className="text-sm text-slate-500">ID: {item.id}</p>
//                   </td>

//                   <td className="px-4 py-4 text-slate-600">
//                     {item.productType}
//                   </td>

//                   <td className="px-4 py-4">
//                     <QuantityControl value={item.fullQuantity} />
//                   </td>

//                   <td className="px-4 py-4">
//                     <QuantityControl value={item.openedQuantity} />
//                   </td>

//                   <td className="px-4 py-4 text-lg font-bold text-slate-950">
//                     {total}
//                   </td>

//                   <td className="px-4 py-4">
//                     <span
//                       className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
//                         total,
//                       )}`}
//                     >
//                       {getStockStatus(total)}
//                     </span>
//                   </td>

//                   <td className="rounded-r-2xl px-4 py-4">
//                     <div className="flex justify-end">
//                       <button className="flex h-10 w-10 items-center justify-center rounded-xl text-red-500 hover:bg-red-50">
//                         <Trash2 size={18} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </section>
//   );
// }

// type QuantityControlProps = {
//   value: number;
// };

// function QuantityControl({ value }: QuantityControlProps) {
//   return (
//     <div className="flex w-fit items-center rounded-xl border border-slate-200 bg-white">
//       <button className="flex h-9 w-9 items-center justify-center text-slate-500 hover:text-slate-950">
//         <Minus size={16} />
//       </button>

//       <span className="w-8 text-center text-sm font-bold text-slate-950">
//         {value}
//       </span>

//       <button className="flex h-9 w-9 items-center justify-center text-slate-500 hover:text-slate-950">
//         <Plus size={16} />
//       </button>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus, Trash2 } from "lucide-react";
import { getMyStockRequest } from "../../api/stock";
import type { ProductType } from "../../types/product";

type MyStockItem = {
  id: number;
  userId: number;
  tabletCatalogId: number;
  fullQuantity: number;
  openedQuantity: number;
  createdAt: string;
  updatedAt: string;
  tabletCatalog: {
    id: number;
    code: string;
    name: string;
    productType: string;
  };
};

type MyStockTableProps = {
  search: string;
  type: ProductType | "";
};

function getStockStatus(total: number) {
  if (total === 0) return "Out of stock";
  if (total <= 2) return "Low stock";
  return "In stock";
}

function getStatusClass(total: number) {
  if (total === 0) return "bg-red-50 text-red-700";
  if (total <= 2) return "bg-amber-50 text-amber-700";
  return "bg-green-50 text-green-700";
}

export default function MyStockTable({ search, type }: MyStockTableProps) {
  const [stock, setStock] = useState<MyStockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const ITEMS_PER_PAGE = 15;
  useEffect(() => {
    const timeout = window.setTimeout(async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getMyStockRequest({
          search,
          type: type || undefined,
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        });

        setStock(data.items);

        setTotal(data.total);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Failed to load stock:", error);

        setError(
          error instanceof Error ? error.message : "Something went wrong",
        );
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [search, currentPage, type]);

  if (isLoading) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-slate-500">Loading your stock...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-3xl border border-red-200 bg-red-50 p-6">
        <p className="font-medium text-red-700">{error}</p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">My Stock</h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage your current inventory
          </p>
        </div>

        <button className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover">
          Add product
        </button>
      </div>

      {stock.length === 0 ? (
        <div className="rounded-2xl bg-slate-50 p-8 text-center">
          <p className="font-semibold text-slate-700">Your stock is empty.</p>

          <p className="mt-1 text-sm text-slate-500">
            Add a product from the catalog.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-sm text-slate-500">
                <th className="px-4 font-medium">Code</th>
                <th className="px-4 font-medium">Product</th>
                <th className="px-4 font-medium">Type</th>
                <th className="px-4 font-medium">Full</th>
                <th className="px-4 font-medium">Opened</th>
                <th className="px-4 font-medium">Total</th>
                <th className="px-4 font-medium">Status</th>
                <th className="px-4 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {stock.map((item) => {
                const total = item.fullQuantity + item.openedQuantity;

                return (
                  <tr key={item.id} className="rounded-2xl bg-slate-50">
                    <td className="rounded-l-2xl px-4 py-4 font-semibold text-slate-700">
                      {item.tabletCatalog.code}
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-950">
                        {item.tabletCatalog.name}
                      </p>

                      <p className="text-sm text-slate-500">
                        Stock ID: {item.id}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {item.tabletCatalog.productType}
                    </td>

                    <td className="px-4 py-4">
                      <QuantityControl value={item.fullQuantity} />
                    </td>

                    <td className="px-4 py-4">
                      <QuantityControl value={item.openedQuantity} />
                    </td>

                    <td className="px-4 py-4 text-lg font-bold text-slate-950">
                      {total}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                          total,
                        )}`}
                      >
                        {getStockStatus(total)}
                      </span>
                    </td>

                    <td className="rounded-r-2xl px-4 py-4">
                      <div className="flex justify-end">
                        <button className="flex h-10 w-10 items-center justify-center rounded-xl text-red-500 hover:bg-red-50">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Showing {total === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
          {Math.min(currentPage * ITEMS_PER_PAGE, total)} of {total} products
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
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            <ChevronRight size={18} />
          </PaginationButton>
        </div>
      </div>
    </section>
  );
}

type QuantityControlProps = {
  value: number;
};

function QuantityControl({ value }: QuantityControlProps) {
  return (
    <div className="flex w-fit items-center rounded-xl border border-slate-200 bg-white">
      <button className="flex h-9 w-9 items-center justify-center text-slate-500 hover:text-slate-950">
        <Minus size={16} />
      </button>

      <span className="w-8 text-center text-sm font-bold text-slate-950">
        {value}
      </span>

      <button className="flex h-9 w-9 items-center justify-center text-slate-500 hover:text-slate-950">
        <Plus size={16} />
      </button>
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
