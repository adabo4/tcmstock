import { MenuIcon } from "lucide-react";

type MobileMenuButtonProps = {
  onClick: () => void;
};

export default function MobileMenuButton({ onClick }: MobileMenuButtonProps) {
  return (
    <button
      type="button"
      title="Otvoriť menu"
      aria-label="Otvoriť menu"
      onClick={onClick}
      className="
        flex h-12 w-12 shrink-0 items-center justify-center
        rounded-xl border border-slate-200 bg-white
        text-slate-900 shadow-sm transition
        hover:bg-slate-50
        lg:hidden
      "
    >
      <MenuIcon size={25} />
    </button>
  );
}
