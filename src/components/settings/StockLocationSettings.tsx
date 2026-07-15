import { useState } from "react";
import {
  Building2,
  Check,
  Crown,
  Edit3,
  Plus,
  Trash2,
  Warehouse,
} from "lucide-react";
import { useStockLocation } from "../../context/useStockLocation";
import { useNotification } from "../../context/useNotification";
import {
  deleteStockLocationRequest,
  setDefaultStockLocationRequest,
  updateStockLocationRequest,
} from "../../api/stockLocations";
import CreateStockLocationModal from "../stock/CreateCtockLocationModal";

export default function StockLocationsSettings() {
  const { locations, activeLocationId, isLoading, error, refreshLocations } =
    useStockLocation();

  const { showNotification } = useNotification();

  const [createLocationOpen, setCreateLocationOpen] = useState(false);
  const [editingLocationId, setEditingLocationId] = useState<number | null>(
    null,
  );
  const [editingLocationName, setEditingLocationName] = useState("");
  const [updatingLocationId, setUpdatingLocationId] = useState<number | null>(
    null,
  );

  function startEditingLocation(id: number, name: string) {
    setEditingLocationId(id);
    setEditingLocationName(name);
  }

  function cancelEditingLocation() {
    setEditingLocationId(null);
    setEditingLocationName("");
  }

  async function handleRenameLocation(id: number) {
    const trimmedName = editingLocationName.trim();

    if (!trimmedName) {
      showNotification("Názov skladu je povinný.", "error");
      return;
    }

    try {
      setUpdatingLocationId(id);

      await updateStockLocationRequest(id, {
        name: trimmedName,
      });

      await refreshLocations();

      cancelEditingLocation();

      showNotification("Názov skladu bol zmenený.", "success");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Názov skladu sa nepodarilo zmeniť.";

      showNotification(message, "error");
    } finally {
      setUpdatingLocationId(null);
    }
  }

  async function handleSetDefaultLocation(id: number) {
    try {
      setUpdatingLocationId(id);

      await setDefaultStockLocationRequest(id);
      await refreshLocations();

      showNotification("Predvolený sklad bol zmenený.", "success");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Predvolený sklad sa nepodarilo zmeniť.";

      showNotification(message, "error");
    } finally {
      setUpdatingLocationId(null);
    }
  }

  async function handleDeleteLocation(id: number, name: string) {
    const confirmed = window.confirm(`Naozaj chcete vymazať sklad „${name}“?`);

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingLocationId(id);

      await deleteStockLocationRequest(id);
      await refreshLocations();

      showNotification("Sklad bol vymazaný.", "success");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Sklad sa nepodarilo vymazať.";

      showNotification(message, "error");
    } finally {
      setUpdatingLocationId(null);
    }
  }

  return (
    <>
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Warehouse size={24} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-950">
                Nastavenia skladov
              </h2>

              <p className="mt-1 text-slate-500">
                Premenujte sklady alebo nastavte predvolený sklad.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCreateLocationOpen(true)}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-blue px-5 font-semibold text-white hover:bg-primary-hover"
          >
            <Plus size={19} />
            Vytvoriť nový sklad
          </button>
        </div>

        {isLoading && (
          <p className="mt-8 text-slate-500">Načítavam sklady...</p>
        )}

        {!isLoading && error && (
          <p className="mt-8 rounded-xl bg-red-50 p-4 text-red-600">{error}</p>
        )}

        {!isLoading && !error && locations.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-8 text-center">
            <Warehouse className="mx-auto text-slate-400" size={32} />

            <p className="mt-3 font-semibold text-slate-700">
              Zatiaľ nemáte vytvorený žiadny sklad.
            </p>

            <button
              type="button"
              onClick={() => setCreateLocationOpen(true)}
              className="mt-5 rounded-xl bg-blue px-5 py-3 font-semibold text-white"
            >
              Vytvoriť sklad
            </button>
          </div>
        )}

        {!isLoading && !error && locations.length > 0 && (
          <div className="mt-8 space-y-4">
            {locations.map((location) => {
              const isEditing = editingLocationId === location.id;
              const isUpdating = updatingLocationId === location.id;
              const isActive = activeLocationId === location.id;

              return (
                <div
                  key={location.id}
                  className="rounded-2xl border border-slate-200 p-5"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Building2 size={22} />
                      </div>

                      <div className="min-w-0 flex-1">
                        {isEditing ? (
                          <input
                            value={editingLocationName}
                            onChange={(event) =>
                              setEditingLocationName(event.target.value)
                            }
                            maxLength={50}
                            autoFocus
                            className="h-11 w-full max-w-sm rounded-xl border border-slate-200 px-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                          />
                        ) : (
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate text-lg font-bold text-slate-950">
                              {location.name}
                            </h3>

                            {location.isDefault && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                                <Crown size={13} />
                                Predvolený
                              </span>
                            )}

                            {isActive && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                                <Check size={13} />
                                Aktívny
                              </span>
                            )}
                          </div>
                        )}

                        <p className="mt-1 text-sm text-slate-500">
                          {location._count?.tabletStocks ?? 0} produktov
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() =>
                              void handleRenameLocation(location.id)
                            }
                            className="h-11 rounded-xl bg-blue px-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isUpdating ? "Ukladám..." : "Uložiť"}
                          </button>

                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={cancelEditingLocation}
                            className="h-11 rounded-xl border border-slate-200 px-4 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                          >
                            Zrušiť
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() =>
                              startEditingLocation(location.id, location.name)
                            }
                            className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                          >
                            <Edit3 size={17} />
                            Premenovať
                          </button>

                          {!location.isDefault && (
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() =>
                                void handleSetDefaultLocation(location.id)
                              }
                              className="flex h-11 items-center gap-2 rounded-xl border border-primary/30 px-4 font-semibold text-primary hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Crown size={17} />
                              Nastaviť ako predvolený
                            </button>
                          )}

                          <button
                            type="button"
                            disabled={location.isDefault || isUpdating}
                            onClick={() =>
                              void handleDeleteLocation(
                                location.id,
                                location.name,
                              )
                            }
                            className="flex h-11 items-center gap-2 rounded-xl border border-red-200 px-4 font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Trash2 size={17} />
                            Vymazať
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {location.isDefault && (
                    <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                      Predvolený sklad nie je možné vymazať. Najprv nastavte iný
                      sklad ako predvolený.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <CreateStockLocationModal
        open={createLocationOpen}
        onClose={() => setCreateLocationOpen(false)}
      />
    </>
  );
}
