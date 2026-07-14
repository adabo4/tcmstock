import {
  LayoutDashboard,
  Package,
  Settings,
  LogOut,
  Pill,
  X,
} from "lucide-react";
import { SidebarLink } from "../../layouts/AppLayout";

type SideBarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

export default function MobileSidebar({
  sidebarOpen,
  setSidebarOpen,
}: SideBarProps) {
  return (
    <>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white px-6 py-6 shadow-xl
          transition-transform duration-300 lg:hidden
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <button
          title="close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="mb-6 ml-auto flex h-10 w-10 items-center justify-center rounded-xl hover:bg-slate-100"
        >
          <X size={22} />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-700 text-white">
            <Pill size={26} />
          </div>

          <div>
            <p className="text-lg font-bold text-slate-950">Správa zásob</p>
            <p className="text-sm text-slate-500">TCM Stock</p>
          </div>
        </div>

        <nav className="mt-10 space-y-2">
          <SidebarLink
            setSidebarOpen={setSidebarOpen}
            to="/dashboard"
            icon={<LayoutDashboard size={20} />}
          >
            Prehľad
          </SidebarLink>

          <SidebarLink
            setSidebarOpen={setSidebarOpen}
            to="/tablets/catalog"
            icon={<Package size={20} />}
          >
            Katalóg produktov
          </SidebarLink>

          <SidebarLink
            setSidebarOpen={setSidebarOpen}
            to="/settings"
            icon={<Settings size={20} />}
          >
            Nastavenia
          </SidebarLink>
        </nav>

        <button className="absolute bottom-6 left-6 right-6 flex h-12 items-center gap-3 rounded-xl px-4 text-slate-500 hover:bg-slate-100">
          <LogOut size={20} />
          Odhlásiť sa
        </button>
      </aside>
    </>
  );
}
