import { AlertTriangle, Box, LogOut, Pill, CircleMinus } from "lucide-react";
import DashboardStatCard from "./ui/DashboardStats";

type Props = {
  userName: string;
  totalItems: number;
  lowStock: number;
  outOfStock: number;
};

export default function DashboardSummaryCard({
  userName,
  totalItems,
  lowStock,
  outOfStock,
}: Props) {
  return (
    <section className="mb-8 w-full rounded-3xl bg-gradient-to-r from-[#4169c9] to-indigo-700 p-6 shadow-xl">
      {/* Header */}

      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10">
            <Pill className="text-white" size={52} />
          </div>

          <div>
            <h2 className="text-5xl font-bold text-white">Pill Inventory</h2>

            <p className="mt-3 text-2xl text-white/80">{userName}</p>
          </div>
        </div>

        <button className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 hover:bg-white/20">
          <LogOut className="text-white" size={34} />
        </button>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-3 gap-8">
        <DashboardStatCard
          number={totalItems}
          label="Total Items"
          icon={<Box size={42} className="text-white" />}
        />

        <DashboardStatCard
          number={lowStock}
          label="Low Stock"
          icon={<AlertTriangle size={42} className="text-yellow-300" />}
        />

        <DashboardStatCard
          number={outOfStock}
          label="Out of Stock"
          icon={<CircleMinus size={42} className="text-red-300" />}
        />
      </div>
    </section>
  );
}
