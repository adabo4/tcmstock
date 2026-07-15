import { useState } from "react";
import {
  Building2,
  Check,
  ChevronDown,
  Home,
  Plus,
  Settings,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import type { StockLocation } from "../../types/stockLocations";

type StockLocationSelectProps = {
  locations: StockLocation[];
  activeLocationId: number | null;
  onChange: (locationId: number) => void;
  onCreate: () => void;
  onManage: () => void;
};

function getLocationIcon(name: string): LucideIcon {
  const normalizedName = name.toLowerCase();

  if (normalizedName.includes("dom")) {
    return Home;
  }

  if (normalizedName.includes("kancel") || normalizedName.includes("ambul")) {
    return Building2;
  }

  return Warehouse;
}

export default function StockLocationSelect({
  locations,
  activeLocationId,
  onChange,
  onCreate,
  onManage,
}: StockLocationSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeLocation =
    locations.find((location) => location.id === activeLocationId) ??
    locations.find((location) => location.isDefault) ??
    locations[0];

  const ActiveIcon = activeLocation
    ? getLocationIcon(activeLocation.name)
    : Warehouse;

  function selectLocation(locationId: number) {
    onChange(locationId);
    setIsOpen(false);
  }

  return (
    <div className="flex items-center justify-between">
      <div className="relative inline-block">
        <div className="flex items-center gap-3">
          <span className="hidden text-sm font-medium text-slate-700 sm:block">
            Aktuálny sklad:
          </span>

          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className="flex min-w-48 items-center justify-between gap-4 rounded-xl border border-indigo-200 bg-white px-4 py-3 text-left shadow-sm transition hover:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100"
          >
            <span className="flex min-w-0 items-center gap-3">
              <ActiveIcon size={20} className="shrink-0 text-indigo-600" />

              <span className="truncate font-semibold text-slate-900">
                {activeLocation?.name ?? "Vyberte sklad"}
              </span>
            </span>

            <ChevronDown
              size={18}
              className={`shrink-0 text-slate-500 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {isOpen && (
          <div className="absolute left-0 md:left-20 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="p-2">
              {locations.map((location) => {
                const Icon = getLocationIcon(location.name);
                const isActive = location.id === activeLocation?.id;

                return (
                  <button
                    key={location.id}
                    type="button"
                    onClick={() => selectLocation(location.id)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <Icon size={19} className="shrink-0" />

                      <span className="truncate font-medium">
                        {location.name}
                      </span>

                      {location.isDefault && (
                        <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700">
                          Predvolený
                        </span>
                      )}
                    </span>

                    {isActive && (
                      <Check size={18} className="shrink-0 text-indigo-600" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="border-t border-slate-200 p-2">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onCreate();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <Plus size={19} />
                Vytvoriť nový sklad
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onManage();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <Settings size={19} />
                Spravovať sklady
              </button>
            </div>
          </div>
        )}
      </div>
      <div>
        <button
          type="button"
          onClick={() => onCreate()}
          className="flex h-12 items-center justify-self-end justify-center gap-2 rounded-xl bg-blue px-5 font-semibold text-white hover:bg-primary-hover m-2"
        >
          <Plus size={19} />
          Vytvoriť nový sklad
        </button>
      </div>
    </div>
  );
}
