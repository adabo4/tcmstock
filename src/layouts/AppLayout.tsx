import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Package, Settings, LogOut, Pill } from "lucide-react";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-slate-200 bg-white px-6 py-6 lg:block">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-700 text-white">
            <Pill size={26} />
          </div>

          <div>
            <p className="text-lg font-bold text-slate-950">Pill Inventory</p>
            <p className="text-sm text-slate-500">TCM Stock</p>
          </div>
        </div>

        <nav className="mt-10 space-y-2">
          <SidebarLink to="/dashboard" icon={<LayoutDashboard size={20} />}>
            Dashboard
          </SidebarLink>

          <SidebarLink to="/products" icon={<Package size={20} />}>
            Products
          </SidebarLink>

          <SidebarLink to="/settings" icon={<Settings size={20} />}>
            Settings
          </SidebarLink>
        </nav>

        <button className="absolute bottom-6 left-6 right-6 flex h-12 items-center gap-3 rounded-xl px-4 text-slate-500 hover:bg-slate-100">
          <LogOut size={20} />
          Sign out
        </button>
      </aside>

      <div className="lg:pl-30">
        {/* <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-950">Dashboard</h1>
            <p className="text-sm text-slate-500">
              Manage your TCM medicine stock
            </p>
          </div>

          <div className="hidden rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 sm:block">
            Adriána
          </div>
        </header> */}

        <main className="p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

type SidebarLinkProps = {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};

function SidebarLink({ to, icon, children }: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "flex h-12 items-center gap-3 rounded-xl px-4 text-sm font-semibold transition",
          isActive
            ? "bg-blue-700 text-white shadow-sm"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
        ].join(" ")
      }
    >
      {icon}
      {children}
    </NavLink>
  );
}
