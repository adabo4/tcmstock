import {
  ChevronDown,
  Search,
  ShoppingCart,
  SlidersHorizontal,
} from "lucide-react";

import React from "react";

export default function SearchCatalog() {
  return (
    <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative w-full xl:max-w-xl">
          <Search
            size={22}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            placeholder="Search by code, name or type..."
            className="h-14 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button className="flex h-14 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-5 font-semibold text-slate-800 hover:bg-slate-50">
            <SlidersHorizontal size={20} />
            All Types
            <ChevronDown size={18} />
          </button>

          <button className="flex h-14 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-5 font-semibold text-slate-800 hover:bg-slate-50">
            <ShoppingCart size={20} />
            All Categories
            <ChevronDown size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
