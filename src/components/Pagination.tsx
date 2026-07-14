import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  total: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
};

type PaginationItem = number | "ellipsis-start" | "ellipsis-end";

// function getPaginationItems(
//   currentPage: number,
//   totalPages: number,
// ): PaginationItem[] {
//   if (totalPages <= 7) {
//     return Array.from({ length: totalPages }, (_, index) => index + 1);
//   }

//   if (currentPage <= 2) {
//     return [1, 2, 3, "ellipsis-end", totalPages];
//   }

//   if (currentPage >= totalPages - 3) {
//     return [
//       1,
//       "ellipsis-start",
//       totalPages - 4,
//       totalPages - 3,
//       totalPages - 2,
//       totalPages - 1,
//       totalPages,
//     ];
//   }

//   return [
//     1,
//     "ellipsis-start",
//     currentPage,
//     currentPage + 1,
//     "ellipsis-end",
//     totalPages,
//   ];
// }

function getPaginationItems(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  // Začiatok:
  // 1 2 3 4 ... 20
  if (currentPage <= 2) {
    return [1, 2, 3, "ellipsis-end", totalPages];
  }

  // Koniec:
  // 1 ... 17 18 19 20
  if (currentPage >= totalPages - 2) {
    return [
      1,
      "ellipsis-start",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  // Stred:
  // 1 ... 4 5 6 ... 20
  return [
    1,
    "ellipsis-start",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis-end",
    totalPages,
  ];
}

export default function Pagination({
  currentPage,
  totalPages,
  total,
  itemsPerPage,
  onPageChange,
  itemLabel = "products",
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const items = getPaginationItems(currentPage, totalPages);

  const start = total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, total);

  return (
    <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">
        Showing {start} to {end} of {total} {itemLabel}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <PaginationButton
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          ariaLabel="Previous page"
        >
          <ChevronLeft size={18} />
        </PaginationButton>

        {items.map((item) => {
          if (typeof item !== "number") {
            return (
              <span
                key={item}
                className="flex h-10 min-w-6 items-center justify-center text-sm font-semibold text-slate-400"
              >
                …
              </span>
            );
          }

          return (
            <PaginationButton
              key={item}
              active={currentPage === item}
              onClick={() => onPageChange(item)}
              ariaLabel={`Go to page ${item}`}
            >
              {item}
            </PaginationButton>
          );
        })}

        <PaginationButton
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          ariaLabel="Next page"
        >
          <ChevronRight size={18} />
        </PaginationButton>
      </div>
    </div>
  );
}

type PaginationButtonProps = {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  ariaLabel: string;
};

function PaginationButton({
  children,
  active = false,
  disabled = false,
  onClick,
  ariaLabel,
}: PaginationButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
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
