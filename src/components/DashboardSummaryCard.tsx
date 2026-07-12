import { AlertTriangle, Box, LogOut, Pill, CircleMinus } from "lucide-react";
import DashboardStatCard from "./ui/DashboardStats";
import { Router, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

type Props = {
  userName: string | undefined;
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
  const navigate = useNavigate();
  const { signOut } = useAuth();

  function handleLogout() {
    signOut();
    navigate("/sign-in");
  }
  return (
    <section className="mb-8 w-full rounded-3xl bg-gradient-to-r from-[#4169c9] to-indigo-700 p-4 sm:p-5 shadow-xl">
      {/* Header */}

      <div className="mb-4 sm:mb-5 flex items-start justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-white/10">
            <Pill className="text-white" size={28} />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Pill Inventory
            </h2>

            <p className="mt-1 text-sm sm:text-base text-white/80">
              {userName}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="logout"
          className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-white/10 hover:bg-white/20"
        >
          <LogOut className="text-white" size={20} />
        </button>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <DashboardStatCard
          number={totalItems}
          label="Total Items"
          icon={<Box size={28} className="text-white" />}
        />

        <DashboardStatCard
          number={lowStock}
          label="Low Stock"
          icon={<AlertTriangle size={28} className="text-yellow-300" />}
        />

        <DashboardStatCard
          number={outOfStock}
          label="Out of Stock"
          icon={<CircleMinus size={28} className="text-red-300" />}
        />
      </div>
    </section>
  );
}
