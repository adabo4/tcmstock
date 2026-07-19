import type { ReactNode } from "react";

type Props = {
  number: number;
  label: string;
  icon: ReactNode;
  onClick?: () => void;
};

export default function DashboardStatCard({
  number,
  label,
  icon,
  onClick,
}: Props) {
  const className = `
    flex flex-col items-center justify-between gap-1
    rounded-2xl bg-white/10 px-3 py-3
    backdrop-blur-sm
    sm:h-28 sm:flex-row sm:gap-0 sm:px-6
    ${onClick ? "cursor-pointer transition hover:bg-white/20" : ""}
  `;

  const content = (
    <>
      <div>
        <h3 className="text-xl font-bold text-white sm:text-2xl">{number}</h3>

        <p className="mt-0.5 text-xs leading-tight text-white/80 sm:mt-1 sm:text-sm">
          {label}
        </p>
      </div>

      {icon}
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {content}
      </button>
    );
  }

  return <div className={className}>{content}</div>;
}
