import DashboardSummaryCard from "../components/DashboardSummaryCard";

export default function Dashboard() {
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

      {/* sem pôjde tabuľka */}
    </>
  );
}
