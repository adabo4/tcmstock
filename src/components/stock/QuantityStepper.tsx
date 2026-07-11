import { Minus, Plus } from "lucide-react";

type QuantityStepperProps = {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  disabled?: boolean;
};

export default function QuantityStepper({
  value,
  onDecrease,
  onIncrease,
  disabled = false,
}: QuantityStepperProps) {
  return (
    <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={onDecrease}
        disabled={disabled || value === 0}
        className="flex h-11 w-11 items-center justify-center bg-slate-50 text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus size={16} />
      </button>

      <div className="flex h-11 w-16 items-center justify-center border-x border-slate-200 font-bold text-slate-950">
        {value}
      </div>

      <button
        type="button"
        aria-label="Increase quantity"
        onClick={onIncrease}
        disabled={disabled}
        className="flex h-11 w-11 items-center justify-center bg-slate-50 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
