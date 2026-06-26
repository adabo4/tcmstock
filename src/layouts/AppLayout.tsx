import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Settings,
  LogOut,
  Pill,
  MenuIcon,
} from "lucide-react";
import { useState } from "react";
import MobileSidebar from "../components/ui/MobileSidebar";
import { useAuth } from "../context/useAuth";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  function handleLogout() {
    signOut();
    navigate("/sign-in");
  }
  return (
    <div className="min-h-screen bg-slate-50">
      <button
        title="Menu Icon"
        onClick={() => setSidebarOpen(true)}
        className="fixed left-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow lg:hidden"
      >
        <MenuIcon />
      </button>
      <MobileSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      ></MobileSidebar>
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
          <SidebarLink
            setSidebarOpen={setSidebarOpen}
            to="/dashboard"
            icon={<LayoutDashboard size={20} />}
          >
            Dashboard
          </SidebarLink>

          <SidebarLink
            setSidebarOpen={setSidebarOpen}
            to="/catalog"
            icon={<Package size={20} />}
          >
            Catalog
          </SidebarLink>

          <SidebarLink
            setSidebarOpen={setSidebarOpen}
            to="/settings"
            icon={<Settings size={20} />}
          >
            Settings
          </SidebarLink>
        </nav>

        <button
          onClick={handleLogout}
          className="absolute bottom-6 left-6 right-6 flex h-12 items-center gap-3 rounded-xl px-4 text-slate-500 hover:bg-slate-100"
        >
          <LogOut size={20} />
          Sign out
        </button>
      </aside>

      <div className="lg:pl-72">
        <main className="p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export type SidebarLinkProps = {
  to: string;
  icon: React.ReactNode;
  setSidebarOpen: (open: boolean) => void;
  children: React.ReactNode;
};

export function SidebarLink({
  to,
  icon,
  children,
  setSitebarOpen,
}: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      onClick={() => setSitebarOpen((prev) => !prev)}
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
