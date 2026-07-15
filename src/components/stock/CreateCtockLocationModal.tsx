import { useState } from "react";
import { X } from "lucide-react";
import { createStockLocationRequest } from "../../api/stockLocations";
import { useStockLocation } from "../../context/useStockLocation";
import { useNotification } from "../../context/useNotification";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CreateStockLocationModal({ open, onClose }: Props) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { refreshLocations } = useStockLocation();
  const { showNotification } = useNotification();

  if (!open) {
    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    try {
      setIsSubmitting(true);

      await createStockLocationRequest({
        name: trimmedName,
      });

      await refreshLocations();

      showNotification("Sklad bol vytvorený.", "success");

      setName("");
      onClose();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Sklad sa nepodarilo vytvoriť.";

      showNotification(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">
              Vytvoriť nový sklad
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Zadajte názov nového skladu.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Názov skladu
          </label>

          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Napr. Kancelária"
            maxLength={50}
            autoFocus
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2.5 font-medium text-slate-700"
            >
              Zrušiť
            </button>

            <button
              type="submit"
              disabled={!name.trim() || isSubmitting}
              className="rounded-xl bg-indigo-600 px-4 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Vytváram..." : "Vytvoriť sklad"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
